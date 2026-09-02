// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PLAN_LIMITS, PlanType } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth"; // sua função de sessão (Auth.js/Clerk)

// app/api/checkout/route.ts
export async function POST(req: NextRequest) {
  try {
    const { gamePageId, plan } = (await req.json()) as {
      gamePageId: string;
      plan: PlanType;
    };

    const gamePage = await prisma.gamePage.findUnique({ where: { id: gamePageId } });
    if (!gamePage) {
      return NextResponse.json({ error: "Página não encontrada" }, { status: 404 });
    }

    const planConfig = PLAN_LIMITS[plan];

    let userId: string | null = null;
    let userEmail: string | undefined;
    if (planConfig.requiresAccount) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Cadastro necessário para este plano" }, { status: 401 });
      }
      userId = user.id;
      userEmail = user.email;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: `Momozin — plano ${planConfig.label}` },
            unit_amount: planConfig.priceCents,
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      metadata: { gamePageId, plan, userId: userId ?? "" },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${gamePage.slug}?paid=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${gamePage.slug}?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar checkout:", err); // ← agora aparece completo no terminal
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento" }, { status: 500 });
  }
}