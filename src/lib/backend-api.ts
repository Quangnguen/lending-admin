// src/lib/backend-api.ts
// Server-side utility để gọi NestJS Backend API (sử dụng JWT token từ session)

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:9000/api/v1";

/**
 * Chuyển đổi MongoDB Decimal128 ({$numberDecimal: "..."}) thành số thường
 * Đệ quy xử lý nested objects và arrays
 */
export function sanitizeMongoData(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  // Decimal128 → number
  if (typeof obj === "object" && "$numberDecimal" in obj) {
    return parseFloat(obj.$numberDecimal);
  }

  // ObjectId → string
  if (typeof obj === "object" && "$oid" in obj) {
    return obj.$oid;
  }

  // Date → string
  if (typeof obj === "object" && "$date" in obj) {
    return obj.$date;
  }

  // Array
  if (Array.isArray(obj)) {
    return obj.map(sanitizeMongoData);
  }

  // Object — đệ quy
  if (typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      result[key] = sanitizeMongoData(obj[key]);
    }
    return result;
  }

  return obj;
}

/**
 * Gọi API backend với Bearer token (từ NextAuth session)
 * Tự động sanitize MongoDB special types
 */
export async function fetchBackend(
  path: string,
  token?: string | null,
  options: RequestInit = {}
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${BACKEND_URL}${path}`;
  console.log(`[BackendAPI] ${path} → token: ${token ? "YES" : "NO"}`);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.warn(`[BackendAPI] ${path} => HTTP ${res.status}`, errorText.substring(0, 200));
      return null;
    }

    const raw = await res.json();
    return sanitizeMongoData(raw);
  } catch (error: any) {
    console.error(`[BackendAPI] Lỗi kết nối ${url}:`, error?.message || error);
    return null;
  }
}
