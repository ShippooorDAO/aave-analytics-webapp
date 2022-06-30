import Accounts from '../tables/Accounts';

const Overview = () => {
  return (
    <section
      id="overview"
      className="relative rounded-xl overflow-auto p-8 w-full h-full"
    >
      <div className="grid lg:grid-cols-2 gap-4 font-mono text-sm text-center font-bold leading-6 bg-stripes-fuchsia rounded-lg">
        <div className="p-4 rounded-lg shadow-lg h-96">
          <Accounts />
        </div>
      </div>
    </section>
  );
};

export default Overview;
