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
      <section className="relative rounded-xl overflow-auto p-8 w-full h-full ">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg shadow-lg">
            <Blockies
              className="m-4 rounded-full inline"
              seed={address}
              size={10}
              scale={4}
            />
            <h3 className="inline">{address}</h3>
            <Link
              className="btn btn-circle btn-outline btn-sm inline"
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
            >
              <img
                className="h-6 m-0"
                src="/assets/images/etherscan.svg"
                alt=""
              />
            </Link>
            <Button className="btn-circle btn-outline btn-sm inline">
              <ContentCopy onClick={() => handleCopyButton()} />
            </Button>
            {account?.tag && <h3 className="inline">Tag: {account.tag}</h3>}
          </div>
          <div className="p-4 rounded-lg shadow-lg">
            <div>
              Account Value: {format(account?.accountValue, { symbol: 'USD' })}
            </div>
            <div>
              Free Collateral:{' '}
              {format(account?.freeCollateral, { symbol: 'USD' })}
            </div>
            <div>Collateral Ratio: {account?.collateralRatio}</div>
            <div>Loan to Value: {account?.ltv}</div>
          </div>
          <div className="p-4 rounded-lg shadow-lg col-span-2">
            <h4 className="inline mr-5">Portfolio</h4>
            {account?.crossCurrencyRisk && (
              <div className="badge badge-warning">Has Cross-Currency Risk</div>
            )}
            <div className="h-96 w-full">
              <PortfolioTable positions={account?.positions} />
            </div>
          </div>
          <div className="p-4 rounded-lg shadow-lg col-span-2">
            Transactions
            <div className="h-96 w-full">
              <TransactionsTable accountId={address} />
            </div>
          </div>
        </div>
      </section>
    </Main>
  );
};

export default AccountPage;
