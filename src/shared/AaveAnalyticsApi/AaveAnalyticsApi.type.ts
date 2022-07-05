import { BigNumber } from "ethers";
import TokenAmount from "../TokenAmount";

export interface AaveAnalyticsApiProviderState {
    tokens: Token[];
}

export interface Token {
    id: string;
    symbol: string;
    priceUsd: BigNumber;
    decimals: number;
}

export interface Account {
    id: string;
    address: string;
    accountValue: BigNumber;
    freeCollateral: BigNumber;
    ltv: number;
    collateralRatio: number;
    crossCurrencyRisk: boolean;
    tag?: string;
    positions?: TokenAmount[];
}

export interface Transaction {
  id: string;
  txHash: string;
  txType: TransactionType;
  tokenAmount: TokenAmount | null;
  amountUSD: number;
  accountId: string;
  timestamp: Date;
}

export enum TransactionType {
  UNKNOWN = 0,
  DEPOSIT = 1,
  BORROW = 2,
  REPAY = 3,
}

export interface AccountBaseResponse {
  id: string;
  address: string;
  accountValue: string;
  freeCollateral: string;
  ltv: number;
  collateralRatio: number;
  tag?: string;
  crossCurrencyRisk: boolean;
}

export interface AccountsQueryResponse {
  accounts: AccountBaseResponse[];
}

export interface AccountQueryResponse {
  account: AccountBaseResponse & {
    positions: {
      balance: string;
      tokenId: string;
    }[];
  };
}


export interface TokenQueryResponse {
    tokens: {
        id: string;
        symbol: string;
        price_usd: string;
        decimals: number;
    }[];
}

export interface LiquidationsQueryResponse {
    liquidations: {
        id: string;
    }[]
}

export interface TransactionsQueryResponse {
  transactions: {
    id: string;
    txHash: string;
    txType: string;
    tokenId: string;
    amount: string;
    amountUSD: number;
    accountId: string;
    timestamp: number;
  }[];
}
