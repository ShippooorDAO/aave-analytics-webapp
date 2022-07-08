import { BigNumber, ethers } from 'ethers';
import { format } from '@/utils/Format';
import { CurrencyAmount } from './CurrencyAmount';

export class EthAmount implements CurrencyAmount {
  readonly symbol = 'ETH';
  readonly n: BigNumber;

  constructor(textValue: string) {
    this.n = BigNumber.from(textValue);
  }

  toExactString(): string {
    return ethers.utils.formatUnits(this.n, 1e18);
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
      symbol: 'ETH',
      decimals,
      abbreviate,
    });
  }
}
