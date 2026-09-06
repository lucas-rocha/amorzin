import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteGamePhotos } from "@/lib/storage-cleanup";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const expiredGames = await prisma.gamePage.findMany({
    where: { status: "PUBLISHED", expiresAt: { lt: new Date() } },
    select: { id: true },
  });

  let expiredCount = 0;
  let deletedPhotosCount = 0;

  for (const game of expiredGames) {
    try {
      const { deleted } = await deleteGamePhotos(game.id);
      deletedPhotosCount += deleted;

      await prisma.gamePage.update({
        where: { id: game.id },
        data: { status: "EXPIRED" },
      });
      expiredCount++;
    } catch (err) {
      // se falhar num jogo específico, não marca como EXPIRED — tenta de novo
      // no próximo run, em vez de perder o rastro das fotos que não foram apagadas
      console.error(`Falha ao expirar o jogo ${game.id}:`, err);
    }
  }

  return NextResponse.json({ expiredCount, deletedPhotosCount });
}