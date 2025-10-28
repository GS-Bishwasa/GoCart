import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// toggle stock of a product
export async function POST(request) {
    try {
        // const { userId } =  await auth()
        const {userId} =  getAuth(request)  // Changed: get both values
        console.log("request is ", request)
        console.log('User ID from auth:', userId); // Debug log
        const { productId } = await request.json()
        
        if (!productId) {
            return NextResponse.json({ error: "missing details: productId" }, { status: 400 })
        }
        
        const storeId = await authSeller(userId)  // Changed: get both values
        
        if (!storeId) {  // Changed: check both
            return NextResponse.json({ error: "not authorized" }, { status: 401 })
        }
        
        // check if product exists
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                storeId
            },
        })
        
        if (!product) {
            return NextResponse.json({ error: "product not found" }, { status: 404 })
        }
        
        await prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                inStock: !product.inStock,
            }
        })
        
        return NextResponse.json({ message: "Product stock updated successfully" })  // Changed: use "message" not "status"
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}