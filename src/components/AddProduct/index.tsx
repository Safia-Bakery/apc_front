import { FC, PropsWithChildren } from "react";
import Card from "../Card";
import Header from "../Header";
import styles from "./index.module.scss";
import { useNavigate, useParams } from "react-router-dom";

import AddProductModal from "../AddProductModal";
import useOrder from "src/hooks/useOrder";
import syncExpenditure from "src/hooks/mutation/syncExpenditure";
import { successToast } from "src/utils/toast";
import { useNavigateParams } from "src/hooks/useCustomNavigate";

const column = [
  { name: "#" },
  { name: "Наименование" },
  { name: "Количество" },
  { name: "Примичание" },
  { name: "Дата" },
  { name: "Автор" },
];

const AddProduct: FC<PropsWithChildren> = ({ children }) => {
  const { id } = useParams();

  const navigate = useNavigateParams();

  const { mutate, isLoading } = syncExpenditure();

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

  const { data: products } = useOrder({
    id: Number(id),
    enabled: false,
  });

  const handleModal = () => {
    navigate({ add_product_modal: true });
  };

  return (
    <Card>
      <Header title="Товары">
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
