import { gql } from "@apollo/client";
import { CurrencyAmount } from "../CurrencyAmount";
import { UsdAmount } from "../UsdAmount";
import { Token } from "./AaveAnalyticsApi.type";

export const TOKENS_QUERY = gql`
{
    tokens {
        id
        symbol
        decimals
        priceUsd
    }
}
`;

export enum Operator {
  EQ = 'EQ',
  SM_EQ = 'SM_EQ',
  SM = 'SM',
  GT_EQ = 'GT_EQ',
  GT = 'GT',
}

export enum FieldType {
  UNKNOWN,
  BIG_INT,
  FLOAT,
  STRING,
  BOOLEAN,
}

export interface Filters {
  bigintFilters?: { field: string; value: string; operator: Operator }[];
  floatFilters?: { field: string; value: number; operator: Operator }[];
  boolFilters?: { field: string; value: boolean }[];
  stringFilters?: { field: string; contains: string }[];
}

export const fieldTypes = {
  accountValueUsd: FieldType.BIG_INT,
  freeCollateralUsd: FieldType.BIG_INT,
  ltv: FieldType.FLOAT,
  maxLtv: FieldType.FLOAT,
  collateralRatio: FieldType.FLOAT,
  healthScore: FieldType.FLOAT,
  crossCurrencyRisk: FieldType.BOOLEAN,
};

export type AccountSortBy =
  | 'accountValueUsd'
  | 'freeCollateralUsd'
  | 'loanToValue'
  | 'collateralRatio'
  | 'healthScore'
  | 'crossCurrencyRisk';

export type SortDirection = 'DESC' | 'ASC';

export interface AccountsQueryParams {
  sortBy?: AccountSortBy;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
  filter?: Filters;
  simulatedTokenPrices?: Array<{ token: Token; priceUsd: UsdAmount }>;
  search?: string;
}

export function createAccountsQueryVariables(params: AccountsQueryParams) {
    return {
      ...params,
      simulatedTokenPrices: params.simulatedTokenPrices?.map((s) => ({
        tokenId: s.token.id,
        priceUsd: s.priceUsd.n.toString(),
      })),
    };
};

export const ACCOUNTS_QUERY = gql`
  query getAccounts(
    $simulatedTokenPrices: [TokenPrice]
    $sortBy: String
    $sortDirection: SortDirection
    $pageNumber: Int
    $pageSize: Int
    $filter: Filter
    $search: String
  ) {
    accounts(
      sortBy: $sortBy
      sortDirection: $sortDirection
      pageNumber: $pageNumber
      pageSize: $pageSize
      simulatedTokenPrices: $simulatedTokenPrices
      filter: $filter
      search: $search
    ) {
      totalPages
      totalEntries
      accounts {
        id
        freeCollateralUsd
        accountValueUsd
        healthScore
        crossCurrencyRisk
        collateralRatio
        ltv
        maxLtv
        tag
      }
    }
  }
`;

export interface AccountQueryParams {
  id: string;
  simulatedTokenPrices?: Array<{ token: Token; priceUsd: UsdAmount }>;
}

export function createAccountQueryVariables(params: AccountQueryParams) {
    return {
      ...params,
      simulatedTokenPrices: params.simulatedTokenPrices?.map((s) => ({
        tokenId: s.token.id,
        priceUsd: s.priceUsd.n.toString(),
      })),
    };
};

export const ACCOUNT_QUERY = gql`
  query getAccount($id: ID!, $simulatedTokenPrices: [TokenPrice]) {
    account(id: $id, simulatedTokenPrices: $simulatedTokenPrices) {
      id
      freeCollateralUsd
      accountValueUsd
      healthScore
      ltv
      maxLtv
      crossCurrencyRisk
      collateralRatio
      positions {
        id
        aTokenBalance
        stableDebt
        variableDebt
        token {
          id
          symbol
          priceUsd
        }
      }
    }
  }
`;
