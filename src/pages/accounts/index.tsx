import Accounts from '@/components/tables/Accounts';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';

const AccountsIndex = () => {
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
      ]}
    >
      <Accounts />
    </Main>
  );
};

export default AccountsIndex;
