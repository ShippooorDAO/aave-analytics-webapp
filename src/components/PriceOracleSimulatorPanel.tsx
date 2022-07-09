import { Token } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { SimulatedPriceOracle } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracle.type';
import { useSimulatedPriceOracleContext } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracleProvider';
import { useState } from 'react';
import { Badge, Button, Table } from 'react-daisyui';
import TokenChip from './TokenChip';
import NoRowsOverlay from './tables/NoRowsOverlay';
import { TokenSelect } from './TokenSelect/TokenSelect';
import { UsdAmount } from '@/shared/UsdAmount';

export const PriceOracleSimulatorPanel = () => {
  const {
    simulatedPriceOracles,
    setSimulatedPriceOracles,
    clearSimulatedPriceOracles,
  } = useSimulatedPriceOracleContext();
  const [simulatedTokens, setSimulatedTokens] = useState<Token[]>([]);
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, SimulatedPriceOracle>
  >(new Map<string, SimulatedPriceOracle>());

  const addToken = (token: Token) => {
    if (!simulatedTokens.includes(token)) {
      setSimulatedTokens([...simulatedTokens, token]);
    }
  };

  const removeToken = (token: Token) => {
    if (!simulatedTokens.includes(token)) {
      return;
    }
    setSimulatedTokens(simulatedTokens.filter((_token) => _token !== token));
  };

  const clearAllTokens = () => {};

  const changeSimulatedValue = (token: Token, value: string) => {
    const priceUsd = new UsdAmount(Number(value));

    if (priceUsd.n.lte(0)) {
      return;
    }

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

  const applyPendingChanges = () => {
    setSimulatedPriceOracles(
      new Map([
        ...Array.from(simulatedPriceOracles.entries()),
        ...Array.from(pendingChanges.entries()),
      ])
    );
    setPendingChanges(new Map<string, SimulatedPriceOracle>());
  };

  const revertPendingChanges = () => {
    setPendingChanges(new Map<string, SimulatedPriceOracle>());
    setSimulatedTokens(
      Array.from(simulatedPriceOracles.values()).map(({ token }) => token)
    );
  };

  const clearSimulation = () => {
    setSimulatedTokens([]);
    setPendingChanges(new Map<string, SimulatedPriceOracle>());
    clearSimulatedPriceOracles();
  };

  const clearTokenSimulation = (token: Token) => {
    simulatedPriceOracles.delete(token.id);
    setSimulatedPriceOracles(simulatedPriceOracles);
    setSimulatedTokens(
      simulatedTokens.filter((token_) => token.id !== token_.id)
    );
    pendingChanges.delete(token.id);
    setPendingChanges(pendingChanges);
  };

  return (
    <>
      {simulatedPriceOracles.size > 0 && (
        <div className="indicator">
          <span className="indicator-item indicator-top indicator-center badge">
            Simulated
          </span>
          <span className="indicator-item indicator-top indicator-right ">
            <button
              onClick={() => clearSimulation()}
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
                    onClick={() => clearTokenSimulation(token)}
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
      )}
      <label
        htmlFor="my-modal"
        className="btn btn-outline btn-rounded btn-sm modal-button"
      >
        Run simulation
      </label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-5xl">
          <label
            htmlFor="my-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2  "
          >
            ✕
          </label>
          <div className="w-56 mb-2">
            <TokenSelect
              onSelect={(token) => addToken(token)}
              excludes={simulatedTokens}
            />
          </div>
          {simulatedTokens.length === 0 ? (
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
                {simulatedTokens.map((token: Token) => (
                  <Table.Row id={token.id}>
                    <span className="z-0">
                      <TokenChip token={token} />
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
                          changeSimulatedValue(token, e.target.value)
                        }
                        value={
                          pendingChanges.get(token.id)?.price ||
                          simulatedPriceOracles.get(token.id)?.price
                        }
                      />
                    </span>
                    <span>
                      <Button
                        className="btn-sm btn-ghost btn-circle btn-outline btn-xs"
                        onClick={() => removeToken(token)}
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
              <Button onClick={() => revertPendingChanges()}>
                Revert pending changes
              </Button>
            )}
            <Button onClick={() => clearAllTokens()}>Reset</Button>
            <label
              onClick={() => applyPendingChanges()}
              htmlFor="my-modal"
              className="btn btn-primary"
            >
              Apply
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
