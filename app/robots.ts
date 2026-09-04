import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/p/",
          "/criar",
          "/preview/",
          "/dashboard",
          "/conta",
          "/entrar",
          "/cadastro",
          "/compartilhar/",
          "/checkout/",
          "/api/",
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}