import Header from "../Header";
import { useParams } from "react-router-dom";
import useOrder from "@/hooks/useOrder";
import updateInventoryProdMutation from "@/hooks/mutation/updateInventoryProd";
import { RequestStatus } from "@/utils/types";
import { errorToast, successToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№" },
  { name: "name_in_table" },
  { name: "quantity" },
  { name: "comments" },
  { name: "status" },
  { name: "" },
];

const AddedInventoryProducts = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { mutate } = updateInventoryProdMutation();

  const { data: order, refetch } = useOrder({ id: Number(id) });

  const handleStatus = (status: number) => {
    if (order?.status! < RequestStatus.done && !status) return "new";
    if (order?.status === RequestStatus.done && !status)
      return "assing_to_new_request";
    if (!!status) return "sent";
    else return "";
  };

  const handleUpdateProd = (id: number) => () =>
    mutate(
      { id, status: 1 },
      {
        onSuccess: () => {
          successToast("success");
          refetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );

  return (
    <>
      <Header title="products" />
      <div className="content table-responsive table-full-width overflow-hidden !p-0">
        <table className="table table-hover">
          <thead>
            <tr>
              {column.map(({ name }) => {
                return (
                  <th className="bg-primary text-white" key={name}>
                    {t(name)}
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
                <td>{t(handleStatus(item?.status))}</td>
                <td width={40}>
                  {!item.status && order.status === RequestStatus.confirmed && (
                    <div
                      className="cursor-pointer"
                      onClick={handleUpdateProd(item.id)}
                    >
                      <img src="/assets/icons/send.svg" alt={t("send")} />
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
