export const CountCard = ({
  title,
  amount,
}: {
  title: string;
  amount: string;
}) => {
  return (
    <div>
      <div>{title}</div>
      <div>{amount}</div>
    </div>
  );
};

export default CountCard;
