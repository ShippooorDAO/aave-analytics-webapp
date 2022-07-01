import {BigNumber} from 'ethers';

export interface SimulatedPriceOracle {
    fromAsset: string;
    toAsset: string;
    rate: BigNumber;
}

export interface SimulatedPriceOracleProviderState {
  simulatedPriceOracles: SimulatedPriceOracle[];
  setSimulatedPriceOracles: (priceOracles: SimulatedPriceOracle[]) => void;
  resetSimulatedPriceOracles: () => void;
}
