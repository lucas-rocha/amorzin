// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isPremiumMember: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    isPremiumMember?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    isPremiumMember: boolean;
  }
}