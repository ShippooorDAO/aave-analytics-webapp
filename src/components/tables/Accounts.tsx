import * as React from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridColDef,
  GridLinkOperator,
} from '@mui/x-data-grid';
import {
  AccountAddressRenderCell,
  AccountTagRenderCell,
  AmountFormatter,
  HealthScoreRenderCell,
  PercentageGridValueFormatter,
} from '@/utils/DataGrid';
import { PriceOracleSimulatorPanel } from '../PriceOracleSimulatorPanel';
import MockAccountsQueryResponse from '@/shared/AaveAnalyticsApi/mocks/AccountsQueryResponse.json';
import { parseAccountsQueryResponse } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProcess';
import { Account } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';

const columns: GridColDef[] = [
  {
    field: 'address',
    headerName: 'Address',
    width: 200,
    renderCell: AccountAddressRenderCell,
  },
  {
    field: 'accountValueUsd',
    headerName: 'Account value',
    valueFormatter: AmountFormatter,
    width: 150,
  },
  {
    field: 'freeCollateralUsd',
    headerName: 'Free collateral',
    valueFormatter: AmountFormatter,
    width: 150,
  },
  {
    field: 'ltv',
    headerName: 'LTV',
    type: 'number',
    valueFormatter: PercentageGridValueFormatter,
    width: 110,
  },
  {
    field: 'collateralRatio',
    headerName: 'Collateral ratio',
    valueFormatter: PercentageGridValueFormatter,
    width: 160,
  },
  {
    field: 'healthScore',
    headerName: 'Health score',
    type: 'number',
    renderCell: HealthScoreRenderCell,
    width: 160,
  },
  {
    field: 'crossCurrencyRisk',
    headerName: 'Cross-currency risk',
    type: 'boolean',
    width: 160,
  },
  {
    field: 'tag',
    headerName: 'Tag',
    width: 160,
    renderCell: AccountTagRenderCell,
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
      <PriceOracleSimulatorPanel />
    </div>
  );
}

export default function AccountsTable() {
  const rows = parseAccountsQueryResponse(MockAccountsQueryResponse);
  const openAccount = (account: Account) => {
    window.open(`/accounts/${account.id}`, '_blank');
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      onRowClick={({ row }) => openAccount(row)}
      getRowClassName={() => 'cursor-pointer'}
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
