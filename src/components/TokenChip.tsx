import { Token } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { getIconForSymbol } from '@/utils/Visuals';
import { Badge } from 'react-daisyui';
import { CurrencyIcon } from './CurrencyIcon';

export function TokenChip({ token }: { token: Token }) {
  const iconImageUri = getIconForSymbol(token.symbol.toLowerCase());
  return (
    <Badge className="badge-outline h-8 pl-1">
      {iconImageUri && <CurrencyIcon className="h-6 mr-3" token={token} />}
      <span>{token.symbol}</span>
    </Badge>
  );
}

export default TokenChip;
