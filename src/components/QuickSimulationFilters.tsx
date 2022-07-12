import { useSimulatedPriceOracleContext } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracleProvider';
import { Badge } from 'react-daisyui';

export const QuickSimulationFilters = () => {
  const {
    simulatedPriceOracles,
    deleteSimulatedPriceOracle,
    clearSimulatedPriceOracles,
  } = useSimulatedPriceOracleContext();

  if (simulatedPriceOracles.size === 0) {
    return null;
  }

  return (
    <div className="indicator">
      <span className="indicator-item indicator-top indicator-center badge">
        Simulated
      </span>
      <span className="indicator-item indicator-top indicator-right ">
        <button
          onClick={() => clearSimulatedPriceOracles()}
          className="btn btn-xs btn-circle"
        >
          ✕
        </button>
      </span>
      <div className="grid gap-3 grid-flow-col p-3 rounded-xl border-neutral border-2">
        {Array.from(simulatedPriceOracles.values())
          .slice(0, 3)
          .map(({ token, priceUsd }) => (
            <Badge className="h-8 pl-1 badge-outline">
              <a
                onClick={() => deleteSimulatedPriceOracle(token)}
                className="w-5 h-5 btn btn-xs btn-circle btn-ghost font-content"
              >
                ✕
              </a>
              {token.symbol} {priceUsd.toDisplayString()}
            </Badge>
          ))}
        {simulatedPriceOracles.size > 3 && (
          <label
            htmlFor="my-modal"
            className="btn btn-ghost btn-circle btn-sm modal-button font-bold"
          >
            ⋯
          </label>
        )}
      </div>
    </div>
  );
};
