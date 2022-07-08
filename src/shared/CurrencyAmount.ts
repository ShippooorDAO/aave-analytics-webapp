import { BigNumber } from 'ethers';

export interface CurrencyAmount {
  readonly symbol: string;
  readonly n: BigNumber;

  toExactString(): string;
  toNumber(): number;
  toDisplayString(params?: { abbreviate?: boolean; decimals?: number }): string;
}
