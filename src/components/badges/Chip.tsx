import { Badge } from 'react-daisyui';

export const Chip = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Badge
      className={`badge-outline h-8 pl-1 pr-3 shadow-sm border-1 border-base-300 bg-base-100${
        className ? ' ' + className : ''
      }`}
    >
      {children}
    </Badge>
  );
};
