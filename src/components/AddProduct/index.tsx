import { FC, PropsWithChildren } from "react";
import Card from "../Card";
import Header from "../Header";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/redux/utils/types";
import { itemsSelector } from "src/redux/reducers/usedProducts";

import AddProductModal from "../AddProductModal";

const column = [
  { name: "#" },
  { name: "Наименование" },
  { name: "Количество" },
  { name: "Примичание" },
  { name: "Дата" },
  { name: "Автор" },
];

const AddProduct: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const products = useAppSelector(itemsSelector);

  const handleModal = () => {
    navigate("?add_product_modal=true");
  };
  return (
    <Card>
      <Header title="Товары">
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
              {products?.map((item, idx) => (
                <tr className="bg-blue" key={idx}>
                  <td width="40">{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.count}</td>
                  <td>{item.comment}</td>
                  <td>
                    {/* {dayjs(order?.time_created).format("DD-MM-YYYY HH:mm")} */}
                    -----
                  </td>
                  <td>{item.author.name}</td>
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
