// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, PlanType } from "@/lib/plans";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Assinatura do webhook inválida", err);
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const existing = await prisma.payment.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existing) {
      return NextResponse.json({ received: true });
    }
    
    const { gamePageId, plan, userId } = session.metadata as {
      gamePageId: string;
      plan: PlanType;
      userId: string;
    };

    const planConfig = PLAN_LIMITS[plan];
    const expiresAt = planConfig.expiresInDays
      ? new Date(Date.now() + planConfig.expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          stripeSessionId: session.id,
          amountCents: session.amount_total ?? planConfig.priceCents,
          currency: session.currency ?? "brl",
          status: "paid",
          payerEmail: session.customer_details?.email ?? "desconhecido",
          gamePageId,
          userId: userId || null,
        },
      });

      await tx.gamePage.update({
        where: { id: gamePageId },
        data: {
          status: "PUBLISHED",
          plan,
          expiresAt,
          userId: userId || undefined, // vincula à conta, se for Premium
        },
      });
    });
  }

  return NextResponse.json({ received: true });
}