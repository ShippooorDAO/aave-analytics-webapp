import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { useRouter } from 'next/router';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { Badge, Button } from 'react-daisyui';
import TransactionsTable from '@/components/tables/Transactions';
import PortfolioTable from '@/components/tables/Portfolio';
import { useAaveAnalyticsApiContext } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import { useEffect } from 'react';
import { parseAccountQueryResponse } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProcess';
import { AccountQueryResponse } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { getAccountShorthand } from '@/utils/Format';
import Blockies from 'react-blockies';
import HealthFactorBadge from '@/components/HealthFactorBadge';
import { PriceOracleSimulatorPanel } from '@/components/PriceOracleSimulatorPanel';
import { QuickSimulationFilters } from '@/components/QuickSimulationFilters';
import { useQuery } from '@apollo/client';
import {
  ACCOUNT_QUERY,
  createAccountQueryVariables,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiQueries';
import { useSimulatedPriceOracleContext } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracleProvider';
import { accountTransactionsEnabled } from '@/shared/FeatureFlags';
import { Card } from '@/components/cards/Card';
import { ValueCard } from '@/components/cards/ValueCard';

const AccountPage = () => {
  const router = useRouter();
  const { address } = router.query;

  if (!address || typeof address !== 'string') {
    return null;
  }

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
        { title: 'Accounts', uri: '/accounts' },
        {
          title: getAccountShorthand(address),
          uri: `/accounts/details?accountId=${address}`,
        },
      ]}
    >
      <AccountDetail id={address.toLowerCase()} />{' '}
    </Main>
  );
};

const AccountDetail = ({ id }: { id: string }) => {
  const { simulatedPriceOracles } = useSimulatedPriceOracleContext();
  const { tokens } = useAaveAnalyticsApiContext();

  const { data, refetch } = useQuery<AccountQueryResponse>(ACCOUNT_QUERY, {
    variables: createAccountQueryVariables({ id }),
  });

  useEffect(() => {
    const simulatedPriceOraclesArr = Array.from(simulatedPriceOracles.values());
    if (simulatedPriceOraclesArr.length > 0) {
      refetch(
        createAccountQueryVariables({
          id,
          simulatedTokenPrices: simulatedPriceOraclesArr,
        })
      );
    } else {
      refetch(createAccountQueryVariables({ id }));
    }
  }, [simulatedPriceOracles]);

  if (!data) {
    return null;
  }

  const account = parseAccountQueryResponse(data, tokens);
  const collateralRatio =
    account.ltv && account.ltv > 0 ? 1 / account.ltv : undefined;

  const handleCopyButton = () => {
    navigator.clipboard.writeText(id);
  };

  return (
    <section className="relative rounded-xl">
      <div className="grid grid-cols-3 mb-5">
        <span></span>
        <span className="justify-self-center">
          <QuickSimulationFilters />
        </span>
        <span className="justify-self-end">
          <PriceOracleSimulatorPanel />
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 justify-items-stretch justify-between">
        <Card className="md:col-span-2 p-4 flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex flex-col items-start gap-1">
              <div>
                {account?.tag && (
                  <Badge className="badge-accent badge-lg font-bold text-lg">
                    {account.tag}
                  </Badge>
                )}
              </div>
              <div className="font-bold text-3xl mr-2">
                {getAccountShorthand(id)}
              </div>
            </div>
            <div>
              <Button className="btn-circle btn-ghost btn-sm inline mr-2">
                <ContentCopy onClick={() => handleCopyButton()} />
              </Button>
              <img
                onClick={() =>
                  window.open(`https://etherscan.io/address/${account.id}`)
                }
                className="btn btn-circle btn-ghost btn-sm inline h-6 bg-white m-0 cursor-pointer"
                src="/assets/images/etherscan.svg"
                alt=""
              />
            </div>
          </div>
          <Blockies
            className="rounded-full inline shadow-lg"
            seed={id}
            size={14}
            scale={12}
          />
        </Card>
        <div className="md:col-span-4 grid grid-cols-4 gap-4">
          <ValueCard className="col-span-2" title="Account Value">
            {account?.accountValueUsd.toDisplayString()}
          </ValueCard>
          <ValueCard className="col-span-2" title="Free Collateral">
            {account?.freeCollateralUsd.toDisplayString()}
          </ValueCard>
          <ValueCard title="Loan to Value" variant="secondary">
            {account?.ltv?.toFixed(3)}
          </ValueCard>
          <ValueCard title="Max Loan to Value" variant="secondary">
            {account?.maxLtv?.toFixed(3)}
          </ValueCard>
          <ValueCard title="Collateral Ratio" variant="secondary">
            {collateralRatio?.toFixed(3) ?? 'N/A'}
          </ValueCard>
          <ValueCard title="Health Factor" variant="secondary">
            {account?.healthScore ? (
              <HealthFactorBadge healthFactor={account.healthScore} />
            ) : (
              'N/A'
            )}
          </ValueCard>
        </div>
        <Card className="md:col-span-3" title="Collateral">
          <div className="h-96 w-full mt-3">
            <PortfolioTable
              positions={account?.positions?.filter(
                (position) => !position.isDebt
              )}
            />
          </div>
        </Card>
        <Card className="md:col-span-3" title="Debt positions">
          {account?.crossCurrencyRisk && (
            <div className="badge badge-warning">Has Cross-Currency Risk</div>
          )}
          <div className="h-96 w-full mt-3">
            <PortfolioTable
              positions={account?.positions?.filter(
                (position) => position.isDebt
              )}
            />
          </div>
        </Card>
        {accountTransactionsEnabled && (
          <Card title="Transactions">
            <div className="h-96 w-full mt-3">
              <TransactionsTable />
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};

export default AccountPage;
