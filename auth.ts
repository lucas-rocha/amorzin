// auth.ts (raiz do projeto)
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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
        if (!user || !user.passwordHash) return null;

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
    async jwt({ token, user }) {
      if (user) {
        // login acabou de acontecer — o `user` já veio completo do authorize()
        token.id = user.id as string;
        token.isPremiumMember = user.isPremiumMember ?? false;
      } else if (token.id) {
        // requisições seguintes: rebusca no banco, pra refletir se a pessoa
        // virou Premium depois de já estar logada (ex: acabou de pagar)
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