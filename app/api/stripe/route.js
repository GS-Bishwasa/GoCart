import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ Event received:", event.type);

    const handlePaymentIntent = async (paymentIntentId, isPaid) => {
      const sessionList = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });

      if (!sessionList.data.length) {
        console.log("⚠️ No session found for this payment intent");
        return;
      }

      const { orderIds, userId, appId } = sessionList.data[0].metadata || {};

      if (appId !== "gocart") {
        console.log("❌ Invalid appId:", appId);
        return;
      }

      const orderIdsArray = orderIds ? orderIds.split(",") : [];

      if (isPaid) {
        console.log("✅ Payment succeeded. Updating orders...");
        await Promise.all(
          orderIdsArray.map(async (orderId) => {
            await prisma.order.update({
              where: { id: orderId },
              data: { isPaid: true },
            });
          })
        );

        await prisma.user.update({
          where: { id: userId },
          data: { cart: {} },
        });
      } else {
        console.log("🗑 Payment canceled. Deleting orders...");
        await Promise.all(
          orderIdsArray.map(async (orderId) => {
            await prisma.order.delete({ where: { id: orderId } });
          })
        );
      }
    };

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntent(event.data.object.id, true);
        break;

      case "payment_intent.canceled":
        await handlePaymentIntent(event.data.object.id, false);
        break;

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Stripe webhook error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const config = {
  api: { bodyParser: false },
};
