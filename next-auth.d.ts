import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    role: UserRole
    emailVerified: Date
}

declare module "next-auth" {
    interface Session {
      user: ExtendedUser;
  }
}