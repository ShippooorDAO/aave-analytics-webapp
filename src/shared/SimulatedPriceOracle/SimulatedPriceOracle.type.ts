import { Token } from "../AaveAnalyticsApi/AaveAnalyticsApi.type";
import { UsdAmount } from "../UsdAmount";

export interface SimulatedPriceOracle {
  token: Token;
  priceUsd: UsdAmount;
}

export interface SimulatedPriceOracleProviderState {
  simulatedPriceOracles: Map<string, SimulatedPriceOracle>;
  setSimulatedPriceOracles: (simulatedPriceOracles: Map<string, SimulatedPriceOracle>) => void;
  deleteSimulatedPriceOracle: (token: Token) => void;
  clearSimulatedPriceOracles: () => void;
}
