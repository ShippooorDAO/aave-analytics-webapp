import { getIconForSymbol } from '@/utils/Visuals';

export function CurrencyIcon({
  symbol,
  ...rest
}: { symbol: string } & React.HTMLAttributes<HTMLDivElement>) {
  const iconImageUri = getIconForSymbol(symbol.toLowerCase());
  return <img {...rest} src={iconImageUri} />;
}
