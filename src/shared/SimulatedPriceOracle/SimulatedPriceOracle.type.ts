import { Token } from "../AaveAnalyticsApi/AaveAnalyticsApi.type";

export interface SimulatedPriceOracle {
    token: Token;
    price: number;
}

export interface SimulatedPriceOracleProviderState {
  simulatedPriceOracles: Map<string, SimulatedPriceOracle>;
  setSimulatedPriceOracles: (priceOracles: Map<string, SimulatedPriceOracle>) => void;
  clearSimulatedPriceOracles: () => void;
}
