import { BigNumber, ethers } from 'ethers';
import { Token } from './AaveAnalyticsApi/AaveAnalyticsApi.type';
import { format } from '@/utils/Format';

export default class TokenAmount {
  constructor(readonly n: BigNumber, readonly token: Token) {}

  toExactString(): string {
    return ethers.utils.formatUnits(this.n, this.token.decimals);
  }

  toNumber(): number {
    return Number(this.toExactString());
  }

  toDisplayString({ abbreviate }: { abbreviate?: boolean } = {}): string {
    return format(this.toNumber(), { decimals: 2, abbreviate });
  }
}
