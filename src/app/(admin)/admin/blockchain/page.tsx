// src/app/(admin)/admin/blockchain/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Blocks,
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  Database,
  Clock,
  CheckCircle,
  AlertTriangle,
  Hash,
  Link2,
  Server,
} from "lucide-react";

// Mock blockchain data
const mockBlockchainStats = {
  connected: true,
  chainId: 1337,
  blockNumber: 4523,
  contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  isListening: true,
  networkName: "Ganache Local",
  gasPrice: "20 Gwei",
};

const mockContracts = [
  { name: "P2PLending", address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", status: "active" },
  { name: "MockUSDT", address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", status: "active" },
  { name: "PriceOracle", address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", status: "active" },
  { name: "CollateralManager", address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", status: "active" },
];

const mockRecentEvents = [
  { type: "LoanRequestCreated", time: "2 phút trước", data: "RequestID: 5, Principal: 1000 USDT", color: "text-info" },
  { type: "LoanMatched", time: "15 phút trước", data: "RequestID: 4, Lender: 0x70997...93142", color: "text-success" },
  { type: "LoanRepaid", time: "1 giờ trước", data: "LoanID: 3, Amount: 515 USDT", color: "text-primary" },
  { type: "LoanRequestCreated", time: "2 giờ trước", data: "RequestID: 4, Principal: 2500 USDT", color: "text-info" },
  { type: "LoanMatched", time: "3 giờ trước", data: "RequestID: 3, Lender: 0xf39F...2266", color: "text-success" },
  { type: "LoanRequestCancelled", time: "5 giờ trước ", data: "RequestID: 2, Borrower: 0x3C44...FaD6", color: "text-warning" },
];

const mockSyncHistory = [
  { time: "12:50", synced: 5, errors: 0 },
  { time: "12:45", synced: 5, errors: 0 },
  { time: "12:40", synced: 4, errors: 1 },
  { time: "12:35", synced: 5, errors: 0 },
  { time: "12:30", synced: 5, errors: 0 },
];

export default function BlockchainPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blockchain Monitor</h1>
          <p className="text-foreground-muted mt-1">Giám sát kết nối blockchain và smart contracts</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Đang refresh..." : "Refresh"}
        </button>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card-bg rounded-xl p-5 border border-card-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mockBlockchainStats.connected ? "bg-success-light" : "bg-error-light"}`}>
              {mockBlockchainStats.connected ? (
                <Wifi className="w-5 h-5 text-success" />
              ) : (
                <WifiOff className="w-5 h-5 text-error" />
              )}
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Trạng thái</p>
              <p className={`text-sm font-bold ${mockBlockchainStats.connected ? "text-success" : "text-error"}`}>
                {mockBlockchainStats.connected ? "Đã kết nối" : "Mất kết nối"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg rounded-xl p-5 border border-card-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-info-light">
              <Blocks className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Block Number</p>
              <p className="text-sm font-bold text-foreground">#{mockBlockchainStats.blockNumber}</p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg rounded-xl p-5 border border-card-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/10">
              <Server className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Network</p>
              <p className="text-sm font-bold text-foreground">{mockBlockchainStats.networkName}</p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg rounded-xl p-5 border border-card-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mockBlockchainStats.isListening ? "bg-success-light" : "bg-warning-light"}`}>
              <Activity className={`w-5 h-5 ${mockBlockchainStats.isListening ? "text-success" : "text-warning"}`} />
            </div>
            <div>
              <p className="text-xs text-foreground-muted">Event Listener</p>
              <p className={`text-sm font-bold ${mockBlockchainStats.isListening ? "text-success" : "text-warning"}`}>
                {mockBlockchainStats.isListening ? "Đang lắng nghe" : "Tắt"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Contracts */}
        <div className="bg-card-bg rounded-xl border border-card-border">
          <div className="p-5 border-b border-border">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Smart Contracts
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {mockContracts.map((contract) => (
              <div key={contract.name} className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{contract.name}</p>
                  <p className="text-xs font-mono text-foreground-muted mt-0.5">{contract.address}</p>
                </div>
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-card-bg rounded-xl border border-card-border">
          <div className="p-5 border-b border-border">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Events gần đây
            </h2>
          </div>
          <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto">
            {mockRecentEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-background-tertiary rounded-lg">
                <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Hash className={`w-3.5 h-3.5 ${event.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${event.color}`}>{event.type}</p>
                  <p className="text-xs text-foreground-muted mt-0.5 truncate">{event.data}</p>
                  <p className="text-xs text-foreground-subtle mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sync History */}
      <div className="bg-card-bg rounded-xl border border-card-border">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4" />
            Lịch sử đồng bộ (Cron Job)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-tertiary">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Thời gian</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Đã đồng bộ</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Lỗi</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-foreground-muted uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {mockSyncHistory.map((sync, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-foreground">{sync.time}</td>
                  <td className="py-3 px-4 text-sm font-medium text-success">{sync.synced} loans</td>
                  <td className="py-3 px-4 text-sm font-medium text-error">{sync.errors}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sync.errors === 0 ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}>
                      {sync.errors === 0 ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {sync.errors === 0 ? "Thành công" : "Có lỗi"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
