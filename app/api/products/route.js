import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(request) {
    try {

        let products = await prisma.product.findMany({
            where: {
                inStock: true,
            },
            include: {
                rating: {
                    select: {
                        rating: true,
                        review: true,
                        createdAt: true,
                        user: {
                            select: {
                                name: true,
                                image: true,
                            }
                        },
                    }
                },
                store: true,
            },
            orderBy: {
                createdAt: "desc",
            }
        })

        // remove products with store isActive false
        products = products.filter(product => product.store.isActive);

        console.log("Fetched", products.length, "products");


        return NextResponse.json({ products });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}