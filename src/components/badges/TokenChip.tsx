import { getIconForSymbol } from '@/utils/Visuals';
import { Chip } from './Chip';
import { CurrencyIcon } from './CurrencyIcon';

export function TokenChip({
  symbol,
  cancellable,
  onCancel,
}: {
  symbol: string;
  cancellable?: boolean;
  onCancel?: (symbol: string) => void;
}) {
  const iconImageUri = getIconForSymbol(symbol.toLowerCase());
  return (
    <Chip>
      {iconImageUri && <CurrencyIcon className="h-6 mr-3" symbol={symbol} />}
      <span>{symbol}</span>
      {cancellable && (
        <a
          onClick={() => onCancel && onCancel(symbol)}
          className="min-w-5 min-h-5 btn btn-xs btn-circle btn-ghost font-content ml-1 mr-[-8px]"
        >
          ✕
        </a>
      )}
    </Chip>
  );
}
