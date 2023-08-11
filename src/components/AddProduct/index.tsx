import { FC, PropsWithChildren } from "react";
import Card from "../Card";
import Header from "../Header";
import styles from "./index.module.scss";
import { useParams } from "react-router-dom";

import AddProductModal from "../AddProductModal";
import useOrder from "src/hooks/useOrder";
import syncExpenditure from "src/hooks/mutation/syncExpenditure";
import { successToast } from "src/utils/toast";
import { useNavigateParams } from "src/hooks/useCustomNavigate";
import deleteExpenditureMutation from "src/hooks/mutation/deleteExpenditure";
import useToken from "src/hooks/useToken";

const column = [
  { name: "#" },
  { name: "Наименование" },
  { name: "Количество" },
  { name: "Примичание" },
  { name: "Дата" },
  { name: "Автор" },
  { name: "" },
];

const AddProduct: FC<PropsWithChildren> = ({ children }) => {
  const { id } = useParams();

  const navigate = useNavigateParams();
  const { data: me } = useToken({});
  //@ts-ignore
  const iikoBtn = me!.permissions.ismanager || me?.permissions === "*";

  const { mutate } = syncExpenditure();
  const { mutate: deleteExp } = deleteExpenditureMutation();

  const { data: products, refetch } = useOrder({
    id: Number(id),
    enabled: false,
  });

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

  const handleModal = () => {
    navigate({ add_product_modal: true });
  };

  return (
    <Card>
      <Header title="Товары">
        {iikoBtn && (
          <button
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
        <button
          className="btn btn-success btn-fill btn-sm"
          onClick={handleModal}
        >
          Добавить
        </button>
      </Header>
      <div className="content">
        <div className="content table-responsive table-full-width overflow-hidden">
          <table className="table table-hover">
            <thead>
              <tr>
                {column.map(({ name }) => {
                  return (
                    <th className={styles.tableHead} key={name}>
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
                  <td>{item.tool.name}</td>
                  <td>{item.amount}</td>
                  <td>{"item.comment"}</td>
                  <td>
                    {/* {dayjs(order?.time_created).format("DD-MM-YYYY HH:mm")} */}
                    -----
                  </td>
                  <td>{"item.author.name"}</td>
                  <td width={50}>
                    <div
                      className="d-flex justify-content-center pointer"
                      onClick={handleDelete(item.id)}
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

export default AddProduct;
