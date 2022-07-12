import { TokenAmount } from "./TokenAmount";

export class STokenAmount extends TokenAmount {
  override get symbol() {
    return `s${this.token.symbol}`;
  }

  override get isDebt() {
    return true;
  }
}
