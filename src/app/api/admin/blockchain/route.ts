// src/app/api/admin/blockchain/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchBackend } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.backendToken || null;

    const [statusData, contractData] = await Promise.all([
      fetchBackend("/loans/blockchain/status", token),
      fetchBackend("/loans/blockchain/contract-info", token),
    ]);

    const status = statusData?.data || statusData || {};
    const contracts = contractData?.data || contractData || {};

    return NextResponse.json({
      success: true,
      data: {
        status: {
          connected: status.connected ?? false,
          chainId: status.chainId || 0,
          blockNumber: status.blockNumber || 0,
          networkName: status.networkName || "Unknown",
          isListening: status.isListening ?? false,
          gasPrice: status.gasPrice || "0",
          contractAddress: status.contractAddress || contracts.address || "",
        },
        contracts: contracts.contracts || [
          { name: contracts.name || "P2PLending", address: contracts.address || "N/A", status: "active" },
        ],
      },
    });
  } catch (error) {
    console.error("[Blockchain] Error:", error);
    return NextResponse.json({
      success: false,
      data: { status: { connected: false }, contracts: [] },
    }, { status: 500 });
  }
}
