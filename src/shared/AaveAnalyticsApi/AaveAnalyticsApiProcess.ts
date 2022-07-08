import { EthAmount } from "../EthAmount";
import { TokenAmount } from "../TokenAmount";
import { UsdAmount } from "../UsdAmount";
import { Account, AccountBaseResponse, AccountQueryResponse, AccountsQueryResponse, Liquidation, LiquidationsQueryResponse, Token, TokenQueryResponse, Transaction, TransactionBaseResponse, TransactionsQueryResponse, TransactionType } from "./AaveAnalyticsApi.type"

export function parseTokenQueryResponse(response: TokenQueryResponse): Token[] {
  return response.tokens
      .filter((token) => !!token.symbol)
      .map((token) => ({
        ...token,
        priceUsd: new UsdAmount(token.priceUsd || "0")
      }));
}

export function parseAccountBaseResponse(account: AccountBaseResponse) {
    return {
      ...account,
      freeCollateralEth: parseEthAmount(account.freeCollateralEth),
      freeCollateralUsd: parseUsdAmount(account.freeCollateralUsd),
      accountValueUsd: parseUsdAmount(account.accountValueUsd),
      accountValueEth: parseEthAmount(account.accountValueEth),
    };
}

export function parseAccountQueryResponse(
  response: AccountQueryResponse, tokens: Token[]
): Account {
    const positions = response.account.positions?.map((position) =>
      parseTokenAmount(position.tokenId, position.balance, tokens)
    ).filter((v) => v !== null) as TokenAmount[];
  
    return {
        ...parseAccountBaseResponse(response.account),
        positions
    };
}

export function parseAccountsQueryResponse(response: AccountsQueryResponse): Account[] {
    return response.accounts.map((account) => ({
      ...parseAccountBaseResponse(account),
    }));
}

function parseTransactionType(txType: string): TransactionType {
  switch (txType) {
    case 'repay':
      return TransactionType.REPAY;
    case 'deposit':
      return TransactionType.DEPOSIT;
    case 'borrow':
      return TransactionType.BORROW;
    case 'liquidate':
      return TransactionType.LIQUIDATE;
    default:
      return TransactionType.UNKNOWN;
  }
}

function parseTokenAmount(tokenId: string, amount: string, tokens: Token[]): TokenAmount | null {
    const token = tokens.find(
      (token) => token.id.toLowerCase() === tokenId.toLowerCase()
    );
    if (!token) {
        return null;
    }
    return new TokenAmount(amount, token);
}

function parseEthAmount(amount: string): EthAmount {
  return new EthAmount(amount);
}

function parseUsdAmount(amount: string): UsdAmount {
  return new UsdAmount(amount);
}

export function parseTransactionBaseResponse(
  transaction: TransactionBaseResponse,
  tokens: Token[]
) {
  return {
    ...transaction,
    timestamp: new Date(transaction.timestamp * 1000),
    txType: parseTransactionType(transaction.txType),
    amount: parseTokenAmount(transaction.tokenId, transaction.amount, tokens),
    amountUsd: parseUsdAmount(transaction.amountUsd),
  };
}

export function parseTransactionsQueryResponse(response: TransactionsQueryResponse, tokens: Token[]): Transaction[] {
    return response.transactions.map((transaction) => ({
      ...parseTransactionBaseResponse(transaction, tokens)
    }));
}

export function parseLiquidationsQueryResponse(
  response: LiquidationsQueryResponse, tokens: Token[]
): Liquidation[] {
  return response.liquidations.map((liquidation) => ({
    ...liquidation,
    ...parseTransactionBaseResponse(liquidation, tokens),
    penaltyPaid: parseTokenAmount(liquidation.tokenId, liquidation.penaltyPaid, tokens),
    penaltyPaidUsd: parseUsdAmount(liquidation.penaltyPaidUsd),
  }));
}
