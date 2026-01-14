import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: "ADMIN" | "VERIFIER";
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: "ADMIN" | "VERIFIER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: "ADMIN" | "VERIFIER";
  }
}
