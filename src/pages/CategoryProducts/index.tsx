import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import useCatProducts from "@/hooks/useCatProducts";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { MainPermissions } from "@/utils/permissions";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import useQueryString from "custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import { CategoryProducts as CategoryProductsTypes } from "@/utils/types";
import EmptyList from "@/components/EmptyList";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "name_in_table", key: "name" },
  { name: "department", key: "department" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const CategoryProducts = () => {
  const { t } = useTranslation();
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
      <Header title={`${t("products")}(${category_name})`}>
        {permission?.has(MainPermissions.edit_categ_it) && (
          <div className="flex gap-2">
            <button
              className="btn btn-success  "
              onClick={handleNavigate(
                `/categories-it/${sphere}/${id}/add-product`
              )}
              id="add_category"
            >
              {t("add")}
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-primary  ">
              {t("back")}
            </button>
          </div>
        )}
      </Header>

      <div className="content">
        <div className="table-responsive ">
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
                    <td>{category?.status ? t("active") : t("not_active")}</td>
                    <td width={40}>
                      {permission?.has(MainPermissions.edit_categ_it) && (
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
