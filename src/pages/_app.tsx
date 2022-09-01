import '../styles/global.css';
import { ThemeProvider } from 'next-themes';

import { AppProps } from 'next/app';
import { combineProviders } from 'react-combine-providers';
import { AaveAnalyticsApiProvider } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import { SimulatedPriceOracleProvider } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracleProvider';
import { ApolloProviderProps } from '@apollo/client/react/context';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { cacheConfig } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiCacheConfig';

const cache = new InMemoryCache(cacheConfig);

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_AAVE_ANALYTICS_API_URL,
  cache,
});
const providers = combineProviders();
providers.push(ThemeProvider, {
  attribute: 'data-theme',
  defaultTheme: 'dark',
});
providers.push(ApolloProvider, { client } as ApolloProviderProps<any>);
providers.push(AaveAnalyticsApiProvider);
providers.push(SimulatedPriceOracleProvider);

const MasterProvider = providers.master();

const MyApp = ({ Component, pageProps }: AppProps) => (
  <MasterProvider>
    <Component {...pageProps} />
  </MasterProvider>
);

export default MyApp;
