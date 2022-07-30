import * as React from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridColDef,
  GridLinkOperator,
  GridSortModel,
  getGridNumericOperators,
  GridFilterOperator,
  GridFilterModel,
} from '@mui/x-data-grid';
import {
  AccountAddressRenderCell,
  AmountFormatter,
  TokenRenderCell,
  DatetimeFormatter,
} from '@/utils/DataGrid';
import { parseLiquidationsQueryResponse } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProcess';
import {
  LiquidationsQueryResponse,
  Transaction,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { useState } from 'react';
import { useAaveAnalyticsApiContext } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiProvider';
import { LinearProgress } from '@mui/material';
import { useQuery } from '@apollo/client';
import {
  FieldType,
  fieldTypes,
  Filters,
  LiquidationsQueryParams,
  LIQUIDATIONS_QUERY,
  Operator,
  SortDirection,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApiQueries';
import { UsdAmount } from '@/shared/UsdAmount';

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
    field: 'timestamp',
    type: 'datetime',
    headerName: 'Timestamp',
    valueFormatter: DatetimeFormatter,
    width: 175,
  },
  {
    field: 'accountId',
    headerName: 'Liquidated account',
    renderCell: AccountAddressRenderCell,
    type: 'string',
    width: 180,
  },
  {
    field: 'liquidator',
    headerName: 'Liquidator',
    renderCell: AccountAddressRenderCell,
    type: 'string',
    width: 180,
  },
  {
    field: 'principalToken',
    headerName: 'Principal token',
    renderCell: TokenRenderCell,
    width: 140,
  },
  {
    field: 'collateralToken',
    headerName: 'Collateral token',
    renderCell: TokenRenderCell,
    width: 140,
  },
  {
    field: 'amountLiquidatedUsd',
    headerName: 'Amount liquidated',
    valueFormatter: AmountFormatter,
    filterOperators: numericOnlyOperators,
    width: 160,
  },
  {
    field: 'penaltyPaidUsd',
    headerName: 'Penalty paid',
    valueFormatter: AmountFormatter,
    filterOperators: numericOnlyOperators,
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

export default function LiquidationsTable() {
  const pagesPerQuery = 20;

  const { tokens } = useAaveAnalyticsApiContext();
  const [tablePageNumber, setTablePageNumber] = useState<number>(0);
  const [tablePageSize, setTablePageSize] = useState<number>(25);
  const [queryParams, setQueryParams] = useState<LiquidationsQueryParams>({
    pageNumber: 1,
    pageSize: tablePageSize * pagesPerQuery,
  });

  const { data, loading } = useQuery<LiquidationsQueryResponse>(
    LIQUIDATIONS_QUERY,
    {
      variables: {
        ...queryParams,
        pageSize: tablePageSize * pagesPerQuery,
        pageNumber: Math.floor(tablePageNumber / pagesPerQuery) + 1,
      },
    }
  );

  const openTransaction = (transaction: Transaction) => {
    window.open(`https://etherscan.io/tx/${transaction.id}`, '_blank');
  };

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

    setQueryParams({
      ...queryParams,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      search,
    });
  };

  const clearSortQueryParams = () => {
    const { sortBy, sortDirection, ...rest } = queryParams;
    setQueryParams(rest);
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

    const sortBy = field;

    let sortDirection: SortDirection | undefined;
    if (sort === 'asc') {
      sortDirection = 'ASC';
    } else if (sort === 'desc') {
      sortDirection = 'DESC';
    }

    setQueryParams({
      ...queryParams,
      sortBy,
      sortDirection,
    });
  };

  const { liquidations, totalEntries } =
    data && tokens.length > 0
      ? parseLiquidationsQueryResponse(data, tokens)
      : { liquidations: [], totalEntries: 0 };

  const rows = liquidations.slice(
    (tablePageNumber % pagesPerQuery) * tablePageSize,
    (tablePageNumber % pagesPerQuery) * tablePageSize + tablePageSize
  );

  return (
    <div className="h-[83vh]">
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={({ row }) => openTransaction(row)}
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
