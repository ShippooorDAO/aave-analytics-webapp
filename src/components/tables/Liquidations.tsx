import * as React from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridColDef,
  GridLinkOperator,
} from '@mui/x-data-grid';
import {
  AccountAddressRenderCell,
  AmountFormatter,
  TokenRenderCell,
  TransactionTypeFormatter,
} from '@/utils/DataGrid';
import MockLiquidationsQueryResponse from '@/shared/AaveAnalyticsApi/mocks/LiquidationsQueryResponse.json';
import { parseLiquidationsQueryResponse } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProcess';
import {
  Liquidation,
  Transaction,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { useEffect, useState } from 'react';
import { useAaveAnalyticsApiContext } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import { LinearProgress } from '@mui/material';
import NoRowsOverlay from './NoRowsOverlay';

const columns: GridColDef[] = [
  {
    field: 'timestamp',
    type: 'date',
    headerName: 'Timestamp',
    width: 160,
  },
  {
    field: 'accountId',
    headerName: 'Account',
    renderCell: AccountAddressRenderCell,
    type: 'string',
    width: 220,
  },
  {
    field: 'liquidatedAccountId',
    headerName: 'Liquidated Account',
    renderCell: AccountAddressRenderCell,
    type: 'string',
    width: 220,
  },
  {
    field: 'token',
    headerName: 'Token',
    valueGetter: (p) => p.row.amount.token,
    renderCell: TokenRenderCell,
    width: 110,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    valueFormatter: AmountFormatter,
    width: 160,
  },
  {
    field: 'amountUsd',
    type: 'number',
    headerName: 'Amount (USD)',
    valueFormatter: AmountFormatter,
    width: 160,
  },
  {
    field: 'penaltyPaid',
    type: 'number',
    headerName: 'Penalty paid',
    valueFormatter: AmountFormatter,
    width: 160,
  },
  {
    field: 'penaltyPaidUsd',
    type: 'number',
    headerName: 'Penalty paid (USD)',
    valueFormatter: AmountFormatter,
    width: 160,
  },
];

function QuickSearchToolbar() {
  return (
    <div className="pl-4 pt-4 pr-4 flex gap-4 justify-between">
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput: string) =>
          searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
      />
    </div>
  );
}

const NoTransactionsOverlay = () => <NoRowsOverlay text="No liquidations" />;

export default function LiquidationsTable() {
  const [liquidations, setLiquidations] = useState<Liquidation[] | null>(null);
  const { tokens } = useAaveAnalyticsApiContext();
  const loading = liquidations === null;

  useEffect(() => {
    if (tokens.length > 0) {
      setLiquidations(
        parseLiquidationsQueryResponse(MockLiquidationsQueryResponse, tokens)
      );
    }
  }, [tokens]);

  const openTransaction = (transaction: Transaction) => {
    window.open(`https://etherscan.io/tx/${transaction.id}`, '_blank');
  };

  const rows = liquidations;

  return (
    <DataGrid
      rows={rows || []}
      columns={columns}
      onRowClick={({ row }) => openTransaction(row)}
      getRowClassName={() => 'cursor-pointer'}
      loading={loading}
      initialState={{
        filter: {
          filterModel: {
            items: [],
            quickFilterLogicOperator: GridLinkOperator.Or,
          },
        },
      }}
      components={{
        Toolbar: QuickSearchToolbar,
        LoadingOverlay: LinearProgress,
        NoRowsOverlay: NoTransactionsOverlay,
      }}
    />
  );
}
