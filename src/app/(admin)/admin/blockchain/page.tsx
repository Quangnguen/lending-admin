// src/app/(admin)/admin/blockchain/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Blocks, Wifi, WifiOff, RefreshCw, Activity,
  Database, Clock, CheckCircle, AlertTriangle,
  Hash, Link2, Server, Loader2,
} from "lucide-react";

interface BlockchainStatus {
  connected: boolean;
  chainId: number;
  blockNumber: number;
  networkName: string;
  isListening: boolean;
  gasPrice: string;
  contractAddress: string;
}

interface Contract {
  name: string;
  address: string;
  status: string;
}

export default function BlockchainPage() {
  const [status, setStatus] = useState<BlockchainStatus | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/blockchain");
      const data = await res.json();
      if (data.success && data.data) {
        setStatus(data.data.status);
        setContracts(data.data.contracts || []);
      }
    } catch (err) {
      console.error("Failed to fetch blockchain data:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const connected = status?.connected ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blockchain Monitor</h1>
          <p className="text-foreground-muted mt-1">Giám sát kết nối blockchain và smart contracts (dữ liệu thực)</p>
        </div>
        <button onClick={fetchData} disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Đang refresh..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-foreground-subtle">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          Đang kết nối blockchain...
        </div>
      ) : (
        <>
          {/* Connection Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card-bg rounded-xl p-5 border border-card-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${connected ? "bg-success-light" : "bg-error-light"}`}>
                  {connected ? <Wifi className="w-5 h-5 text-success" /> : <WifiOff className="w-5 h-5 text-error" />}
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Trạng thái</p>
                  <p className={`text-sm font-bold ${connected ? "text-success" : "text-error"}`}>
                    {connected ? "Đã kết nối" : "Mất kết nối"}
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
                  <p className="text-sm font-bold text-foreground">#{status?.blockNumber || 0}</p>
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
                  <p className="text-sm font-bold text-foreground">{status?.networkName || "Unknown"}</p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg rounded-xl p-5 border border-card-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status?.isListening ? "bg-success-light" : "bg-warning-light"}`}>
                  <Activity className={`w-5 h-5 ${status?.isListening ? "text-success" : "text-warning"}`} />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Chain ID</p>
                  <p className="text-sm font-bold text-foreground">{status?.chainId || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Contracts */}
          <div className="bg-card-bg rounded-xl border border-card-border">
            <div className="p-5 border-b border-border">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Link2 className="w-4 h-4" /> Smart Contracts
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {contracts.length > 0 ? contracts.map((contract, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{contract.name}</p>
                    <p className="text-xs font-mono text-foreground-muted mt-0.5">{contract.address}</p>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Active
                  </span>
                </div>
              )) : (
                <div className="text-center py-8 text-foreground-subtle">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>Không tìm thấy smart contract nào</p>
                </div>
              )}

              {/* Contract Address from status */}
              {status?.contractAddress && contracts.length === 0 && (
                <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">P2PLending</p>
                    <p className="text-xs font-mono text-foreground-muted mt-0.5">{status.contractAddress}</p>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Active
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gas & Misc Info */}
          <div className="bg-card-bg rounded-xl border border-card-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Thông tin bổ sung</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                <span className="text-sm text-foreground-muted">Gas Price</span>
                <span className="text-sm font-medium text-foreground">{status?.gasPrice || "—"}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                <span className="text-sm text-foreground-muted">Chain ID</span>
                <span className="text-sm font-medium text-foreground">{status?.chainId || "—"}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                <span className="text-sm text-foreground-muted">Listening</span>
                <span className={`text-sm font-medium ${status?.isListening ? "text-success" : "text-error"}`}>
                  {status?.isListening ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
