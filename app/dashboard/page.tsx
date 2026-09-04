// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/entrar?callbackUrl=/dashboard");
  }

  const gamePages = await prisma.gamePage.findMany({
    where: { userId: session.user.id },
    include: { targetPhotos: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const games = gamePages.map((g) => ({
    id: g.id,
    slug: g.slug,
    loverName: g.loverName,
    status: g.status,
    plan: g.plan,
    createdAt: g.createdAt.toISOString(),
    expiresAt: g.expiresAt?.toISOString() ?? null,
    thumbnailUrl: g.targetPhotos[0]?.url ?? null,
  }));

  return (
    <DashboardClient
      games={games}
      userName={session.user.name ?? session.user.email ?? ""}
    />
  );
}