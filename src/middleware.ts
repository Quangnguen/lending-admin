import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Chỉ xử lý các route /admin và /verifier
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/verifier")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Chưa đăng nhập → redirect về login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token.role as "ADMIN" | "VERIFIER";

  // ADMIN vào /verifier → redirect về /admin
  if (role === "ADMIN" && pathname.startsWith("/verifier")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // VERIFIER vào /admin → redirect về /verifier
  if (role === "VERIFIER" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/verifier", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/verifier/:path*"],
};
