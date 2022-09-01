import { Card } from '@/components/cards/Card';
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
      breadcrumbs={[{ title: 'Accounts', uri: '/' }]}
    >
      <Card>
        <Accounts />
      </Card>
    </Main>
  );
};

export default Index;
