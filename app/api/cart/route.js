import prisma from "@/lib/prisma";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



// update user cart
export async function POST(request) {
    try {

        const { userId } = getAuth(request)
        // const { userId } = await auth()
        const { cart } = await request.json()

        // save cart to the user object
        console.log("userId is : ", userId )
        console.log("cart is : ", cart )
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                cart: cart,
            },
        })

        return NextResponse.json({ message: "Cart updated successfully" })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}



// Get User cart
export async function GET(request) {
    try {

        // const { userId } = await auth()
        const { userId } = getAuth(request)

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
console.log(userId)
console.log(user.cart)
        return NextResponse.json({ cart: user.cart || {} })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}