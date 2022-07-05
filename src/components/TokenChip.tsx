import { Token } from '@/shared/AaveAnalyticsApi/AaveAnalyticsApi.type';
import { getIconUriForToken } from '@/utils/Visuals';
import { Badge } from 'react-daisyui';

export function TokenChip({ token }: { token: Token }) {
  const iconImageUri = getIconUriForToken(token.id);
  return (
    <Badge className="badge-outline h-8">
      {iconImageUri && <img className="h-6 mr-3" src={iconImageUri} />}
      <span>{token.symbol}</span>
    </Badge>
  );
}

export default TokenChip;
