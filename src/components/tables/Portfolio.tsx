import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AmountFormatter, TokenRenderCell } from '@/utils/DataGrid';
import { LinearProgress } from '@mui/material';
import NoRowsOverlay from './NoRowsOverlay';
import { TokenAmount } from '@/shared/TokenAmount';

const columns: GridColDef[] = [
  {
    field: 'token',
    headerName: 'Token',
    valueGetter: (p) => p.row.token,
    renderCell: TokenRenderCell,
    width: 110,
  },
  {
    field: 'tokenAmount',
    headerName: 'Amount',
    valueGetter: (p) => p.row,
    valueFormatter: AmountFormatter,
    width: 160,
  },
  {
    field: 'tokenPrice',
    headerName: 'Token Price (USD)',
    valueGetter: (p) => p.row.token.priceUsd,
    valueFormatter: AmountFormatter,
    width: 160,
  },
  {
    field: 'value',
    headerName: 'Value (USD)',
    valueGetter: (p) => p.row.toUsd(),
    valueFormatter: AmountFormatter,
    width: 160,
  },
];

export interface PortfolioTableProps {
  positions?: TokenAmount[];
}

const NoTransactionsOverlay = () => <NoRowsOverlay text="No positions" />;

export default function PortfolioTable({ positions }: PortfolioTableProps) {
  const loading = positions === undefined;

  const rows = positions;

  return (
    <DataGrid
      rows={rows || []}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.symbol}
      hideFooter={true}
      components={{
        LoadingOverlay: LinearProgress,
        NoRowsOverlay: NoTransactionsOverlay,
      }}
    />
  );
}
