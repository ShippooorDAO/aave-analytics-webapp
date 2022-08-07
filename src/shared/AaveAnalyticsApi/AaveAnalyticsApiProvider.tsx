import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  AaveAnalyticsApiProviderState,
  Token,
  TokenQueryResponse,
} from './AaveAnalyticsApi.type';
import { parseTokenQueryResponse } from './AaveAnalyticsApiProcess';
import { TOKENS_QUERY } from './AaveAnalyticsApiQueries';

const missingProviderError =
  'You forgot to wrap your code in a provider <AaveAnalyticsApiProvider>';

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
  const link = createHttpLink({
    uri: process.env.NEXT_PUBLIC_AAVE_ANALYTICS_API_URL,
    credentials: 'same-origin'
  });

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link
  });

  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    apolloClient
      .query<TokenQueryResponse>({ query: TOKENS_QUERY })
      .then((response) => {
        setTokens(parseTokenQueryResponse(response.data));
      });
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
