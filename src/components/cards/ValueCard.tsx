import { Card, CardProps } from './Card';

interface ValueCardProps extends CardProps {
  variant?: string;
}

export const ValueCard = ({
  title,
  children,
  className,
  variant,
}: ValueCardProps) => {
  let textClass: string;
  switch (variant) {
    case 'secondary':
      textClass = 'text-2xl';
      break;
    default:
      textClass = 'font-bold text-4xl';
  }

  return (
    <Card className={`p-3 ${className}`}>
      <div>{title}</div>
      <div className={textClass}>{children}</div>
    </Card>
  );
};
