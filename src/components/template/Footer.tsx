const Footer = () => {
  return (
    <footer className="drop-shadow-md">
      <div className="container">
        <div className="grid grid-cols-1 justify-items-center gap-6 text-center lg:grid-cols-12 lg:gap-0">
          <div className="flex flex-row justify-between lg:col-span-3 lg:justify-self-start m-5 bg-gray-400 rounded p-2">
            <img
              className="h-6"
              src="/assets/images/aave-logo.svg"
              alt="aave logo"
            />
            <div className="ml-2 flex items-center justify-between">
              <svg
                className="cursor-pointer fill-current text-white hover:text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="18"
              >
                <title>Twitter</title>
                <path d="M20.667 2.797a8.192 8.192 0 01-2.357.646 4.11 4.11 0 001.804-2.27 8.22 8.22 0 01-2.606.996A4.096 4.096 0 0014.513.873c-2.649 0-4.595 2.472-3.997 5.038a11.648 11.648 0 01-8.457-4.287 4.109 4.109 0 001.27 5.478A4.086 4.086 0 011.47 6.59c-.045 1.901 1.317 3.68 3.29 4.075a4.113 4.113 0 01-1.853.07 4.106 4.106 0 003.834 2.85 8.25 8.25 0 01-6.075 1.7 11.616 11.616 0 006.29 1.843c7.618 0 11.922-6.434 11.662-12.205a8.354 8.354 0 002.048-2.124z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center lg:col-span-9 lg:justify-self-end">
            <a className="text-sm" href="http://shippooor.xyz">
              Made by &#128674; Shippoooor
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
