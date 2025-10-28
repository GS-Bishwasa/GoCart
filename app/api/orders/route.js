import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST(request) {
    try {
        const { userId, has } = getAuth(request)
        
        if (!userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 })
        }
        
        const { addressId, items, couponCode, paymentMethod } = await request.json()

        // check if all required fields are present
        if (!addressId || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "missing order details" }, { status: 400 })
        }

        let coupon = null
        if (couponCode) {
            coupon = await prisma.coupon.findUnique({
                where: {
                    code: couponCode,
                },
            })

            if (!coupon) {
                return NextResponse.json({ error: "Coupon not found" }, { status: 400 })
            }
        }

        // check if coupon applicable for new users
        if (couponCode && coupon.forNewUser) {
            const userorders = await prisma.order.findMany({
                where: { userId }
            })
            if (userorders.length > 0) {
                return NextResponse.json({ error: "Coupon valid for new users only" }, { status: 400 })
            }
        }

        const isPlusMember = has && has({ plan: 'plus' })

        // check if coupon applicable for members
        if (couponCode && coupon.forMember) {
            if (!isPlusMember) {
                return NextResponse.json({ error: "Coupon valid for members only" }, { status: 400 })
            }
        }

        // Group orders by storeId using a Map
        const ordersByStore = new Map()

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.id }
            })
            
            if (!product) {
                return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 400 })
            }
            
            const storeId = product.storeId
            if (!ordersByStore.has(storeId)) {
                ordersByStore.set(storeId, [])
            }
            ordersByStore.get(storeId).push({ ...item, price: product.price })
        }

        let orderIds = [];
        let fullAmount = 0;
        let isShippingFeeAdded = false

        // create orders for each seller
        for (const [storeId, sellerItems] of ordersByStore.entries()) {
            // Fixed: item.price instead of items.price
            let total = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

            // Fixed: subtract discount, not add
            if (couponCode && coupon) {
                total -= (total * coupon.discount) / 100;
            }

            // Add shipping fee for non-plus members
            if (!isPlusMember && !isShippingFeeAdded) {
                total += 5;
                isShippingFeeAdded = true
            }

            fullAmount += parseFloat(total.toFixed(2))

            const order = await prisma.order.create({
                data: {
                    user: {
                        connect: { id: userId }  // Use relation instead of userId
                    },
                    store: {
                        connect: { id: storeId }  // Use relation instead of storeId
                    },
                    address: {
                        connect: { id: addressId }  // Use relation instead of addressId
                    },
                    total: parseFloat(total.toFixed(2)),
                    paymentMethod: paymentMethod,
                    isCouponUsed: coupon ? true : false,
                    coupon: coupon ? coupon : {},
                    orderItems: {
                        create: sellerItems.map(item => ({
                            product: {
                                connect: { id: item.id }
                            },
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            })
            orderIds.push(order.id)
        }

        if (paymentMethod === "STRIPE") {
            const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
            const origin = await request.headers.get('origin')

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data:{
                        currency: 'usd',
                        product_data: {
                            name: 'Order'
                        },
                        unit_amount: Math.round(fullAmount * 100),
                    },
                    quantity: 1
                }],
                expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Current time + 30 minutes
                mode: 'payment',
                success_url: `${origin}/loading?nextUrl=orders`,
                cancel_url: `${origin}/cart`,
                metadata: {
                    orderIds: orderIds.join(','),
                    userId,
                    appId: 'gocart'
                }
            })

            return NextResponse.json({session})
        }

        // clear the cart
        await prisma.user.update({
            where: { id: userId },
            data: { cart: {} }
        })

        return NextResponse.json({ 
            message: "Order Placed Successfully",
            orderIds,
            totalAmount: fullAmount
        })

    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}



// Get all orders for user
export async function GET(request) {
    try {

        const { userId } = getAuth(request)
        console.log("The userId is: ", userId)
        const orders = await prisma.order.findMany({
            where: {
                userId, OR: [
                    { paymentMethod: PaymentMethod.COD },
                    { AND: [{ paymentMethod: PaymentMethod.STRIPE }, { isPaid: true }] }
                ]
            },
            include: {
                orderItems: { include: { product: true } },
                address: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ orders })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}