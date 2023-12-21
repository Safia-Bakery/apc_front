import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import useCatProducts from "src/hooks/useCatProducts";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { MainPermissions } from "src/utils/types";
import { handleIdx } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useQueryString from "src/hooks/custom/useQueryString";
import { useAppSelector } from "src/store/utils/types";
import { permissionSelector } from "src/store/reducers/sidebar";
import { CategoryProducts as CategoryProductsTypes } from "src/utils/types";
import EmptyList from "src/components/EmptyList";

const column = [
  { name: "№", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Отдел", key: "department" },
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const CategoryProducts = () => {
  const { id, sphere } = useParams();
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
        {permission?.[MainPermissions.edit_categ_it] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate(
              `/categories-it/${sphere}/${id}/add-product`
            )}
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
                      {permission?.[MainPermissions.edit_categ_it] && (
                        <TableViewBtn
                          onClick={handleNavigate(
                            `/categories-it/${sphere}/${id}/edit-product/${category.id}`
                          )}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!products?.length && !isLoading && <EmptyList />}
        </div>
      </div>
    </Card>
  );
};

export default CategoryProducts;
