// auth.ts (raiz do projeto)
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/entrar",
  },
  providers: [
    Google, // lê AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET automaticamente
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null; // conta Google não tem senha

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isPremiumMember: user.isPremiumMember,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // login via Google (ou qualquer provider OAuth futuro)
      if (account?.provider && account.provider !== "credentials" && user?.email) {
        // encontra ou cria o User correspondente pelo e-mail — sem senha,
        // já que a autenticação foi feita pelo Google
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name ?? undefined },
          create: { email: user.email, name: user.name ?? undefined, passwordHash: null },
        });

        token.id = dbUser.id;
        token.isPremiumMember = dbUser.isPremiumMember;
        return token;
      }

      // login via Credentials — o `user` já vem completo do authorize()
      if (user?.id) {
        token.id = user.id;
        token.isPremiumMember = user.isPremiumMember ?? false;
        return token;
      }

      // requisições seguintes: rebusca no banco, pra refletir mudanças
      // (ex: virou Premium depois de já estar logado)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isPremiumMember: true },
        });
        token.isPremiumMember = dbUser?.isPremiumMember ?? false;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isPremiumMember = token.isPremiumMember as boolean;
      }
      return session;
    },
  },
});