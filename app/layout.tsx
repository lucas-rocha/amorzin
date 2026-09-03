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
  title: "Momozin",
  description: "Crie um pedido de namoro ou compromisso interativo e surpreenda quem você ama."
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
