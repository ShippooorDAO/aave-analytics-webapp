import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import * as featureFlags from '@/shared/FeatureFlags';
import Link from 'next/link';

const Navbar = ({ children }: { children: ReactNode }) => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <MenuIcon />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <Link href="/">
              <div className="cursor-pointer">
                <img
                  className="inline h-6 pr-3"
                  src="/assets/images/aave-logo.svg"
                  alt="aave logo"
                />
                <h1 className="inline">Analytics</h1>
              </div>
            </Link>
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

              {featureFlags.darkModeSupportEnabled && (
                <li>
                  <a
                    onClick={() =>
                      setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
                    }
                  >
                    {resolvedTheme === 'light' ? (
                      <DarkModeIcon />
                    ) : (
                      <LightModeIcon />
                    )}
                  </a>
                </li>
              )}
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
