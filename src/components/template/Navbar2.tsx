import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';

const Navbar = ({ children }: { children: ReactNode }) => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <div>
              <img
                className="inline h-6 pr-3"
                src="/assets/images/aave-logo.svg"
                alt="aave logo"
              />
              <h1 className="inline">Analytics</h1>
            </div>
          </div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              <li>
                <a href="/accounts">Accounts</a>
              </li>
              <li>
                <a href="/liquidations">Liquidations</a>
              </li>
              <li>
                <a href="/token">AAVE Token</a>
              </li>
              <li>
                <a
                  onClick={() =>
                    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
                  }
                >
                  {resolvedTheme === 'light' ? <DarkMode /> : <LightMode />}
                </a>
              </li>
            </ul>
          </div>
        </div>
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100">
          <li>
            <a href="/accounts">Accounts</a>
          </li>
          <li>
            <a href="/liquidations">Liquidations</a>
          </li>
          <li>
            <a href="/token">AAVE Token</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
