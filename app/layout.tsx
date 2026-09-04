import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from 'next/font/google'
import "./globals.css";
import { Providers } from "./providers";

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Momozin — crie um pedido de namoro que ela vai lembrar pra sempre",
  description:
    "Monte um jogo personalizado com suas fotos e mensagens e faça o pedido de namoro ou compromisso mais criativo. Grátis pra começar.",
  keywords: ["pedido de namoro criativo", "jogo pedido de namoro", "surpresa namoro online", "pedido de compromisso"],
  openGraph: {
    title: "Momozin — o pedido de namoro que se joga",
    description: "Suba fotos, escreva as mensagens e crie uma experiência interativa pra fazer seu pedido.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Momozin",
    images: [{ url: "/og-landing.png", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Momozin — o pedido de namoro que se joga",
    images: ["/og-landing.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
