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
import { Account } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { format, getAccountShorthand } from '@/utils/Format';
import Blockies from 'react-blockies';
import HealthFactorBadge from '@/components/HealthFactorBadge';
import { PriceOracleSimulatorPanel } from '@/components/PriceOracleSimulatorPanel';

const AccountPage = () => {
  const router = useRouter();
  const { address } = router.query;

  const [account, setAccount] = useState<Account | undefined>();
  const { tokens } = useAaveAnalyticsApiContext();
  const loading = !account;

  useEffect(() => {
    if (tokens.length > 0) {
      setAccount(parseAccountQueryResponse(MockAccountQueryResponse, tokens));
    }
  }, [tokens]);

  if (typeof address !== 'string' || address === '') {
    return <DefaultErrorPage statusCode={404} />;
  }

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
        <div className="flex gap-4 justify-between">
          <div></div>
          <PriceOracleSimulatorPanel />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4">
            <Blockies
              className="m-4 rounded-full inline"
              seed={address}
              size={16}
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
          <div className="p-4 rounded-lg shadow-lg">
            <div className=" ">
              Account Value: {account?.accountValueUsd.toDisplayString()}
            </div>
            <div>
              Free Collateral: {account?.freeCollateralUsd.toDisplayString()}
            </div>
            <div>Collateral Ratio: {account?.collateralRatio}</div>
            <div>Loan to Value: {account?.ltv}</div>
            <div>
              Health Factor:{' '}
              {account?.healthScore && (
                <HealthFactorBadge healthFactor={account.healthScore} />
              )}
            </div>
          </div>
          <div className="p-4 rounded-lg shadow-lg col-span-2">
            <span className="font-bold mr-5">Portfolio</span>
            {account?.crossCurrencyRisk && (
              <div className="badge badge-warning">Has Cross-Currency Risk</div>
            )}
            <div className="h-96 w-full mt-3">
              <PortfolioTable positions={account?.positions} />
            </div>
          </div>
          <div className="p-4 rounded-lg shadow-lg col-span-2">
            <span className="font-bold">Transactions</span>
            <div className="h-full w-full mt-3">
              <TransactionsTable accountId={address} />
            </div>
          </div>
        </div>
      </section>
    </Main>
  );
};

export default AccountPage;
