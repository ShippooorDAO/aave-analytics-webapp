import {
  Token,
  TransactionType,
} from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import TokenAmount from '@/shared/TokenAmount';
import {
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { Badge } from 'react-daisyui';
import Blockies from 'react-blockies';
import { getAccountShorthand } from './Format';
import { getIconUriForToken } from './Visuals';
import HealthFactorBadge from '@/components/HealthFactorBadge';

export function PercentageGridValueFormatter(
  params: GridValueFormatterParams<number>
) {
  if (params.value == null) {
    return '';
  }

  const valueFormatted = Number(params.value * 100).toLocaleString();
  return `${valueFormatted} %`;
}

export function TransactionTypeFormatter(
  params: GridValueFormatterParams<TransactionType>
) {
  if (!params.value) {
    return 'Unknown';
  }
  switch (params.value) {
    case TransactionType.BORROW:
      return 'Borrow';
    case TransactionType.DEPOSIT:
      return 'Deposit';
    case TransactionType.REPAY:
      return 'Repay';
    default:
      return 'Unknown';
  }
}

export function TokenRenderCell(params: GridRenderCellParams<Token>) {
  if (!params.value) {
    return 'Unknown';
  }
  const iconImageUri = getIconUriForToken(params.value.id);
  if (iconImageUri) {
    return (
      <Badge className="badge-outline h-8">
        <img className="h-6 mr-3" src={iconImageUri} />
        <span>{params.value.symbol}</span>
      </Badge>
    );
  }
  return params.value.symbol;
}

export function HealthScoreRenderCell(params: GridRenderCellParams<number>) {
  const healthScore = params.value;
  if (!healthScore) {
    return '';
  }
  return <HealthFactorBadge healthFactor={healthScore} />;
}

export function TokenAmountFormatter(
  params: GridValueFormatterParams<TokenAmount>
) {
  if (!params.value) {
    return '';
  }
  return params.value.toDisplayString();
}

export function AccountAddressRenderCell(params: GridRenderCellParams<string>) {
  if (!params.value) {
    return '';
  }
  return (
    <>
      <Blockies
        className="m-4 rounded-full inline"
        seed={params.value}
        size={10}
        scale={4}
      />
      <span>{getAccountShorthand(params.value)}</span>
    </>
  );
}

export function AccountTagRenderCell(params: GridRenderCellParams<string>) {
  if (!params.value) {
    return '';
  }
  return <Badge className="badge-accent">{params.value}</Badge>;
}
