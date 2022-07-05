import { BigNumber } from "ethers"
import TokenAmount from "../TokenAmount";
import { Account, AccountBaseResponse, AccountQueryResponse, AccountsQueryResponse, Token, TokenQueryResponse, Transaction, TransactionsQueryResponse, TransactionType } from "./AaveAnalyticsApi.type"

export function parseTokenQueryResponse(response: TokenQueryResponse): Token[] {
    return response.tokens.map((token) => ({
        ...token,
        priceUsd: BigNumber.from(token.price_usd)
    }))
}

export function parseAccountBaseResponse(account: AccountBaseResponse, tokens: Token[]) {
    return {
      ...account,
      freeCollateral: BigNumber.from(account.freeCollateral),
      accountValue: BigNumber.from(account.accountValue),
    };
}

export function parseAccountQueryResponse(
  response: AccountQueryResponse, tokens: Token[]
): Account {
    const positions = response.account.positions?.map((position) =>
      parseTokenAmount({ ...position, amount: position.balance }, tokens)
    ).filter((v) => v !== null) as TokenAmount[];
    return {
        ...parseAccountBaseResponse(response.account, tokens),
        positions
    };
}

export function parseAccountsQueryResponse(response: AccountsQueryResponse): Account[] {
    return response.accounts.map((account) => ({
        ...account,
        freeCollateral: BigNumber.from(account.freeCollateral),
        accountValue: BigNumber.from(account.accountValue)
    }));
}

export function parseLiquidationsQueryResponse(
  response: AccountsQueryResponse
): Account[] {
  return response.accounts.map((account) => ({
    ...account,
    freeCollateral: BigNumber.from(account.freeCollateral),
    accountValue: BigNumber.from(account.accountValue),
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
    default:
      return TransactionType.UNKNOWN;
  }
}

function parseTokenAmount({tokenId, amount}: {tokenId: string, amount: string}, tokens: Token[]): TokenAmount | null {
    const token = tokens.find(
      (token) => token.id.toLowerCase() === tokenId.toLowerCase()
    );
    if (!token) {
        return null;
    }
    return new TokenAmount(BigNumber.from(amount), token);
}

export function parseTransactionsQueryResponse(response: TransactionsQueryResponse, tokens: Token[]): Transaction[] {
    return response.transactions.map((transaction) => ({
      ...transaction,
      tokenAmount: parseTokenAmount(transaction, tokens),
      txType: parseTransactionType(transaction.txType),
      amount: BigNumber.from(transaction.amount),
      timestamp: new Date(transaction.timestamp * 1000),
    }));
}