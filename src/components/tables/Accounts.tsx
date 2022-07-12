import * as React from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridColDef,
  GridLinkOperator,
  GridFilterModel,
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
import {
  Account,
  AccountsQueryResponse,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { useSimulatedPriceOracleContext } from '@/shared/SimulatedPriceOracle/SimulatedPriceOracleProvider';
import { useEffect, useState } from 'react';
import {
  AccountsQueryParams,
  ACCOUNTS_QUERY,
  createAccountsQueryVariables,
  Filters,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiQueries';
import { useQuery } from '@apollo/client';
import { UsdAmount } from '@/shared/UsdAmount';
import { QuickSimulationFilters } from '../QuickSimulationFilters';

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
    field: 'loanToValue',
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
    <div className="p-4 flex gap-4 justify-between">
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput: string) =>
          searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
      />
      <QuickSimulationFilters />
      <PriceOracleSimulatorPanel />
    </div>
  );
}

export default function AccountsTable() {
  const { simulatedPriceOracles } = useSimulatedPriceOracleContext();
  const [accountsQueryParams, setAccountsQueryParams] =
    useState<AccountsQueryParams>({});

  useEffect(() => {
    setAccountsQueryParams({
      ...accountsQueryParams,
      simulatedTokenPrices: Array.from(simulatedPriceOracles.values()),
    });
  }, [simulatedPriceOracles]);

  const { data } = useQuery<AccountsQueryResponse>(ACCOUNTS_QUERY, {
    variables: createAccountsQueryVariables(accountsQueryParams),
  });

  // const rows = data?.accounts || [];
  const rows = parseAccountsQueryResponse(MockAccountsQueryResponse);
  const openAccount = (account: Account) => {
    window.open(`/accounts/${account.id}`, '_blank');
  };

  const onPageChange = (page: number) => {
    setAccountsQueryParams({
      ...accountsQueryParams,
      pageNumber: page,
    });
  };

  const onPageSizeChange = (pageSize: number) => {
    setAccountsQueryParams({
      ...accountsQueryParams,
      pageSize: pageSize,
    });
  };

  const operators: { [key: string]: string } = {
    '=': 'Eq',
    '<=': 'SmEq',
    '<': 'Sm',
    '>=': 'GtEq',
    '>': 'Gt',
  };

  const comparableFields = [
    'accountValueUsd',
    'freeCollateralUsd',
    'loanToValue',
    'collateralRatio',
    'healthScore',
  ];

  const onFilterChange = (model: GridFilterModel) => {
    console.log(model);
    const filters: { [key: string]: string | UsdAmount | number | boolean } =
      {};
    model.items.forEach((item) => {
      const operator = operators[item.operatorValue || ''];
      const value = item.value;
      if (item.columnField in comparableFields && operator) {
        const key = item.columnField + operators[operator];
        if (item.columnField in ['freeCollateralUsd', 'accountValueUsd']) {
          filters[key] = new UsdAmount(value);
        } else {
          filters[key] = Number(value);
        }
      } else if (item.columnField === 'hasCrossCurrencyRisk') {
        filters[item.columnField] = Boolean(value);
      }
    });
    setAccountsQueryParams({
      ...accountsQueryParams,
      filters: filters as Filters,
    });
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      className="h-[83vh]"
      onRowClick={({ row }) => openAccount(row)}
      getRowClassName={() => 'cursor-pointer'}
      paginationMode="server"
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      filterMode="server"
      onFilterModelChange={onFilterChange}
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
