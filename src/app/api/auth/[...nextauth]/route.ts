// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { User } from "next-auth";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:9000/api/v1";

// ============================================================
// Tài khoản nội bộ FALLBACK khi backend không khả dụng
// ============================================================
const INTERNAL_ACCOUNTS = [
  {
    id: "1",
    name: "System Administrator",
    email: "admin@loanmanager.com",
    password: "admin123",
    role: "ADMIN" as const,
  },
  {
    id: "2",
    name: "KYC Verifier",
    email: "verifier@loanmanager.com",
    password: "verifier123",
    role: "VERIFIER" as const,
  },
];

const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // ===== 1) Thử đăng nhập qua Backend API thật =====
        try {
          console.log(`[Auth] Đang login backend cho: ${email}`);
          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              deviceId: "admin-portal",
              deviceName: "Admin Dashboard",
              deviceType: "web",
            }),
          });

          const data = await res.json();
          console.log("[Auth] Backend response status:", res.status, "hasToken:", !!data?.data?.accessToken, "requireOtp:", !!data?.data?.requireOtp);

          // Backend login thành công — trả về accessToken
          if (data?.data?.accessToken) {
            const accessToken = data.data.accessToken;
            const userData = data.data.user || {};

            // Xác định role dựa trên dữ liệu backend
            let role = "ADMIN" as "ADMIN" | "VERIFIER";
            if (userData.role === "admin" || userData.role === "super_admin") {
              role = "ADMIN";
            } else {
              role = "VERIFIER";
            }

            console.log(`[Auth] ✅ Backend login thành công: ${email}, role: ${role}`);

            return {
              id: userData._id || userData.id || email,
              name: userData.fullName || email,
              email: userData.email || email,
              role,
              backendToken: accessToken,
            };
          }

          // Backend trả về requireOtp — login cần OTP
          if (data?.data?.requireOtp) {
            console.warn("[Auth] ⚠️ Backend yêu cầu OTP cho:", email, "- Kiểm tra console backend để lấy OTP hoặc tạo tài khoản admin với role admin/super_admin");
          }

          console.warn("[Auth] Backend login thất bại:", data?.message || "Unknown error");
        } catch (error: any) {
          console.warn("[Auth] ❌ Không kết nối được backend:", error?.message);
        }

        // ===== 2) Fallback: Tài khoản nội bộ =====
        const account = INTERNAL_ACCOUNTS.find(
          (acc) => acc.email === email && acc.password === password
        );

        if (account) {
          // Cố gắng lấy token từ backend cho tài khoản nội bộ
          let backendToken: string | undefined;
          try {
            console.log(`[Auth] Fallback: thử lấy token backend cho ${email}`);
            const tokenRes = await fetch(`${BACKEND_URL}/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                password,
                deviceId: "admin-portal",
                deviceName: "Admin Dashboard",
                deviceType: "web",
              }),
            });
            const tokenData = await tokenRes.json();
            console.log("[Auth] Fallback response:", tokenRes.status, "hasToken:", !!tokenData?.data?.accessToken);
            if (tokenData?.data?.accessToken) {
              backendToken = tokenData.data.accessToken;
              console.log("[Auth] ✅ Fallback: lấy được backend token");
            }
          } catch (err: any) {
            console.warn("[Auth] Fallback: không lấy được token:", err?.message);
          }

          return {
            id: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
            backendToken,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.backendToken = user.backendToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.role) session.user.role = token.role;
        if (token.name) session.user.name = token.name;
        if (token.backendToken) session.user.backendToken = token.backendToken as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
