import { TokenAmount } from './TokenAmount';

export class VTokenAmount extends TokenAmount {
  override get symbol() {
    return `v${this.token.symbol}`;
  }

  override get isDebt() {
    return true;
  }
}
