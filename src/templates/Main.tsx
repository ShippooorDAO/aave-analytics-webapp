import type { ReactNode } from 'react';

import Footer from '@/components/template/Footer';

import Navbar from '../components/template/Navbar';
import Breadcrumbs, { BreadcrumbLink } from '@/components/Breadcrumbs';

type IMainProps = {
  meta?: ReactNode;
  children: ReactNode;
  breadcrumbs?: BreadcrumbLink[];
};

export const Main = (props: IMainProps) => (
  <div className="antialiased">
    {props.meta}
    <Navbar>
      <>
        <div className="relative bg-[url('/assets/images/background-50.png')] bg-opacity-50 bg-no-repeat bg-fixed">
          <div className="py-4 px-8">
            {props.breadcrumbs && <Breadcrumbs links={props.breadcrumbs} />}
          </div>
          <div className="max-w-7xl mx-auto">{props.children}</div>
        </div>
      </>
      <Footer />
    </Navbar>
  </div>
);

export default Main;
