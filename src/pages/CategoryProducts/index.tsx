import { useParams } from "react-router-dom";
import useCatProducts from "src/hooks/useCatProducts";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import { MainPermissions } from "src/utils/types";
import { useState } from "react";
import { handleIdx } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useQueryString from "src/hooks/custom/useQueryString";
import { useAppSelector } from "src/store/utils/types";
import { permissionSelector } from "src/store/reducers/sidebar";
import { CategoryProducts as CategoryProductsTypes } from "src/utils/types";

const column = [
  { name: "№", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Отдел", key: "department" },
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const CategoryProducts = () => {
  const { id, product_id } = useParams();
  const { data: products, isLoading } = useCatProducts({
    category_id: Number(id),
  });
  const category_name = useQueryString("category_name");

  const navigate = useNavigate();
  const [sort, $sort] = useState<CategoryProductsTypes[]>();
  const permission = useAppSelector(permissionSelector);
  const handleNavigate = (route: string) => () => navigate(route);

  return (
    <Card>
      <Header title={`Продукты(${category_name})`}>
        {permission?.[MainPermissions.it_add_category_product] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate(`/categories-it/${id}/add-product`)}
            id="add_category"
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="content">
        <div className="table-responsive grid-view">
          <table className="table table-hover">
            <TableHead
              column={column}
              onSort={(data) => $sort(data)}
              data={products}
            />

            {!!products?.length && (
              <tbody>
                {(sort?.length ? sort : products)?.map((category, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{category?.name}</td>
                    <td>some</td>
                    <td>{category?.status ? "Активный" : "Неактивный"}</td>
                    <td width={40}>
                      {permission?.[
                        MainPermissions.it_edit_category_product
                      ] && (
                        <TableViewBtn
                          onClick={handleNavigate(
                            `/categories-it/${id}/edit-product/${category.id}`
                          )}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!products?.length && !isLoading && (
            <div className="w-full">
              <p className="text-center w-full ">Спосок пуст</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CategoryProducts;
