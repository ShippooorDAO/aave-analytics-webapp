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
} from '@/utils/DataGrid';
import { PriceOracleSimulatorPanel } from '../PriceOracleSimulatorPanel';
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
import { LinearProgress } from '@mui/material';

const dataGridOperatorsMapping: { [key: string]: Operator } = {
  '=': Operator.EQ,
  '<=': Operator.SM_EQ,
  '<': Operator.SM,
  '>=': Operator.GT_EQ,
  '>': Operator.GT,
};

const numericOnlyOperators: GridFilterOperator[] =
  getGridNumericOperators().filter(
    (operator) =>
      operator.label &&
      Object.keys(dataGridOperatorsMapping).includes(operator.label)
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
    width: 150,
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
    width: 150,
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

  const { data, loading } = useQuery<AccountsQueryResponse>(ACCOUNTS_QUERY, {
    variables: createAccountsQueryVariables({
      ...accountsQueryParams,
      pageSize: tablePageSize * pagesPerQuery,
      pageNumber: Math.floor(tablePageNumber / pagesPerQuery) + 1,
    }),
  });

  const handleFilterModelChange = (model: GridFilterModel) => {
    const filter: Filters = {};

    model.items.forEach((item) => {
      const value = item.value;
      const field = item.columnField;
      if (!value || value === '') {
        return;
      }

      const fieldType = fieldTypes[item.columnField as keyof typeof fieldTypes];
      const operator = dataGridOperatorsMapping[item.operatorValue || ''];

      switch (fieldType) {
        case FieldType.BIG_INT:
          if (!operator) {
            break;
          }
          filter.bigintFilters = (filter.bigintFilters || []).concat({
            field,
            operator,
            value: new UsdAmount(Number(value)).n.toString(),
          });
          break;
        case FieldType.FLOAT:
          if (!operator) {
            break;
          }
          filter.floatFilters = (filter.floatFilters || []).concat({
            field,
            operator,
            value: Number(value),
          });
          break;
        case FieldType.BOOLEAN:
          filter.boolFilters = (filter.boolFilters || []).concat({
            field,
            value: value === 'true',
          });
          break;
        case FieldType.STRING:
          filter.stringFilters = (filter.stringFilters || []).concat({
            field,
            contains: value,
          });
          break;
      }
    });

    const search = model.quickFilterValues?.[0];

    setAccountsQueryParams({
      ...accountsQueryParams,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
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

    setAccountsQueryParams({
      ...accountsQueryParams,
      sortBy,
      sortDirection,
    });
  };

  const { accounts, totalEntries } = data
    ? parseAccountsQueryResponse(data)
    : { accounts: [], totalEntries: 0 };

  const rows = accounts.slice(
    (tablePageNumber % pagesPerQuery) * tablePageSize,
    (tablePageNumber % pagesPerQuery) * tablePageSize + tablePageSize
  );

  return (
    <div className="h-[83vh]">
      <DataGrid
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[tablePageSize]}
        getRowClassName={() => 'cursor-pointer'}
        paginationMode="server"
        filterMode="server"
        sortingMode="server"
        loading={loading}
        rowCount={totalEntries}
        pageSize={tablePageSize}
        page={tablePageNumber}
        onPageChange={setTablePageNumber}
        onPageSizeChange={setTablePageSize}
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
        components={{
          Toolbar: QuickSearchToolbar,
          LoadingOverlay: LinearProgress,
        }}
      />
    </div>
  );
}
