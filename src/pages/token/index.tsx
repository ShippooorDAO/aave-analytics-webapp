import AaveTokenPriceChart from '@/components/charts/AaveTokenPriceChart';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';

import CoinGecko from 'coingecko-api';
import { useEffect, useState } from 'react';
import CountCard from '@/components/CountCard';
import { format } from '@/utils/Format';

type AaveTokenParametersProps = {
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
    <>
      <AaveTokenPriceChart />
      <h2>AAVE</h2>
      <CountCard
        title="Market Capitalization"
        amount={format(marketCap, { symbol: 'USD' })}
      />
      <CountCard
        title="Fully Diluted Valuation"
        amount={format(fullyDilutedValuation, { symbol: 'USD' })}
      />
      <CountCard
        title="Total Value Locked (TVL)"
        amount={format(totalValueLocked, { symbol: 'USD' })}
      />
      <CountCard
        title="Fully Diluted Valuation / TVL Ratio"
        amount={format(fullyDilutedValueOnTVL, {})}
      />
      <CountCard
        title="Market Cap / TVL Ratio"
        amount={format(marketCapOnTVL, {})}
      />
      <CountCard
        title="Circulating Supply"
        amount={format(circulatingSupply, {})}
      />
      <CountCard title="Total Supply" amount={format(totalSupply, {})} />
      <CountCard title="Max Supply" amount={format(maxSupply, {})} />
    </>
  );
}

async function fetchAaveTokenParameters(client: CoinGecko) {
  const data = await client.coins.fetch('aave', {});
  const market = data.data.market_data;
  const marketCap = market.market_cap.usd;
  const totalValueLocked = market.total_value_locked['usd'];
  const fullyDilutedValuation = market.fully_diluted_valuation.usd;
  const fullyDilutedValueOnTVL = market.fdv_to_tvl_ratio;
  const marketCapOnTVL = market.mcap_to_tvl_ratio;
  const circulatingSupply = market.circulating_supply;
  const totalSupply = market.total_supply;
  const maxSupply = market.max_supply;

  return {
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
        { title: 'Overview', uri: '/' },
        { title: 'AAVE Token', uri: '/token' },
      ]}
    >
      <section
        id="overview"
        className="relative rounded-xl overflow-auto p-8 w-full h-full"
      >
        <div className="p-4 rounded-lg shadow-lg h-full">
          <AaveToken />
        </div>
      </section>
    </Main>
  );
};

export default TokenIndex;
