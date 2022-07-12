import { BigNumber, ethers } from 'ethers';
import { Token } from './AaveAnalyticsApi/AaveAnalyticsApi.type';
import { format } from '@/utils/Format';
import { CurrencyAmount } from './CurrencyAmount';
import { UsdAmount } from './UsdAmount';

export class TokenAmount implements CurrencyAmount {
  readonly n: BigNumber;

  constructor(value: number | string, readonly token: Token) {
    if (typeof value === 'string') {
      this.n = BigNumber.from(value);
    } else {
      this.n = ethers.utils.parseUnits(value.toString(), token.decimals);
    }
  }

  toExactString(): string {
    return ethers.utils.formatUnits(this.n, this.token.decimals);
  }

  toNumber(): number {
    return Number(this.toExactString());
  }

  get symbol() {
    return this.token.symbol;
  }

  toDisplayString(
    { abbreviate, decimals }: { abbreviate?: boolean; decimals?: number } = {
      decimals: 2,
      abbreviate: false,
    }
  ): string {
    decimals = decimals || 2;
    const num = this.toNumber();
    if (num < 1/(10**decimals)) {
      decimals = decimals * 2;
    }
    return format(num, {
      symbol: this.symbol,
      decimals,
      abbreviate,
    });
  }

  get isDebt() {
    return false;
  }

  toUsd() {
    const precision = BigNumber.from(10).pow(18);
    return new UsdAmount(this.n.mul(this.token.priceUsd.n).div(precision));
  }
}
