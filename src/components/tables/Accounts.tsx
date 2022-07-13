import * as React from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridColDef,
  GridLinkOperator,
  GridFilterModel,
  getGridNumericOperators,
  GridFilterOperator,
  GridSortModel,
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
  AccountSortBy,
  SortDirection,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiQueries';
import { useQuery } from '@apollo/client';
import { UsdAmount } from '@/shared/UsdAmount';
import { QuickSimulationFilters } from '../QuickSimulationFilters';

const operators: { [key: string]: string } = {
  '=': 'Eq',
  '<=': 'SmEq',
  '<': 'Sm',
  '>=': 'GtEq',
  '>': 'Gt',
};

const numericOnlyOperators: GridFilterOperator[] =
  getGridNumericOperators().filter(
    (operator) =>
      operator.label && Object.keys(operators).includes(operator.label)
  );

const columns: GridColDef[] = [
  {
    field: 'address',
    headerName: 'Address',
    width: 200,
    renderCell: AccountAddressRenderCell,
    filterable: false,
    sortable: false,
  },
  {
    field: 'accountValueUsd',
    headerName: 'Account value',
    type: 'number',
    valueFormatter: AmountFormatter,
    filterOperators: numericOnlyOperators,
    width: 150,
  },
  {
    field: 'freeCollateralUsd',
    headerName: 'Free collateral',
    type: 'number',
    valueFormatter: AmountFormatter,
    filterOperators: numericOnlyOperators,
    width: 150,
  },
  {
    field: 'loanToValue',
    headerName: 'LTV',
    type: 'number',
    valueFormatter: PercentageGridValueFormatter,
    filterOperators: numericOnlyOperators,
    width: 110,
  },
  {
    field: 'collateralRatio',
    headerName: 'Collateral ratio',
    type: 'number',
    valueFormatter: PercentageGridValueFormatter,
    filterOperators: numericOnlyOperators,
    width: 160,
  },
  {
    field: 'healthScore',
    headerName: 'Health score',
    type: 'number',
    renderCell: HealthScoreRenderCell,
    filterOperators: numericOnlyOperators,
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
    filterable: false,
    sortable: false,
  },
];

function QuickSearchToolbar() {
  return (
    <div className="p-4 grid grid-cols-1 grid-flow-row-dense md:grid-cols-3 gap-4 justify-between">
      <GridToolbarQuickFilter
        className="justify-self-stretch"
        quickFilterParser={(searchInput: string) =>
          searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
        placeholder="Search by address or tag..."
      />
      <div className="justify-self-center">
        <QuickSimulationFilters />
      </div>
      <div className="justify-self-end">
        <PriceOracleSimulatorPanel />
      </div>
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

  const handlePageChange = (page: number) => {
    setAccountsQueryParams({
      ...accountsQueryParams,
      pageNumber: page,
    });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setAccountsQueryParams({
      ...accountsQueryParams,
      pageSize: pageSize,
    });
  };

  const numericalFields = [
    'accountValueUsd',
    'freeCollateralUsd',
    'loanToValue',
    'collateralRatio',
    'healthScore',
  ];

  const handleFilterModelChange = (model: GridFilterModel) => {
    const filters: { [key: string]: string | UsdAmount | number | boolean } =
      {};
    model.items.forEach((item) => {
      const value = item.value;

      if (!value) {
        return;
      }

      if (numericalFields.includes(item.columnField)) {
        const operator = operators[item.operatorValue || ''];
        const key = item.columnField + operator;
        if (
          item.columnField === 'freeCollateralUsd' ||
          item.columnField === 'accountValueUsd'
        ) {
          filters[key] = new UsdAmount(Number(value));
        } else {
          filters[key] = Number(value);
        }
      } else if (item.columnField === 'crossCurrencyRisk') {
        if (value === 'true') {
          filters[item.columnField] = true;
        } else if (value === 'false') {
          filters[item.columnField] = false;
        }
      }
    });
    setAccountsQueryParams({
      ...accountsQueryParams,
      filters: filters as Filters,
    });
  };

  const clearSortQueryParams = () => {
    const { sortBy, sortDirection, ...rest } = accountsQueryParams;
    setAccountsQueryParams(rest);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length === 0) {
      clearSortQueryParams();
      return;
    }

    // MUI Data Grid Free License only supports one sort model.
    // We can just pick the first one.
    const { field, sort } = model[0]!;
    if (!field) {
      clearSortQueryParams();
      return;
    }

    const sortBy = field as AccountSortBy;

    let sortDirection: SortDirection | undefined;
    if (sort === 'asc') {
      sortDirection = 'ASC';
    } else if (sort === 'desc') {
      sortDirection = 'DESC';
    }

    if (sortDirection === undefined) {
      const { sortDirection: _, ...rest } = accountsQueryParams;
      setAccountsQueryParams(rest);
      return;
    }

    setAccountsQueryParams({
      ...accountsQueryParams,
      sortBy,
      sortDirection,
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
      filterMode="server"
      sortingMode="server"
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onFilterModelChange={handleFilterModelChange}
      onSortModelChange={handleSortModelChange}
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
