import { Token } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { useAaveAnalyticsApiContext } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import { SimulatedPriceOracle } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracle.type';
import { useSimulatedPriceOracleContext } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracleProvider';
import { format } from '@/utils/Format';
import { useState } from 'react';
import { Badge, Button, Table } from 'react-daisyui';
import TokenChip from './TokenChip';
import Select from 'react-select';
import NoRowsOverlay from './tables/NoRowsOverlay';

export const CurrencySelect = ({
  onSelect,
  excludes,
  className,
  ...rest
}: {
  onSelect: (token: Token) => void;
  excludes?: Token[];
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { tokens } = useAaveAnalyticsApiContext();
  const filteredTokens = tokens.filter(
    (token) => !(excludes || []).includes(token)
  );

  return (
    <div className={`dropdown ${className || ''}`} {...rest}>
      <label
        tabIndex={0}
        className={
          'btn btn-sm m-1 mb-3' +
          (filteredTokens.length === 0 ? ' btn-disabled' : '')
        }
      >
        + Add Token
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {filteredTokens.map((token: Token) => (
          <li key={token.id}>
            <a onClick={() => onSelect(token)}>{token.symbol}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CurrencySelect2 = ({
  onSelect,
  excludes,
}: {
  onSelect: (token: Token) => void;
  excludes?: Token[];
  className?: string;
}) => {
  const { tokens } = useAaveAnalyticsApiContext();
  const filteredTokens = tokens.filter(
    (token) => !(excludes || []).includes(token)
  );

  const options = filteredTokens.map((token: Token) => ({
    value: token.id,
    label: token.symbol,
  }));

  return (
    <Select
      classNamePrefix="react-select"
      onChange={(entry) => {
        const token = filteredTokens.find((t) => t.id === entry?.value);
        if (token) {
          onSelect(token);
        }
      }}
      controlShouldRenderValue={false}
      options={options}
      isSearchable={true}
      closeMenuOnSelect={false}
      maxMenuHeight={200}
      placeholder="Search token..."
      formatOptionLabel={({ value }) => {
        const token = filteredTokens.find((t) => t.id === value);
        if (token) {
          return <TokenChip token={token} />;
        }
        return '';
      }}
    />
  );
};

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
    const price = Number(value);

    if (price <= 0) {
      return;
    }

    const pendingChange = pendingChanges.get(token.id);
    if (pendingChange?.price === price) {
      return;
    }

    setPendingChanges(
      new Map([
        ...Array.from(pendingChanges.entries()),
        [token.id, { token, price }],
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
          <div className="grid gap-5 grid-flow-col p-3 rounded-xl border-neutral border-2">
            {Array.from(simulatedPriceOracles.values()).map(
              ({ token, price }) => (
                <Badge className="h-8 pl-1 badge-outline">
                  <a
                    onClick={() => clearTokenSimulation(token)}
                    className="w-5 h-5 btn btn-xs btn-circle btn-ghost font-content"
                  >
                    ✕
                  </a>
                  {token.symbol}{' '}
                  {format(price, { abbreviate: true, symbol: 'USD' })}
                </Badge>
              )
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
      <div className="modal max-w-none min-h-96 ">
        <div className="modal-box max-w-none moverflow-hidden">
          <label
            htmlFor="my-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2  "
          >
            ✕
          </label>
          <div className="w-56 mb-2">
            <CurrencySelect2
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
