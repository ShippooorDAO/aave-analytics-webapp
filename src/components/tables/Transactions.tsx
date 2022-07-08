import * as React from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridColDef,
  GridLinkOperator,
} from '@mui/x-data-grid';
import {
  AmountFormatter,
  TokenRenderCell,
  TransactionTypeFormatter,
} from '@/utils/DataGrid';
import MockTransactionsQueryResponse from '@/shared/AaveAnalyticsApi/mocks/TransactionsQueryResponse.json';
import { parseTransactionsQueryResponse } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProcess';
import { Transaction } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { useEffect, useState } from 'react';
import { useAaveAnalyticsApiContext } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import { LinearProgress } from '@mui/material';
import NoRowsOverlay from './NoRowsOverlay';

const columns: GridColDef[] = [
  {
    field: 'txType',
    headerName: 'Type',
    valueFormatter: TransactionTypeFormatter,
    type: 'number',
    width: 150,
  },
  {
    field: 'tokenId',
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
    headerName: 'Amount USD',
    valueFormatter: AmountFormatter,
    width: 160,
  },
  {
    field: 'timestamp',
    type: 'date',
    headerName: 'Timestamp',
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

export interface TransactionsTableProps {
  accountId?: string;
}

const NoTransactionsOverlay = () => <NoRowsOverlay text="No transactions" />;

export default function TransactionsTable({
  accountId,
}: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const { tokens } = useAaveAnalyticsApiContext();
  const loading = transactions === null;

  useEffect(() => {
    if (tokens.length > 0) {
      setTransactions(
        parseTransactionsQueryResponse(MockTransactionsQueryResponse, tokens)
      );
    }
  }, [tokens]);

  const openTransaction = (transaction: Transaction) => {
    window.open(`https://etherscan.io/tx/${transaction.id}`, '_blank');
  };

  const rows = transactions;

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
