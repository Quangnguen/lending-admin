"use client";

import { useState } from "react";
import { Plug, Bell, Shield, Copy, Eye, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Integrations } from "./types";

interface IntegrationsTabProps {
  data: Integrations;
  isEditMode: boolean;
  onChange: (data: Integrations) => void;
}

export default function IntegrationsTab({ data, isEditMode, onChange }: IntegrationsTabProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleChange = (field: keyof Integrations, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskValue = () => {
    return "••••••••••••";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Plug className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">System Integrations</h3>
            <p className="text-sm text-foreground-muted">Configure external service connections and API keys.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-medium">Documentation</span>
        </button>
      </div>

      {/* Blockchain Connection */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Plug className="w-5 h-5 text-foreground" />
          <h4 className="text-base font-semibold text-foreground">Blockchain Connection</h4>
        </div>

        <div className="space-y-5">
          {/* RPC Endpoint URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-foreground">RPC Endpoint URL</label>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded">Active</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={data.rpcEndpointUrl}
                onChange={(e) => handleChange("rpcEndpointUrl", e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-2.5 pr-10 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(data.rpcEndpointUrl)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-foreground-muted mt-1.5">Primary endpoint for on-chain interactions.</p>
          </div>

          {/* Backup RPC Endpoint */}
          <div>
            <label className="text-sm text-foreground mb-2 block">Backup RPC Endpoint (Optional)</label>
            <input
              type="text"
              value={data.backupRpcEndpoint}
              onChange={(e) => handleChange("backupRpcEndpoint", e.target.value)}
              disabled={!isEditMode}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-foreground" />
          <h4 className="text-base font-semibold text-foreground">Notifications</h4>
        </div>

        <div>
          <label className="text-sm text-foreground mb-2 block">Webhook Notification URL</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={data.webhookUrl}
              onChange={(e) => handleChange("webhookUrl", e.target.value)}
              disabled={!isEditMode}
              className="flex-1 px-4 py-2.5 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed font-mono text-sm"
            />
            <button className="px-4 py-2.5 border border-card-border rounded-lg text-foreground hover:bg-sidebar-bg transition-colors text-sm font-medium">
              Test Payload
            </button>
          </div>
          <p className="text-xs text-foreground-muted mt-1.5">System events will be POSTed to this URL.</p>
        </div>
      </div>

      {/* KYC Provider */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-foreground" />
            <h4 className="text-base font-semibold text-foreground">KYC Provider</h4>
          </div>
          <span className="px-2.5 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
            {data.kycProvider}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-foreground">API Key</label>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                {showApiKey ? "Hide" : "Reveal"}
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={showApiKey ? data.kycApiKey : maskValue()}
                onChange={(e) => handleChange("kycApiKey", e.target.value)}
                disabled={!isEditMode || !showApiKey}
                className="w-full px-4 py-2.5 pr-10 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(data.kycApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secret Key */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-foreground">Secret Key</label>
              <button
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Rotate
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={showSecretKey ? data.kycSecretKey : maskValue()}
                onChange={(e) => handleChange("kycSecretKey", e.target.value)}
                disabled={!isEditMode || !showSecretKey}
                className="w-full px-4 py-2.5 pr-10 bg-sidebar-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed font-mono text-sm"
              />
              <button
                onClick={() => {
                  setShowSecretKey(!showSecretKey);
                  copyToClipboard(data.kycSecretKey);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 mt-5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200 leading-relaxed">
            Rotating keys will immediately invalidate current active sessions for the KYC provider. 
            Ensure your backend services are ready to accept the new credentials before rotating.
          </p>
        </div>
      </div>
    </div>
  );
}
