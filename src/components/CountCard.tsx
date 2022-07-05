export const CountCard = ({
  title,
  amount,
}: {
  title: string;
  amount: string;
}) => {
  return (
    <div className="bg-base-200 rounded-xl shadow-md p-2">
      <div className="font-bold">{title}</div>
      <div>{amount}</div>
    </div>
  );
};

export default CountCard;
