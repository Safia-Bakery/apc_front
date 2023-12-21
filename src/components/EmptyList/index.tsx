type Props = {
  label?: string;
};

const EmptyList = ({ label = "Спосок пуст" }: Props) => {
  return (
    <div className="w-full">
      <p className="text-center w-full">{label}</p>
    </div>
  );
};

export default EmptyList;
