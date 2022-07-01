import { createContext, FC, ReactNode, useContext, useState } from 'react';

import {
  SimulatedPriceOracle,
  SimulatedPriceOracleProviderState,
} from './SimulatedPriceOracle.type';

const missingProviderError =
  'You forgot to wrap your code in a provider <SimulatedPriceOracleProvider>';

const SimulatedPriceOracleContext =
  createContext<SimulatedPriceOracleProviderState>({
    get simulatedPriceOracles(): never {
      throw new Error(missingProviderError);
    },
    get setSimulatedPriceOracles(): never {
      throw new Error(missingProviderError);
    },
    get resetSimulatedPriceOracles(): never {
      throw new Error(missingProviderError);
    },
  });

interface SimulatedPriceOracleProviderProps {
  children: ReactNode;
}

export const useSimulatedPriceOracleContext = () =>
  useContext<SimulatedPriceOracleProviderState>(SimulatedPriceOracleContext);

export const SimulatedPriceOracleProvider: FC<
  SimulatedPriceOracleProviderProps
> = ({ children }: SimulatedPriceOracleProviderProps) => {
  const [simulatedPriceOracles, setSimulatedPriceOracles] = useState<
    SimulatedPriceOracle[]
  >([]);

  const resetSimulatedPriceOracles = () => {
    setSimulatedPriceOracles([]);
  };

  return (
    <SimulatedPriceOracleContext.Provider
      value={{
        resetSimulatedPriceOracles,
        setSimulatedPriceOracles,
        simulatedPriceOracles,
      }}
    >
      {children}
    </SimulatedPriceOracleContext.Provider>
  );
};
