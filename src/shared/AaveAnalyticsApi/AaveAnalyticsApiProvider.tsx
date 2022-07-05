import { ApolloClient, InMemoryCache } from '@apollo/client';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Tokens from './Mocks/TokensQueryResponse.json';

import { AaveAnalyticsApiProviderState, Token } from './AaveAnalyticsApi.type';
import { parseTokenQueryResponse } from './AaveAnalyticsApiProcess';

const missingProviderError =
  'You forgot to wrap your code in a provider <EulerScanClientProvider>';

const AaveAnalyticsApiContext = createContext<AaveAnalyticsApiProviderState>({
  get tokens(): never {
    throw new Error(missingProviderError);
  },
});

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

  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    setTokens(parseTokenQueryResponse(Tokens));
  }, []);

  return (
    <AaveAnalyticsApiContext.Provider
      value={{
        tokens,
      }}
    >
      {children}
    </AaveAnalyticsApiContext.Provider>
  );
};
