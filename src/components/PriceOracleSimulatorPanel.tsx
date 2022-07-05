import { Token } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { useAaveAnalyticsApiContext } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import { format } from '@/utils/Format';
import { useState } from 'react';
import { Button, Modal, Table } from 'react-daisyui';
import CloseIcon from '@mui/icons-material/Close';

export const CurrencySelect = ({
  onSelect,
  excludes,
}: {
  onSelect: (token: Token) => void;
  excludes?: Token[];
}) => {
  const { tokens } = useAaveAnalyticsApiContext();
  const filteredTokens = tokens.filter(
    (token) => !(excludes || []).includes(token)
  );

  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className={
          'btn m-1' + (filteredTokens.length === 0 ? ' btn-disabled' : '')
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

export const PriceOracleSimulatorPanel = () => {
  const [simulatedTokens, setSimulatedTokens] = useState<Token[]>([]);

  const addToken = (token: Token) => {
    if (!simulatedTokens.includes(token)) {
      setSimulatedTokens([...simulatedTokens, token]);
    }
  };

  const removeToken = (token: Token) => {
    if (simulatedTokens.includes(token)) {
      setSimulatedTokens(simulatedTokens.filter((_token) => _token !== token));
    }
  };

  const clearAllTokens = () => {
    setSimulatedTokens([]);
  };

  return (
    <>
      <label htmlFor="my-modal" className="btn modal-button">
        open modal
      </label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <label htmlFor="my-modal" className="modal max-w-none">
        <div className="modal-box max-w-none">
          <CurrencySelect
            onSelect={(token) => addToken(token)}
            excludes={simulatedTokens}
          />
          {simulatedTokens.length === 0 ? (
            <article className="prose mx-auto">
              <h4 className="text-center">
                No simulation currently set up. Add token to start.
              </h4>
            </article>
          ) : (
            <Table className="table w-full table-compact">
              <Table.Head>
                <span>Symbol</span>
                <span>Current Price</span>
                <span>Price changes by...</span>
                <span>Simulated Price</span>
                <span></span>
              </Table.Head>
              <Table.Body>
                {simulatedTokens.map((token: Token) => (
                  <Table.Row id={token.id}>
                    <span>{token.symbol}</span>
                    <span>
                      <input
                        type="text"
                        placeholder="You can't touch this"
                        className="input input-bordered w-50 max-w-xs"
                        value={format(token.priceUsd, { symbol: 'USD' })}
                        disabled
                      />
                    </span>
                    <span>
                      <input
                        type="number"
                        placeholder="Type here"
                        className="input input-bordered w-50 max-w-xs"
                      />
                    </span>
                    <span>
                      <input
                        type="text"
                        placeholder="You can't touch this"
                        className="input input-bordered w-50 max-w-xs"
                        disabled
                      />
                    </span>
                    <span>
                      <Button
                        className="btn-secondary btn-circle btn-outline"
                        onClick={() => removeToken(token)}
                      >
                        <CloseIcon />
                      </Button>
                    </span>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <div className="modal-action">
            <Button onClick={() => clearAllTokens()}>Reset</Button>
            <label htmlFor="my-modal" className="btn btn-primary">
              Apply
            </label>
          </div>
        </div>
      </label>
    </>
  );
};
