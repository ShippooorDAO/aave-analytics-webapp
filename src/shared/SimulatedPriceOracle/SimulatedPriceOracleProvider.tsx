import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { Token } from '../AaveAnalyticsApi/AaveAnalyticsApi.type';

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
    get deleteSimulatedPriceOracle(): never {
      throw new Error(missingProviderError);
    },
    get clearSimulatedPriceOracles(): never {
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
    Map<string, SimulatedPriceOracle>
  >(new Map<string, SimulatedPriceOracle>());

  const clearSimulatedPriceOracles = () => {
    setSimulatedPriceOracles(new Map<string, SimulatedPriceOracle>());
  };

  const deleteSimulatedPriceOracle = (token: Token) => {
    simulatedPriceOracles.delete(token.id);
    setSimulatedPriceOracles(new Map(simulatedPriceOracles));
  };

  return (
    <SimulatedPriceOracleContext.Provider
      value={{
        simulatedPriceOracles,
        deleteSimulatedPriceOracle,
        clearSimulatedPriceOracles,
        setSimulatedPriceOracles,
      }}
    >
      {children}
    </SimulatedPriceOracleContext.Provider>
  );
};
