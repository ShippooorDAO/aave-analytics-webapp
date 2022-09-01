import AaveTokenPriceChart from '@/components/charts/AaveTokenPriceChart';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';

import CoinGecko from 'coingecko-api';
import { useEffect, useState } from 'react';
import { format } from '@/utils/Format';
import { ValueCard } from '@/components/cards/ValueCard';
import { Card } from '@/components/cards/Card';

type AaveTokenParametersProps = {
  price: number;
  marketCap: number;
  totalValueLocked: number;
  fullyDilutedValuation: number;
  fullyDilutedValueOnTVL: number;
  marketCapOnTVL: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
};

type AaveTokenTemplateProps = {
  price: number;
  marketCap: number;
  fullyDilutedValuation: number;
  totalValueLocked: number;
  fullyDilutedValueOnTVL: number;
  marketCapOnTVL: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
};

function AaveTokenTemplate({
  price,
  marketCap,
  fullyDilutedValuation,
  totalValueLocked,
  fullyDilutedValueOnTVL,
  marketCapOnTVL,
  circulatingSupply,
  totalSupply,
  maxSupply,
}: AaveTokenTemplateProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-2 text-5xl font-bold">
        <img
          className="rounded-full h-24 w-24 inline mr-5 shadow-xl"
          src="/assets/images/tokens/aave.svg"
        />
        <p className="drop-shadow-xl inline">AAVE</p>
      </div>
      <ValueCard title="Current Token Price">
        {format(price, { symbol: 'USD' })}
      </ValueCard>
      <ValueCard title="Total Value Locked (TVL)">
        {format(totalValueLocked, { symbol: 'USD', abbreviate: true })}
      </ValueCard>
      <Card className="col-span-2">
        <AaveTokenPriceChart />
      </Card>
      <ValueCard title="Market Capitalization" variant="secondary">
        {format(marketCap, { symbol: 'USD', abbreviate: true })}
      </ValueCard>
      <ValueCard title="Fully Diluted Valuation" variant="secondary">
        {format(fullyDilutedValuation, { symbol: 'USD', abbreviate: true })}
      </ValueCard>
      <ValueCard
        title="Fully Diluted Valuation / TVL Ratio"
        variant="secondary"
      >
        {format(fullyDilutedValueOnTVL, {})}
      </ValueCard>
      <ValueCard title="Market Cap / TVL Ratio" variant="secondary">
        {format(marketCapOnTVL, {})}
      </ValueCard>
      <ValueCard title="Circulating Supply" variant="secondary">
        {format(circulatingSupply, { abbreviate: true })}
      </ValueCard>
      <ValueCard title="Total Supply" variant="secondary">
        {format(totalSupply, { abbreviate: true })}
      </ValueCard>
      <ValueCard title="Max Supply" variant="secondary">
        {format(maxSupply, { abbreviate: true })}
      </ValueCard>
    </div>
  );
}

async function fetchAaveTokenParameters(client: CoinGecko) {
  const data = await client.coins.fetch('aave', {});
  const market = data.data.market_data;
  const price = market.current_price.usd;
  const marketCap = market.market_cap.usd;
  const totalValueLocked = market.total_value_locked['usd'];
  const fullyDilutedValuation = market.fully_diluted_valuation.usd;
  const fullyDilutedValueOnTVL = market.fdv_to_tvl_ratio;
  const marketCapOnTVL = market.mcap_to_tvl_ratio;
  const circulatingSupply = market.circulating_supply;
  const totalSupply = market.total_supply;
  const maxSupply = market.max_supply;

  return {
    price,
    marketCap,
    totalValueLocked,
    fullyDilutedValuation,
    fullyDilutedValueOnTVL,
    marketCapOnTVL,
    circulatingSupply,
    totalSupply,
    maxSupply,
  };
}

function AaveToken() {
  const [AaveTokenParameters, setAaveTokenParameters] = useState<
    AaveTokenParametersProps | undefined
  >(undefined);

  useEffect(() => {
    const CoinGeckoClient = new CoinGecko();
    fetchAaveTokenParameters(CoinGeckoClient).then(setAaveTokenParameters);
  }, []);

  if (!AaveTokenParameters) {
    return <div />;
  }

  const AaveTokenData = {
    ...AaveTokenParameters,
  };

  return <AaveTokenTemplate {...AaveTokenData} />;
}

const TokenIndex = () => {
  return (
    <Main
      meta={
        <Meta
          title="AAVE Analytics Dashboard"
          description="Deep dive analytics dashboard for AAVE"
        />
      }
      breadcrumbs={[
        { title: 'Accounts', uri: '/' },
        { title: 'AAVE Token', uri: '/token' },
      ]}
    >
      <div className="p-4">
        <AaveToken />
      </div>
    </Main>
  );
};

export default TokenIndex;
