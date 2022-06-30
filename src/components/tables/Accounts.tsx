import * as React from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridColDef,
  GridLinkOperator,
} from '@mui/x-data-grid';
import { PercentageGridValueFormatter } from '@/utils/DataGrid';

const columns: GridColDef[] = [
  { field: 'address', headerName: 'Address', width: 300 },
  {
    field: 'accountValue',
    headerName: 'Account value',
    type: 'number',

    width: 150,
  },
  {
    field: 'freeCollateral',
    headerName: 'Free collateral',
    type: 'number',
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
    field: 'crossCurrencyRisk',
    headerName: 'Cross-currency risk',
    width: 160,
  },
];

const rows = [
  {
    id: '0x10bf1dcb5ab7860bab1c3320163c6dddf8dcc0e4',
    address: '0x10bf1dcb5ab7860bab1c3320163c6dddf8dcc0e4',
    accountValue: 21949362.71,
    freeCollateral: 15542.53,
    ltv: 0.3209,
    collateralRatio: 3.0646,
    crossCurrencyRisk: true,
  },
  {
    id: '0x513ea9319e98713f25a387c2ca66d625b57495d6',
    address: '0x013ea9319e98713f25a387c2ca66d625b57495d6',
    accountValue: 21949362.71,
    freeCollateral: 15542.53,
    ltv: 0.3209,
    collateralRatio: 3.0646,
    crossCurrencyRisk: true,
  },
  {
    id: '0x413ea9319e98713f25a387c2ca66d625b57495d6',
    address: '0x10bf1dcb5ab7860bab1c3320163c6dddf8dcc0e4',
    accountValue: 21949362.71,
    freeCollateral: 15542.53,
    ltv: 0.3209,
    collateralRatio: 3.0646,
    crossCurrencyRisk: true,
  },
  {
    id: '0x113ea9319e98713f25a387c2ca66d625b57495d6',
    address: '0x10bf1dcb5ab7860bab1c3320163c6dddf8dcc0e4',
    accountValue: 21949362.71,
    freeCollateral: 15542.53,
    ltv: 0.3209,
    collateralRatio: 3.0646,
    crossCurrencyRisk: true,
  },
  {
    id: '0x213ea9319e98713f25a387c2ca66d625b57495d6',
    address: '0x10bf1dcb5ab7860bab1c3320163c6dddf8dcc0e4',
    accountValue: 21949362.71,
    freeCollateral: 15542.53,
    ltv: 0.3209,
    collateralRatio: 3.0646,
    crossCurrencyRisk: true,
  },
  {
    id: '0x313ea9319e98713f25a387c2ca66d625b57495d6',
    address: '0x10bf1dcb5ab7860bab1c3320163c6dddf8dcc0e4',
    accountValue: 21949362.71,
    freeCollateral: 15542.53,
    ltv: 0.3209,
    collateralRatio: 3.0646,
    crossCurrencyRisk: true,
  },
];

function QuickSearchToolbar() {
  return (
    <GridToolbarQuickFilter
      quickFilterParser={(searchInput: string) =>
        searchInput
          .split(',')
          .map((value) => value.trim())
          .filter((value) => value !== '')
      }
    />
  );
}

export default function QuickFilteringCustomizedGrid() {
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
