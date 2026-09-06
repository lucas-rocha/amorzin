// lib/email.ts
import { resend } from "./resend";
import GameLinkEmail from "@/emails/GameLinkEmail";
import PremiumWelcomeEmail from "@/emails/PremiumWelcomeEmail";

export async function sendGameLinkEmail(to: string, link: string, loverName?: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: "Seu Momozin está pronto 💛",
      react: GameLinkEmail({ link, loverName }),
    });
  } catch (err) {
    // e-mail é "best effort" — não deve derrubar o webhook se falhar
    console.error("Falha ao enviar e-mail do link do jogo:", err);
  }
}

export async function sendPremiumWelcomeEmail(to: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: "Bem-vindo ao Momozin Premium ✨",
      react: PremiumWelcomeEmail({ dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard` }),
    });
  } catch (err) {
    console.error("Falha ao enviar e-mail de boas-vindas Premium:", err);
  }
}