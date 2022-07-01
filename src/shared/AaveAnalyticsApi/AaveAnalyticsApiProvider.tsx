import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createContext, FC, ReactNode, useContext } from 'react';

import { AaveAnalyticsApiProviderState } from './AaveAnalyticsApi.type';
const AaveAnalyticsApiContext = createContext<AaveAnalyticsApiProviderState>(
  {}
);

interface AaveAnalyticsApiProviderProps {
  children: ReactNode;
}

export const useAaveAnalyticsApiContext = () =>
  useContext<AaveAnalyticsApiProviderState>(AaveAnalyticsApiContext);

export const AaveAnalyticsApiProvider: FC<AaveAnalyticsApiProviderProps> = ({
  children,
}: AaveAnalyticsApiProviderProps) => {
  const apolloClient = new ApolloClient({
    uri: 'todo',
    cache: new InMemoryCache(),
  });

  return (
    <AaveAnalyticsApiContext.Provider value={{}}>
      {children}
    </AaveAnalyticsApiContext.Provider>
  );
};
