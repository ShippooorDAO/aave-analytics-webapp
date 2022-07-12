import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { useRouter } from 'next/router';
import ContentCopy from '@mui/icons-material/ContentCopy';
import DefaultErrorPage from 'next/error';
import { Badge, Button, Link } from 'react-daisyui';
import TransactionsTable from '@/components/tables/Transactions';
import PortfolioTable from '@/components/tables/Portfolio';
import { useAaveAnalyticsApiContext } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import { useEffect, useState } from 'react';
import { parseAccountQueryResponse } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProcess';
import MockAccountQueryResponse from '@/shared/AaveAnalyticsApi/mocks/AccountQueryResponse.json';
import {
  Account,
  AccountQueryResponse,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { format, getAccountShorthand } from '@/utils/Format';
import Blockies from 'react-blockies';
import HealthFactorBadge from '@/components/HealthFactorBadge';
import { PriceOracleSimulatorPanel } from '@/components/PriceOracleSimulatorPanel';
import { QuickSimulationFilters } from '@/components/QuickSimulationFilters';
import { useQuery } from '@apollo/client';
import {
  ACCOUNT_QUERY,
  createAccountQueryVariables,
  AccountQueryParams,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiQueries';
import { useSimulatedPriceOracleContext } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracleProvider';

const AccountPage = () => {
  const router = useRouter();
  const { address } = router.query;

  const { simulatedPriceOracles } = useSimulatedPriceOracleContext();
  const { tokens } = useAaveAnalyticsApiContext();

  const [accountQueryParams, setAccountQueryParams] = useState<
    AccountQueryParams | undefined
  >();

  useEffect(() => {
    if (address && typeof address === 'string') {
      setAccountQueryParams({ id: address.toLowerCase() });
    }
  }, [address]);

  useEffect(() => {
    if (accountQueryParams) {
      setAccountQueryParams({
        ...accountQueryParams,
        simulatedTokenPrices: Array.from(simulatedPriceOracles.values()),
      });
    }
  }, [simulatedPriceOracles]);

  const { data } = useQuery<AccountQueryResponse>(ACCOUNT_QUERY, {
    variables: createAccountQueryVariables(
      accountQueryParams || { id: '0x0003fca368838e813fb6d80e6ade47104980158a' }
    ),
    skip: !accountQueryParams,
  });

  if (!data || !address || typeof address !== 'string') {
    return null;
  }

  const account = parseAccountQueryResponse(data, tokens);

  const handleCopyButton = () => {
    navigator.clipboard.writeText(address as string);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-stretch justify-between">
          <div className="p-4">
            <Blockies
              className="m-4 rounded-full inline shadow-lg"
              seed={address}
              size={14}
              scale={8}
            />
            <div className="inline-block">
              {account?.tag && (
                <Badge className="badge-accent badge-lg font-bold text-lg">
                  {account.tag}
                </Badge>
              )}
              <br />
              <span className="font-bold text-lg mr-2">
                {getAccountShorthand(address)}
              </span>
              <Button className="btn-circle btn-ghost btn-sm inline mr-2">
                <ContentCopy onClick={() => handleCopyButton()} />
              </Button>
              <img
                onClick={() =>
                  window.open(`https://etherscan.io/address/${address}`)
                }
                className="btn btn-circle btn-ghost btn-sm inline h-6 bg-white m-0 cursor-pointer"
                src="/assets/images/etherscan.svg"
                alt=""
              />
            </div>
          </div>
          <div className="p-4 rounded-lg shadow-lg grid grid-cols-2 gap-4">
            <div>
              <div>Account Value</div>
              <div className="font-bold">
                {account?.accountValueUsd.toDisplayString()}
              </div>
            </div>
            <div>
              <div>Free Collateral</div>
              <div className="font-bold">
                {account?.freeCollateralUsd.toDisplayString()}
              </div>
            </div>
            <div>
              <div>Loan to Value</div>
              <div className="font-bold">{account?.ltv.toFixed(3)}</div>
            </div>
            <div>
              <div>Max Loan to Value</div>
              <div className="font-bold">{account?.maxLtv.toFixed(3)}</div>
            </div>
            <div>
              <div>Collateral Ratio</div>
              <div className="font-bold">{account?.collateralRatio}</div>
            </div>
            <div>
              <div>Health Factor</div>
              <div className="font-bold">
                {account?.healthScore && (
                  <HealthFactorBadge healthFactor={account.healthScore} />
                )}
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg shadow-lg">
            <span className="font-bold mr-5">Collateral</span>
            <div className="h-96 w-full mt-3">
              <PortfolioTable
                positions={account?.positions?.filter(
                  (position) => !position.isDebt
                )}
              />
            </div>
          </div>
          <div className="p-4 rounded-lg shadow-lg">
            <span className="font-bold mr-5">Debt positions</span>
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
          </div>
          <div className="p-4 rounded-lg shadow-lg md:col-span-2">
            <span className="font-bold">Transactions</span>
            <div className="h-96 w-full mt-3">
              <TransactionsTable accountId={address} />
            </div>
          </div>
        </div>
      </section>
    </Main>
  );
};

export default AccountPage;
