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
    >
      <section
        id="overview"
        className="relative rounded-xl overflow-auto p-8 w-full h-full"
      >
        <div className="p-4 rounded-lg shadow-lg h-full">
          <Accounts />
        </div>
      </section>
    </Main>
  );
};

export default AccountsIndex;
