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
  FieldType,
  Operator,
  fieldTypes,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiQueries';
import { useQuery } from '@apollo/client';
import { UsdAmount } from '@/shared/UsdAmount';
import { QuickSimulationFilters } from '../QuickSimulationFilters';

const operators: { [key: string]: Operator } = {
  '=': Operator.EQ,
  '<=': Operator.SM_EQ,
  '<': Operator.SM,
  '>=': Operator.GT_EQ,
  '>': Operator.GT,
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

  const variables = createAccountsQueryVariables({
    ...accountsQueryParams,
    pageNumber: Math.floor(tablePageNumber / pagesPerQuery) + 1,
    pageSize: tablePageSize * pagesPerQuery,
  });
  const { data } = useQuery<AccountsQueryResponse>(ACCOUNTS_QUERY, {
    variables,
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

  const handleFilterModelChange = (model: GridFilterModel) => {
    const filter: Filters = {};

    model.items.forEach((item) => {
      const value = item.value;
      const field = item.columnField;
      if (!value || value === '') {
        return;
      }

      const fieldType = (
        fieldTypes as {
          [key: string]: FieldType;
        }
      )[item.columnField];
      const operator = operators[item.operatorValue || ''];

      switch (fieldType) {
        case FieldType.BIG_INT:
          if (!operator) {
            break;
          }
          filter.bigintFilters = filter.bigintFilters || [];
          filter.bigintFilters.push({
            field,
            operator,
            value: new UsdAmount(Number(value)).n.toString(),
          });
          break;
        case FieldType.FLOAT:
          if (!operator) {
            break;
          }
          filter.floatFilters = filter.floatFilters || [];
          filter.floatFilters.push({
            field,
            operator,
            value: Number(value),
          });
          break;
        case FieldType.BOOLEAN:
          filter.boolFilters = filter.boolFilters || [];
          filter.boolFilters.push({
            field,
            value: value === 'true',
          });
          break;
        case FieldType.STRING:
          filter.stringFilters =
            filter.stringFilters ||
            new Array<{
              field: string;
              contains: string;
            }>();
          filter.stringFilters.push({
            field,
            contains: value,
          });
          break;
      }
    });

    const search = model.quickFilterValues?.[0];

    setAccountsQueryParams({
      ...accountsQueryParams,
      filter,
      search,
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
