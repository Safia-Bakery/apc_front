import { FC, PropsWithChildren } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

import Card from "../Card";
import Header from "../Header";
import AddProductModal from "../AddProductModal";
import useOrder from "@/hooks/useOrder";
import syncExpenditure from "@/hooks/mutation/syncExpenditure";
import { successToast } from "@/utils/toast";
import { useNavigateParams } from "custom/useCustomNavigate";
import deleteExpenditureMutation from "@/hooks/mutation/deleteExpenditure";
import { MainPermissions } from "@/utils/types";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";

const column = [
  { name: "№" },
  { name: "Наименование" },
  { name: "Количество" },
  { name: "Примичание" },
  { name: "Дата" },
  { name: "Автор" },
  { name: "" },
];

interface Props extends PropsWithChildren {
  synciiko?: MainPermissions;
}

const AddItems: FC<Props> = ({ children, synciiko }) => {
  const { id } = useParams();
  const permissions = useAppSelector(permissionSelector);
  const addExp = Number(useQueryString("addExp")) as MainPermissions;
  const navigate = useNavigateParams();
  const { mutate, isLoading } = syncExpenditure();
  const { mutate: deleteExp } = deleteExpenditureMutation();

  const { data: products, refetch } = useOrder({
    id: Number(id),
    enabled: false,
  });
  const isFinished = products?.status && products?.status < 3;

  const handleDelete = (id: number) => () => {
    deleteExp(id, {
      onSuccess: (data: any) => {
        if (data.success) {
          successToast("Успешно удалено");
          refetch();
        }
      },
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
      }
    );

  const handleModal = () => navigate({ add_product_modal: true });

  return (
    <Card>
      <Header title="Товары">
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
            Синхронизировать с iiko
          </button>
        )}
        {isFinished && permissions?.[addExp] && (
          <button
            className="btn btn-success btn-fill btn-sm"
            onClick={handleModal}
            id={"add_expenditure"}
          >
            Добавить
          </button>
        )}
      </Header>
      <div className="content">
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
      </div>
      <AddProductModal />
    </Card>
  );
};

export default AddItems;
