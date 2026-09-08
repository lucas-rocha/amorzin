// app/p/[slug]/page.tsx
import type { Metadata } from "next";
import AmorzinSlugClient from "./AmorzinSlugClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getGameForMetadata(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/game-pages/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameForMetadata(slug);

  if (!game) {
    return { title: "Amorzin", robots: { index: false, follow: false } };
  }

  const title = "Alguém preparou uma surpresa pra você 💘";
  const description = "Toque no link pra descobrir. É rapidinho.";

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      images: game.targetPhotoUrl ? [{ url: game.targetPhotoUrl, width: 1200, height: 630 }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: game.targetPhotoUrl ? [game.targetPhotoUrl] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <AmorzinSlugClient slug={slug} />;
}