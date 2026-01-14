// Settings Types
export interface LendingPolicies {
  minLoanAmount: number;
  maxLoanAmount: number;
  maxDuration: number;
  baseInterestRate: number;
  collateralRatio: number;
}

export interface FeeConfiguration {
  // Revenue & Origination
  platformFee: number;
  originationFeeFlat: number;
  serviceFeeMonthly: number;
  // Penalties & Delinquency
  lateFeeStructure: "Flat Amount" | "Percentage";
  lateFeeValue: number;
  gracePeriod: number;
  // Adjustments
  prepaymentPenalty: number;
  applicableTax: number;
}

export interface RiskThresholds {
  emergencyCircuitBreaker: boolean;
  daysOverdueDefault: number;
  healthFactorThreshold: number;
  globalDebtCeiling: number;
  autoLiquidationProtocol: boolean;
  highValueReview: boolean;
}

export interface Integrations {
  rpcEndpointUrl: string;
  backupRpcEndpoint: string;
  webhookUrl: string;
  kycProvider: string;
  kycApiKey: string;
  kycSecretKey: string;
}

export interface SystemConfig {
  lending: LendingPolicies;
  fees: FeeConfiguration;
  risk: RiskThresholds;
  integrations: Integrations;
}

export type SettingsTab = "lending" | "fees" | "risk" | "integrations";

// Mock data
export const mockSystemConfig: SystemConfig = {
  lending: {
    minLoanAmount: 1000,
    maxLoanAmount: 50000,
    maxDuration: 365,
    baseInterestRate: 5.5,
    collateralRatio: 150,
  },
  fees: {
    platformFee: 2.5,
    originationFeeFlat: 50.0,
    serviceFeeMonthly: 5.0,
    lateFeeStructure: "Flat Amount",
    lateFeeValue: 35.0,
    gracePeriod: 7,
    prepaymentPenalty: 1.0,
    applicableTax: 0.0,
  },
  risk: {
    emergencyCircuitBreaker: false,
    daysOverdueDefault: 90,
    healthFactorThreshold: 1.05,
    globalDebtCeiling: 10000000,
    autoLiquidationProtocol: true,
    highValueReview: true,
  },
  integrations: {
    rpcEndpointUrl: "https://mainnet.infura.io/v3/4928492...",
    backupRpcEndpoint: "",
    webhookUrl: "https://api.internal.system/hooks/loans",
    kycProvider: "SUMSUB",
    kycApiKey: "sk_live_abc123xyz789def456",
    kycSecretKey: "secret_key_xyz789abc123",
  },
};
