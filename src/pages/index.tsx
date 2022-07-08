import Accounts from '@/components/tables/Accounts';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  return (
    <Main
      meta={
        <Meta
          title="AAVE Analytics Dashboard"
          description="Deep dive analytics dashboard for AAVE"
        />
      }
    >
      <section className="w-full h-full p-4">
        <Accounts />
      </section>
    </Main>
  );
};

export default Index;
