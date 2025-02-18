import Header from "../Header";
import { useParams } from "react-router-dom";
import useOrder from "@/hooks/useOrder";
import updateInventoryProdMutation from "@/hooks/mutation/updateInventoryProd";
import { Departments, RequestStatus } from "@/utils/types";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { useTranslation } from "react-i18next";
import { baseURL } from "@/store/baseUrl";
import { Image } from "antd";
import { getInvRequest } from "@/hooks/inventory";
import { useState } from "react";
import AddProductModal from "../AddProductModal";
import { MainPermissions } from "@/utils/permissions";

const column = [
  { name: "№" },
  { name: "name_in_table" },
  { name: "quantity" },
  { name: "comments" },
  { name: "status" },
  { name: "photo" },
  { name: "" },
];

const AddedInventoryProducts = () => {
  const { id, dep } = useParams();
  const { t } = useTranslation();

  const [modal, $modal] = useState(false);
  const handleModal = () => $modal((prev) => !prev);

  const { mutate } = updateInventoryProdMutation();

  const { data: order, refetch } = getInvRequest({
    id: Number(id),
    department: Number(dep),
  });

  const handleStatus = (status: number) => {
    if (order?.status! < RequestStatus.finished && !status) return "new";
    if (order?.status === RequestStatus.finished && !status)
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
      <Header title="products">
        <button
          className="btn btn-success btn-sm"
          onClick={handleModal}
          id={"add_expenditure"}
        >
          {t("add")}
        </button>
      </Header>

      <div className="content table-responsive table-full-width overflow-hidden !p-0 !min-h-min">
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
                <td>{item?.tool?.name}</td>
                <td>{item?.amount}</td>
                <td>{item?.comment || t("not_given")}</td>
                <td>{t(handleStatus(item?.status))}</td>
                <td>
                  {(
                    Number(dep) === Departments.inventory_factory
                      ? item.tool?.file
                      : item.tool?.image
                  ) ? (
                    <Image
                      src={`${baseURL}/${
                        Number(dep) === Departments.inventory_factory
                          ? item.tool?.file
                          : item.tool?.image
                      }`}
                      height={30}
                      width={30}
                    />
                  ) : (
                    t("not_given")
                  )}
                </td>
                <td width={40}>
                  {!item.status && order.status === RequestStatus.received && (
                    <div
                      className="cursor-pointer"
                      onClick={handleUpdateProd(item.id)}
                    >
                      <img src="/icons/send.svg" alt={t("send")} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
      </div>

      <AddProductModal
        addExp={MainPermissions.edit_prods_inv_factory}
        handleModal={handleModal}
        modal={modal}
      />
    </>
  );
};

export default AddedInventoryProducts;
