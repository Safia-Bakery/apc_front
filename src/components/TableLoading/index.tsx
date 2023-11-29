import Loading from "../Loader";

const TableLoading = () => {
  return (
    <tr>
      <td className="py-4 flex justify-center w-full">
        <Loading absolute />
      </td>
    </tr>
  );
};

export default TableLoading;
