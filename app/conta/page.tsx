// app/conta/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ContaClient from "./ContaClient";

export default async function ContaPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar?callbackUrl=/conta");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, isPremiumMember: true, premiumSince: true, createdAt: true },
  });

  if (!user) redirect("/entrar");

  return (
    <ContaClient
      user={{
        name: user.name,
        email: user.email,
        isPremiumMember: user.isPremiumMember,
        premiumSince: user.premiumSince?.toISOString() ?? null,
        createdAt: user.createdAt.toISOString(),
      }}
    />
  );
}