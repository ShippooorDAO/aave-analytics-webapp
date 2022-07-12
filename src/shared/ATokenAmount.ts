import { TokenAmount } from './TokenAmount';

export class ATokenAmount extends TokenAmount {
  override get symbol() {
    return `a${this.token.symbol}`;
  }
}
