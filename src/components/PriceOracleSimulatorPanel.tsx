import { Token } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { useSimulatedPriceOracleContext } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracleProvider';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-daisyui';
import NoRowsOverlay from './tables/NoRowsOverlay';
import { TokenSelect } from './TokenSelect/TokenSelect';
import { UsdAmount } from '@/shared/UsdAmount';
import { SimulatedPriceOracle } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracle.type';
import { TokenChip } from './badges/TokenChip';

export const PriceOracleSimulatorPanel = () => {
  const {
    simulatedPriceOracles,
    setSimulatedPriceOracles,
    deleteSimulatedPriceOracle,
    clearSimulatedPriceOracles,
  } = useSimulatedPriceOracleContext();
  const [tokenRows, setTokenRows] = useState<Token[]>([]);
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, SimulatedPriceOracle>
  >(new Map<string, SimulatedPriceOracle>());

  useEffect(() => {
    if (simulatedPriceOracles.size === 0) {
      setTokenRows([]);
    }
  }, [simulatedPriceOracles]);

  const clearPendingChanges = () => {
    setPendingChanges(new Map<string, SimulatedPriceOracle>());
    setTokenRows(
      Array.from(simulatedPriceOracles.values()).map((sim) => sim.token)
    );
  };

  const setPendingChange = (token: Token, priceUsd: UsdAmount) => {
    const pendingChange = pendingChanges.get(token.id);
    if (pendingChange?.priceUsd.toExactString() === priceUsd.toExactString()) {
      return;
    }

    setPendingChanges(
      new Map([
        ...Array.from(pendingChanges.entries()),
        [token.id, { token, priceUsd }],
      ])
    );
  };

  const _deleteSimulatedPriceOracle = (token: Token) => {
    deleteSimulatedPriceOracle(token);
    pendingChanges.delete(token.id);
    setPendingChanges(pendingChanges);
    setTokenRows(tokenRows.filter((token_) => token_.id !== token.id));
  };

  const clearAll = () => {
    setPendingChanges(new Map<string, SimulatedPriceOracle>());
    clearSimulatedPriceOracles();
    setTokenRows([]);
  };

  const commitPendingChanges = () => {
    setSimulatedPriceOracles(
      new Map([
        ...Array.from(simulatedPriceOracles.entries()),
        ...Array.from(pendingChanges.entries()),
      ])
    );
    setPendingChanges(new Map<string, SimulatedPriceOracle>());
  };

  const addTokenRow = (token: Token) => {
    if (!tokenRows.includes(token)) {
      setTokenRows([...tokenRows, token]);
    }
  };

  const _setPendingChange = (token: Token, value: string) => {
    const priceUsd = new UsdAmount(Number(value));

    if (priceUsd.n.lte(0)) {
      return;
    }

    setPendingChange(token, priceUsd);
  };

  return (
    <div>
      <label
        htmlFor="my-modal"
        className="btn btn-outline btn-rounded btn-sm modal-button"
      >
        Run simulation
      </label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-5xl max-h-[90%]">
          <label
            htmlFor="my-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2  "
          >
            ✕
          </label>
          <div className="w-56 mb-2">
            <TokenSelect
              onSelect={(token) => addTokenRow(token)}
              excludes={tokenRows}
            />
          </div>
          {tokenRows.length === 0 ? (
            <NoRowsOverlay text="Add token to start" />
          ) : (
            <Table className="table w-full table-compact col-span-2">
              <Table.Head>
                <span className="z-0">Symbol</span>
                <span>Current Price</span>
                <span>Simulated Price</span>
                <span></span>
              </Table.Head>
              <Table.Body>
                {tokenRows.map((token: Token) => (
                  <Table.Row id={token.id}>
                    <span className="z-0">
                      <TokenChip symbol={token.symbol} />
                    </span>
                    <span>
                      <input
                        type="text"
                        className="input input-bordered w-50 max-w-xs"
                        value={token.priceUsd.toDisplayString()}
                        disabled
                      />
                    </span>
                    <span>
                      <input
                        type="number"
                        className="input input-bordered w-50 max-w-xs"
                        onChange={(e) =>
                          _setPendingChange(token, e.target.value)
                        }
                        value={
                          pendingChanges.get(token.id)?.priceUsd.toNumber() ||
                          simulatedPriceOracles
                            .get(token.id)
                            ?.priceUsd.toNumber()
                        }
                      />
                    </span>
                    <span>
                      <Button
                        className="btn-sm btn-ghost btn-circle btn-outline btn-xs"
                        onClick={() => _deleteSimulatedPriceOracle(token)}
                      >
                        ✕
                      </Button>
                    </span>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <div className="modal-action">
            {pendingChanges.size > 0 && (
              <Button onClick={clearPendingChanges}>
                Revert pending changes
              </Button>
            )}
            <Button onClick={() => clearAll()}>Reset</Button>
            <label
              onClick={commitPendingChanges}
              htmlFor="my-modal"
              className="btn btn-primary"
            >
              Apply
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
