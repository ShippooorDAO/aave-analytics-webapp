import LiquidationsTable from '@/components/tables/Liquidations';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';

const LiquidationsIndex = () => {
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
        { title: 'Liquidations', uri: '/liquidations' },
      ]}
    >
      <section
        id="overview"
        className="relative rounded-xl overflow-auto p-8 w-full h-full"
      >
        <LiquidationsTable />
      </section>
    </Main>
  );
};

export default LiquidationsIndex;
