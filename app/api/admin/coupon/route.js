import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Add new coupon
export async function POST(request) {
    try {
        const { userId } = await auth()
        const isAdmin = await authAdmin(userId)
        
        if (!isAdmin) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 })
        }
        
        const { newCoupon } = await request.json()  // Changed from 'coupon' to 'newCoupon'
        newCoupon.code = newCoupon.code.toUpperCase()
        
        await prisma.coupon.create({
            data: newCoupon
        }).then(async (newCoupon) => { 
            // Run Inngest sheduler function to delete coupon on expire
await inngest.send({
    name:"app/coupon.expired",
    data:{
        code: newCoupon.code,
        expires_at: newCoupon.expiresAt
    }
})
        })


        
        return NextResponse.json({ message: "Coupon added successfully" })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Delete coupon /api/admin/coupon?code=couponCode
export async function DELETE(request) {
    try {
        const { userId } = await auth()
        const isAdmin = await authAdmin(userId)
        
        if (!isAdmin) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 })
        }
        
        const { searchParams } = request.nextUrl
        const code = searchParams.get("code")
        
        await prisma.coupon.delete({
            where: {
                code
            }
        })
        
        return NextResponse.json({ message: "Coupon deleted successfully" })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Get all coupons
export async function GET(request) {
    try {
        const { userId } = await auth()
        const isAdmin = await authAdmin(userId)
        
        if (!isAdmin) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 })
        }
        
        const coupons = await prisma.coupon.findMany({})
        
        return NextResponse.json({ coupons })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}