import { prisma } from "./prisma";

export interface GamePageData {
  requiredHits: number;
  targetPhotoUrl: string | null;
  couplePhotoUrls: string[];
  hitMessages: string[];
  missMessages: string[];
  finalQuestion: string;
  acceptButtonText: string;
  showWatermark: boolean;
}

const DEMO_PAGE: GamePageData = {
  requiredHits: 8,
  targetPhotoUrl: null,
  couplePhotoUrls: [],
  hitMessages: [
    "cada acerto é um pouco mais de você",
    "meu coração mira certo quando é você",
    "não desisto até te conquistar",
    "quase lá 💘"
  ],
  missMessages: ["quase! 💔", "essa quase foi!"],
  finalQuestion: "Quer namorar comigo?",
  acceptButtonText: "Sim, eu aceito 💍",
  showWatermark: true
};

/**
 * Busca os dados públicos de uma página pelo slug.
 * Em dev, sem banco configurado (ou pro slug "exemplo"), cai no modo demo
 * pra você conseguir ver a página funcionando antes de ligar o Postgres.
 */
export async function getGamePageBySlug(slug: string): Promise<GamePageData | null> {
  if (slug === "exemplo" || !process.env.DATABASE_URL) {
    return DEMO_PAGE;
  }

  try {
    const page = await prisma.gamePage.findUnique({
      where: { slug },
      include: {
        targetPhotos: { orderBy: { order: "asc" } },
        hitMessages: { orderBy: { order: "asc" } },
        missMessages: { orderBy: { order: "asc" } }
      }
    });

    if (!page || page.status !== "PUBLISHED") return null;
    if (page.expiresAt && page.expiresAt < new Date()) return null;

    return {
      requiredHits: page.requiredHits,
      targetPhotoUrl: page.targetPhotos[0]?.url ?? null,
      couplePhotoUrls: page.targetPhotos.slice(1).map((p: { url: string }) => p.url),
      hitMessages: page.hitMessages.map((m: { text: string }) => m.text),
      missMessages: page.missMessages.map((m: { text: string }) => m.text),
      finalQuestion: page.finalQuestion,
      acceptButtonText: page.acceptButtonText,
      showWatermark: page.plan === "BASICO"
    };
  } catch {
    // Banco ainda não configurado/migrado — cai no modo demo em vez de derrubar a página.
    return DEMO_PAGE;
  }
}
