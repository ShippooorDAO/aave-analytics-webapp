import { BigNumber } from "ethers";
import { ATokenAmount } from "../ATokenAmount";
import { EthAmount } from "../EthAmount";
import { STokenAmount } from "../STokenAmount";
import { TokenAmount } from "../TokenAmount";
import { UsdAmount } from "../UsdAmount";
import { VTokenAmount } from "../VTokenAmount";
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
      freeCollateralUsd: parseUsdAmount(account.freeCollateralUsd),
      accountValueUsd: parseUsdAmount(account.accountValueUsd),
      freeCollateralEth: account.freeCollateralEth
        ? parseEthAmount(account.freeCollateralEth)
        : undefined,
      accountValueEth: account.accountValueEth
        ? parseEthAmount(account.accountValueEth)
        : undefined,
    };
}

export function parseAccountQueryResponse(
  response: AccountQueryResponse, tokens: Token[]
): Account {
    const positions: TokenAmount[] = [];
    let crossCurrencyRisk = false;

    for (const position of response.account.positions) {
      const token = tokens.find((token) => token.id === position.token.id.toLowerCase());
      if (!token) {
        continue;
      }
      let aTokenAmount, sTokenAmount, vTokenAmount;
      if (position.aTokenBalance && position.aTokenBalance !== '0') {
        aTokenAmount = new ATokenAmount(position.aTokenBalance, token);
        positions.push(new ATokenAmount(position.aTokenBalance, token));
      }
      if (position.stableDebt && position.stableDebt !== '0') {
        sTokenAmount = new STokenAmount(position.stableDebt, token);
        positions.push(sTokenAmount);
      }
      if (position.variableDebt && position.variableDebt !== '0') {
        vTokenAmount = new VTokenAmount(position.variableDebt, token);
        positions.push(new VTokenAmount(position.variableDebt, token));
      }

      const totalCurrencyDebt = vTokenAmount?.n.add(sTokenAmount?.n || 0);
      const totalCurrencyCollateral = aTokenAmount?.n;
      if (
        !crossCurrencyRisk &&
        totalCurrencyDebt?.gt(totalCurrencyCollateral || 0)
      ) {
        crossCurrencyRisk = true;
      }
    }
  
    return {
      ...parseAccountBaseResponse(response.account),
      crossCurrencyRisk,
      positions,
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
