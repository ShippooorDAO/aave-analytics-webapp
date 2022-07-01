import '../styles/global.css';
import { ThemeProvider } from 'next-themes';

import { AppProps } from 'next/app';
import { combineProviders } from 'react-combine-providers';
import { AaveAnalyticsApiProvider } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';

const providers = combineProviders();
providers.push(ThemeProvider, { attribute: 'data-theme' });
providers.push(AaveAnalyticsApiProvider);

const MasterProvider = providers.master();

const MyApp = ({ Component, pageProps }: AppProps) => (
  <MasterProvider>
    <Component {...pageProps} />
  </MasterProvider>
);

export default MyApp;
