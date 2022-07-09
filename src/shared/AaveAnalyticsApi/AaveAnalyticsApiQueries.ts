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

export interface AccountsQueryParams {
    sortBy?: 'accountValueUsd' | 'freeCollateralUsd' | 'loanToValue' | 'collateralRatio' | 'healthScore' | 'hasCrossCurrencyRisk';
    sortDirection?: 'DESC' | 'ASC';
    pageNumber?: number;
    pageSize?: number;
    filters?: Filters;
    simulatedTokenPrices?: Array<{token: Token, priceUsd: UsdAmount}>
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
        token: s.token.id,
        priceUsd: s.priceUsd.n.toString(),
      })),
    };
};

/**

enum SortDirection {
    ASC
    DESC
}
type TokenPrice {
    token: Token!
    priceUsd: String!
}
type Filters {
    accountIdOrTagContains: String

    accountValueUsdGt: String
    accountValueUsdGtEq: String
    accountValueUsdSm: String
    accountValueUsdSmEq: String
    accountValueUsdEq: String

    freeCollateralUsdGt: String
    freeCollateralUsdGtEq: String
    freeCollateralUsdSm: String
    freeCollateralUsdSmEq: String
    freeCollateralUsdEq: String

    loanToValueGt: Float
    loanToValueGtEq: Float
    loanToValueSm: Float
    loanToValueSmEq: Float
    loanToValueEq: Float

    collateralRatioGt: Float
    collateralRatioGtEq: Float
    collateralRatioSm: Float
    collateralRatioSmEq: Float
    collateralRatioEq: Float

    healthScoreGt: Float
    healthScoreGtEq: Float
    healthScoreSm: Float
    healthScoreoSmEq: Float
    healthScoreEq: Float

    hasCrossCurrencyRisk: Boolean
}
*/

export const ACCOUNTS_QUERY = gql`
  query getAccounts(
        $filters: Filters,
        $simulatedTokenPrices: [TokenPrice!],
        $sortBy: String,
        $sortDirection: SortDirection,
        $pageNumber: Int,
        $pageSize: Int) {
    accounts(
      filters: $filters
      sortBy: $sortBy
      sortDirection: $sortDirection
      pageNumber: $pageNumber
      pageSize: $pageSize
      simulatedTokenPrices: $simulatedTokenPrices
    ) {
      id
      freeCollateralUsd
      accountValueUSd
      healthScore
    }
  }
`;