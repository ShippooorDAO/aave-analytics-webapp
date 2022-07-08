import { Token } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { getIconForSymbol } from '@/utils/Visuals';

export function CurrencyIcon({
  token,
  ...rest
}: { token: Token } & React.HTMLAttributes<HTMLDivElement>) {
  const iconImageUri = getIconForSymbol(token.symbol.toLowerCase());
  return <img {...rest} src={iconImageUri} />;
}
