import { getSymbolIcon } from '@/utils/Visuals';

export default function UsdMarketChip({
  name,
  symbol,
  className,
  usd,
}: {
  name: string;
  symbol: string;
  className?: string;
  usd?: string;
}) {
  return (
    <div className={`${className}  ${classes.chip}`}>
      <img className={classes.logo} src={getSymbolIcon(symbol)} alt={symbol} />
      <h4 className={classes.name}>{name}</h4>
      {usd ? <h4 className={classes.usd}>{usd}</h4> : ''}
    </div>
  );
}
