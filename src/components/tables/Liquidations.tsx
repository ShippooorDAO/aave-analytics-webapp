import * as React from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridColDef,
  GridLinkOperator,
} from '@mui/x-data-grid';
import MockAccountsQueryResponse from '@/shared/AaveAnalyticsApi/mocks/AccountsQueryResponse.json';
import { parseAccountsQueryResponse } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProcess';

const columns: GridColDef[] = [
  { field: 'address', headerName: 'Address', width: 300 },
  { field: 'liquidatorAddress', headerName: 'Liquidator address', width: 300 },
  {
    field: 'amountLiquidated',
    headerName: 'Amount liquidated',
    type: 'number',
    width: 150,
  },
  {
    field: 'penaltyPaid',
    headerName: 'Penalty paid',
    type: 'number',
    width: 150,
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

export default function QuickFilteringCustomizedGrid() {
  const rows = parseAccountsQueryResponse(MockAccountsQueryResponse);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        filter: {
          filterModel: {
            items: [],
            quickFilterLogicOperator: GridLinkOperator.Or,
          },
        },
      }}
      components={{ Toolbar: QuickSearchToolbar }}
    />
  );
}
