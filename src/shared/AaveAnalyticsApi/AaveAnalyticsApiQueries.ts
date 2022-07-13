import { gql } from "@apollo/client";
import { UsdAmount } from "../UsdAmount";
import { Token } from "./AaveAnalyticsApi.type";

export const TOKENS_QUERY = gql`
{
    tokens {
        id
        symbol
        priceUsd
    }
}
`;

export interface Filters {
  accountIdOrTagContains?: string;

  accountValueUsdGt?: UsdAmount;
  accountValueUsdGtEq?: UsdAmount;
  accountValueUsdSm?: UsdAmount;
  accountValueUsdSmEq?: UsdAmount;
  accountValueUsdEq?: UsdAmount;

  freeCollateralUsdGt?: UsdAmount;
  freeCollateralUsdGtEq?: UsdAmount;
  freeCollateralUsdSm?: UsdAmount;
  freeCollateralUsdSmEq?: UsdAmount;
  freeCollateralUsdEq?: UsdAmount;

  loanToValueGt?: number;
  loanToValueGtEq?: number;
  loanToValueSm?: number;
  loanToValueSmEq?: number;
  loanToValueEq?: number;

  collateralRatioGt?: number;
  collateralRatioGtEq?: number;
  collateralRatioSm?: number;
  collateralRatioSmEq?: number;
  collateralRatioEq?: number;

  healthScoreGt?: number;
  healthScoreGtEq?: number;
  healthScoreSm?: number;
  healthScoreSmEq?: number;
  healthScoreEq?: number;

  hasCrossCurrencyRisk?: boolean;
}

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
  filters?: Filters;
  simulatedTokenPrices?: Array<{ token: Token; priceUsd: UsdAmount }>;
}

export function createAccountsQueryVariables(params: AccountsQueryParams) {
    return {
      ...params,
      filters: {
        ...params.filters,
        accountValueUsdGt: params.filters?.accountValueUsdGt?.n.toString(),
        accountValueUsdGtEq: params.filters?.accountValueUsdGtEq?.n.toString(),
        accountValueUsdSm: params.filters?.accountValueUsdSm?.n.toString(),
        accountValueUsdSmEq: params.filters?.accountValueUsdSmEq?.n.toString(),
        accountValueUsdEq: params.filters?.accountValueUsdEq?.n.toString(),
        freeCollateralUsdGt: params.filters?.freeCollateralUsdGt?.n.toString(),
        freeCollateralUsdGtEq: params.filters?.freeCollateralUsdGtEq?.n.toString(),
        freeCollateralUsdSm: params.filters?.freeCollateralUsdSm?.n.toString(),
        freeCollateralUsdSmEq: params.filters?.freeCollateralUsdSmEq?.n.toString(),
        freeCollateralUsdEq: params.filters?.freeCollateralUsdEq?.n.toString(),
      },
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
  ) {
    accounts(
      sortBy: $sortBy
      sortDirection: $sortDirection
      pageNumber: $pageNumber
      pageSize: $pageSize
      simulatedTokenPrices: $simulatedTokenPrices
    ) {
      totalPages
      totalEntries
      accounts {
        id
        freeCollateralUsd
        accountValueUsd
        healthScore
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
  query getAccount($id: ID!, $simulatedTokenPrices: [TokenPrice]){
    account(id: $id, simulatedTokenPrices: $simulatedTokenPrices) {
      id
      freeCollateralUsd
      accountValueUsd
      healthScore
      ltv
      maxLtv
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
