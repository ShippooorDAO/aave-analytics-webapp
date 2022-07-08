import type { ReactNode } from 'react';

import Footer from '@/components/template/Footer';

import Navbar2 from '../components/template/Navbar2';
import Breadcrumbs, { BreadcrumbLink } from '@/components/Breadcrumbs';

type IMainProps = {
  meta?: ReactNode;
  children: ReactNode;
  breadcrumbs?: BreadcrumbLink[];
};

export const Main = (props: IMainProps) => (
  <div className="antialiased">
    {props.meta}
    <Navbar2>
      <>
        <div className="relative overflow-hidden h-full">
          <div className="pt-4 pl-8">
            {props.breadcrumbs && <Breadcrumbs links={props.breadcrumbs} />}
          </div>
          {props.children}
        </div>
      </>
    </Navbar2>
    <Footer />
  </div>
);

export default Main;
