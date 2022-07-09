import { BigNumber, ethers } from 'ethers';
import { format } from '@/utils/Format';
import { CurrencyAmount } from './CurrencyAmount';

export class UsdAmount implements CurrencyAmount {
  readonly symbol = 'USD';
  readonly n: BigNumber;

  constructor(value: number | string) {
    if (typeof value === 'string') {
      this.n = BigNumber.from(value);
    } else {
      this.n = ethers.utils.parseUnits(value.toString());
    }
  }

  toExactString(): string {
    return ethers.utils.formatUnits(this.n, 18);
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
      symbol: 'USD',
      decimals,
      abbreviate,
    });
  }
}
