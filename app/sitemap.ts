import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    // se criar /como-funciona, /planos como páginas próprias no futuro, entram aqui
  ];
}