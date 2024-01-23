import Header from "../Header";
import { useParams } from "react-router-dom";
import useOrder from "@/hooks/useOrder";
import updateInventoryProdMutation from "@/hooks/mutation/updateInventoryProd";
import { RequestStatus } from "@/utils/types";
import { errorToast } from "@/utils/toast";

const column = [
  { name: "№" },
  { name: "Наименование" },
  { name: "Количество" },
  { name: "Комментарии" },
  { name: "Статус" },
  { name: "" },
];

const AddedInventoryProducts = () => {
  const { id } = useParams();

  const { mutate } = updateInventoryProdMutation();

  const { data: order, refetch } = useOrder({ id: Number(id) });

  const handleStatus = (status: number) => {
    if (!order?.status && !status) return "Новый";
    if (!!order?.status && !status) return "Формировано на новую заявку";

    if (status) return "Передано";
  };

  const handleUpdateProd = (id: number) => () =>
    mutate(
      { id, status: 1 },
      { onSuccess: () => refetch(), onError: (e: any) => errorToast(e.message) }
    );

  return (
    <>
      <Header title="Товары" />
      <div className="content table-responsive table-full-width overflow-hidden !p-0">
        <table className="table table-hover">
          <thead>
            <tr>
              {column.map(({ name }) => {
                return (
                  <th className="bg-primary text-white" key={name}>
                    {name}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {order?.expanditure?.map((item, idx) => (
              <tr className="bg-blue" key={item.id}>
                <td width="40">{idx + 1}</td>
                <td>{item?.tool.name}</td>
                <td>{item?.amount}</td>
                <td>{item?.comment}</td>
                <td>{handleStatus(item?.status)}</td>
                <td width={40}>
                  {!item.status && order.status === RequestStatus.new && (
                    <div
                      className="cursor-pointer"
                      onClick={handleUpdateProd(item.id)}
                    >
                      <img src="/assets/icons/send.svg" alt="отправить" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
      </div>
    </>
  );
};

export default AddedInventoryProducts;
