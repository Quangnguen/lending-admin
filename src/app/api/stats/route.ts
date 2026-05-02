// src/app/api/stats/route.ts
import { NextResponse } from "next/server";

/**
 * API Stats endpoint cho Admin Dashboard.
 * Trong production, sẽ gọi đến Backend API /api/loans/stats.
 * Hiện tại trả mock data cho demo.
 */
export async function GET() {
  try {
    // Production: Gọi Backend API
    // const backendUrl = process.env.BACKEND_URL || "http://localhost:9000";
    // const res = await fetch(`${backendUrl}/api/loans/stats`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // const data = await res.json();

    // Mock data cho demo
    const stats = {
      requests: {
        total: 41,
        pending: 8,
        funded: 25,
        rejected: 5,
        cancelled: 3,
      },
      loans: {
        total: 41,
        active: 12,
        repaid: 25,
        overdue: 3,
        defaulted: 1,
      },
      values: {
        totalDisbursed: 45200,
        totalInterest: 3150,
        totalRepaid: 28100,
        currency: "USDT",
      },
      users: {
        total: 156,
        withWallet: 24,
        kycVerified: 89,
      },
      blockchain: {
        connected: true,
        chainId: 1337,
        blockNumber: 4523,
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        eventsListening: true,
      },
      repaymentRate: 92.3,
      defaultRate: 2.4,
      weeklyVolume: [
        { day: "T2", count: 3, amount: 2500 },
        { day: "T3", count: 5, amount: 4200 },
        { day: "T4", count: 2, amount: 1800 },
        { day: "T5", count: 7, amount: 6100 },
        { day: "T6", count: 4, amount: 3500 },
        { day: "T7", count: 6, amount: 5200 },
        { day: "CN", count: 1, amount: 800 },
      ],
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
