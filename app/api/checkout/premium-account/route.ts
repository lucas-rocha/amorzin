// app/api/checkout/premium-account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PLAN_LIMITS } from "@/lib/plans";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "É preciso estar logado" }, { status: 401 });
    }
    if (user.isPremiumMember) {
      return NextResponse.json({ error: "Já é Premium" }, { status: 409 });
    }

    const { callbackUrl } = (await req.json()) as { callbackUrl?: string };
    const premiumConfig = PLAN_LIMITS.PREMIUM;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: "Amorzin — conta Premium (pagamento único)" },
            unit_amount: premiumConfig.priceCents,
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: { userId: user.id, type: "PREMIUM_ACCOUNT" },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}${callbackUrl ?? "/dashboard"}?premium=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?premium=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar checkout premium:", err);
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento" }, { status: 500 });
  }
}