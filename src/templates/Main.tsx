import type { ReactNode } from 'react';

import Footer from '@/components/template/Footer';

import Navbar2 from '../components/template/Navbar2';

type IMainProps = {
  meta?: ReactNode;
  children: ReactNode;
};

export const Main = (props: IMainProps) => (
  <div className="w-full h-full antialiased">
    {props.meta}
    <Navbar2>
      <>
        <div className="relative overflow-hidden h-full">{props.children}</div>
        <Footer />
      </>
    </Navbar2>
  </div>
);

export default Main;
