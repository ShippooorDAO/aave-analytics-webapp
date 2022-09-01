import { Card } from '@/components/cards/Card';
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
        { title: 'Accounts', uri: '/' },
        { title: 'Liquidations', uri: '/liquidations' },
      ]}
    >
      <Card>
        <LiquidationsTable />
      </Card>
    </Main>
  );
};

export default LiquidationsIndex;
