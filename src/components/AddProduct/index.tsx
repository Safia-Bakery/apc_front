import { FC, PropsWithChildren } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

import Card from "../Card";
import Header from "../Header";
import AddProductModal from "../AddProductModal";
import useOrder from "@/hooks/useOrder";
import syncExpenditure from "@/hooks/mutation/syncExpenditure";
import { errorToast, successToast } from "@/utils/toast";
import { useNavigateParams } from "custom/useCustomNavigate";
import deleteExpenditureMutation from "@/hooks/mutation/deleteExpenditure";
import { MainPermissions, RequestStatus } from "@/utils/types";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№" },
  { name: "name_in_table" },
  { name: "quantity" },
  { name: "comment" },
  { name: "date" },
  { name: "author" },
  { name: "" },
];

interface Props extends PropsWithChildren {
  synciiko?: MainPermissions;
  addExp?: MainPermissions;
}

const AddItems: FC<Props> = ({ children, synciiko, addExp }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const permissions = useAppSelector(permissionSelector);
  const navigate = useNavigateParams();
  const { mutate, isPending: isLoading } = syncExpenditure();
  const { mutate: deleteExp } = deleteExpenditureMutation();

  const { data: products, refetch } = useOrder({
    id: Number(id),
    enabled: false,
  });
  const isFinished = products?.status && products?.status < RequestStatus.done;

  const handleDelete = (id: number) => () => {
    deleteExp(id, {
      onSuccess: (data: any) => {
        if (data.success) {
          successToast("Успешно удалено");
          refetch();
        }
      },
      onError: (e: any) => errorToast(e.message),
    });
  };

  const handleSync = () =>
    mutate(
      {
        request_id: Number(id),
      },
      {
        onSuccess: (data: any) => {
          if (data.status == 200) successToast("Успешно синхронизировано");
        },
        onError: (e: any) => errorToast(e.message),
      }
    );

  const handleModal = () => navigate({ add_product_modal: true });

  return (
    <Card>
      <Header title="products">
        {synciiko && permissions?.[synciiko] && (
          <button
            disabled={isLoading}
            onClick={handleSync}
            className="btn btn-primary btn-fill btn-sm mr-2"
          >
            <img
              src="/assets/icons/sync.svg"
              height={20}
              width={20}
              alt="sync"
              className="mr-2"
            />
            {t("sync_with_iico")}
          </button>
        )}
        {addExp && isFinished && permissions?.[addExp] && (
          <button
            className="btn btn-success btn-fill btn-sm"
            onClick={handleModal}
            id={"add_expenditure"}
          >
            {t("add")}
          </button>
        )}
      </Header>
      <div className="content table-responsive table-full-width overflow-hidden">
        <table className="table table-hover">
          <thead>
            <tr>
              {column.map(({ name }) => {
                return (
                  <th className={"bg-primary text-white"} key={name}>
                    {name}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {products?.expanditure?.map((item, idx) => (
              <tr className="bg-blue" key={item.id}>
                <td width="40">{idx + 1}</td>
                <td>{item?.tool?.name}</td>
                <td>{item?.amount}</td>
                <td>{item?.comment}</td>
                <td>{dayjs(item?.created_at).format("DD.MM.YYYY HH:mm")}</td>
                <td>{item?.user?.full_name}</td>
                <td width={50}>
                  <div
                    className="flex justify-content-center pointer"
                    onClick={handleDelete(item?.id)}
                  >
                    <img src="/assets/icons/delete.svg" alt="delete" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />

        {children}
      </div>
      {addExp && <AddProductModal addExp={addExp} />}
    </Card>
  );
};

export default AddItems;
