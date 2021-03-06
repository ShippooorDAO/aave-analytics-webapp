import { EthAmount } from "../EthAmount";
import { TokenAmount } from "../TokenAmount";
import { UsdAmount } from "../UsdAmount";

export interface AaveAnalyticsApiProviderState {
  tokens: Token[];
}

export interface Token {
  id: string;
  symbol: string;
  priceUsd: UsdAmount;
  decimals: number;
}

export interface Account {
  id: string;
  address: string;
  accountValueUsd: UsdAmount;
  accountValueEth?: EthAmount;
  freeCollateralUsd: UsdAmount;
  freeCollateralEth?: EthAmount;
  ltv?: number;
  maxLtv?: number;
  collateralRatio?: number;
  crossCurrencyRisk?: boolean;
  healthScore?: number;
  tag?: string;
  positions?: TokenAmount[];
}

export interface Transaction {
  id: string;
  txHash: string;
  txType: TransactionType;
  amount: TokenAmount | null;
  amountUsd: UsdAmount;
  accountId: string;
  timestamp: Date;
} 

export interface Liquidation {
  id: string;
  collateralToken: Token;
  principalToken: Token;
  accountId: string;
  liquidator: string;
  amountLiquidatedUsd: UsdAmount;
  penaltyPaidUsd: UsdAmount;
  transactionHash: string;
  timestamp: Date;
}

export enum TransactionType {
  UNKNOWN = 0,
  DEPOSIT = 1,
  BORROW = 2,
  REPAY = 3,
  LIQUIDATE = 4,
}

export interface AccountBaseResponse {
  id: string;
  address: string;
  accountValueUsd: string;
  accountValueEth?: string;
  freeCollateralUsd: string;
  freeCollateralEth?: string;
  ltv?: number;
  maxLtv?: number;
  collateralRatio?: number;
  healthScore?: number;
  tag?: string;
  crossCurrencyRisk?: boolean;
}

export interface AccountsGraphQLSchemaType {
  totalPages: number;
  totalEntries: number;
  accounts: AccountBaseResponse[];
};

export interface AccountsQueryResponse {
  accounts: AccountsGraphQLSchemaType;
}

export interface AccountQueryResponse {
  account: AccountBaseResponse & {
    positions: {
      id: string;
      aTokenBalance: string;
      stableDebt: string;
      variableDebt: string;
      token: {
        id: string;
        priceUsd: string;
      };
    }[];
  };
}

export interface TokenQueryResponse {
  tokens: {
    id: string;
    symbol: string;
    priceUsd: string;
    decimals: number;
  }[];
}

export interface TransactionBaseResponse {
  id: string;
  txHash: string;
  txType: string;
  tokenId: string;
  amount: string;
  amountUsd: string;
  accountId: string;
  timestamp: number;
}

export interface TransactionsQueryResponse {
  transactions: TransactionBaseResponse[];
}


export interface TransactionsQueryResponse {
  transactions: TransactionBaseResponse[];
}

export interface LiquidationsGraphQLSchema {
  totalEntries: number;
  totalPages: number;
  liquidations: Array<{
    id: string;
    collateralToken: {
      symbol: string;
    };
    principalToken: {
      symbol: string;
    };
    account: {
      id: string;
    };
    liquidator: string;
    penaltyPaidUsd: string;
    amountLiquidatedUsd: string;
    timestamp: number;
    transactionHash: string;
  }>;
}

export interface LiquidationsQueryResponse {
  liquidations: LiquidationsGraphQLSchema;
}
