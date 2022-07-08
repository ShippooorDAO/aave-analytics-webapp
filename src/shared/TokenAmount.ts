import { BigNumber, ethers } from 'ethers';
import { Token } from './AaveAnalyticsApi/AaveAnalyticsApi.type';
import { format } from '@/utils/Format';
import { CurrencyAmount } from './CurrencyAmount';

export class TokenAmount implements CurrencyAmount {
  readonly symbol: string;
  readonly n: BigNumber;

  constructor(textValue: string, readonly token: Token) {
    this.n = BigNumber.from(textValue);
    this.symbol = token.symbol;
  }

  toExactString(): string {
    return ethers.utils.formatUnits(this.n, this.token.decimals);
  }

  toNumber(): number {
    return Number(this.toExactString());
  }

  toDisplayString(
    { abbreviate, decimals }: { abbreviate?: boolean; decimals?: number } = {
      decimals: 2,
      abbreviate: false,
    }
  ): string {
    return format(this.toNumber(), {
      symbol: this.token.symbol,
      decimals,
      abbreviate,
    });
  }
}