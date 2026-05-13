import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: "ADMIN" | "VERIFIER";
    backendToken?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: "ADMIN" | "VERIFIER";
      backendToken?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: "ADMIN" | "VERIFIER";
    backendToken?: string;
  }
}
