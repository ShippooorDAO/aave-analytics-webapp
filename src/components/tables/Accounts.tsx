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
    field: 'id',
    headerName: 'Address',
    width: 160,
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
    field: 'ltv',
    headerName: 'LTV',
    type: 'number',
    width: 90,
  },
  {
    field: 'maxLtv',
    headerName: 'Max LTV',
    type: 'number',
    width: 90,
  },
  {
    field: 'collateralRatio',
    headerName: 'Collateral ratio',
    type: 'number',
    valueGetter: (p) => (p.row.ltv !== 0 ? 1 / p.row.ltv : null),
    filterOperators: numericOnlyOperators,
    width: 160,
    filterable: false,
    sortable: false,
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
  const pagesPerQuery = 20;
  const { simulatedPriceOracles } = useSimulatedPriceOracleContext();

  const [tablePageNumber, setTablePageNumber] = useState<number>(0);
  const [tablePageSize, setTablePageSize] = useState<number>(25);
  const [accountsQueryParams, setAccountsQueryParams] =
    useState<AccountsQueryParams>({
      pageNumber: 1,
      pageSize: tablePageSize * pagesPerQuery,
    });

  useEffect(() => {
    const simulatedPriceOraclesArr =
      simulatedPriceOracles.size > 0
        ? Array.from(simulatedPriceOracles.values())
        : undefined;

    setAccountsQueryParams({
      ...accountsQueryParams,
      simulatedTokenPrices: simulatedPriceOraclesArr,
    });
  }, [simulatedPriceOracles]);

  const { data } = useQuery<AccountsQueryResponse>(ACCOUNTS_QUERY, {
    variables: createAccountsQueryVariables({
      ...accountsQueryParams,
      pageNumber: Math.floor(tablePageNumber / pagesPerQuery) + 1,
      pageSize: tablePageSize * pagesPerQuery,
    }),
  });

  // const rows = data?.accounts || [];
  const openAccount = (account: Account) => {
    window.open(`/accounts/${account.id}`, '_blank');
  };

  const handlePageChange = (page: number) => {
    setTablePageNumber(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setTablePageSize(pageSize);
  };

  const numericalFields = [
    'accountValueUsd',
    'freeCollateralUsd',
    'ltv',
    'maxLtv',
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

    if (Object.keys(filters).length === 0) {
      const { filters, ...rest } = accountsQueryParams;
      setAccountsQueryParams(rest);
      return;
    }

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

  const { accounts, totalPages, totalEntries } = data
    ? parseAccountsQueryResponse(data)
    : { accounts: [], totalPages: 0, totalEntries: 0 };

  const rows = accounts.slice(
    (tablePageNumber % pagesPerQuery) * tablePageSize,
    (tablePageNumber % pagesPerQuery) * tablePageSize + tablePageSize
  );

  return (
    <div className="h-[83vh]">
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={({ row }) => openAccount(row)}
        rowsPerPageOptions={[tablePageSize]}
        getRowClassName={() => 'cursor-pointer'}
        paginationMode="server"
        filterMode="server"
        sortingMode="server"
        loading={accounts.length === 0}
        rowCount={totalEntries}
        pageSize={tablePageSize}
        page={tablePageNumber}
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
    </div>
  );
}
