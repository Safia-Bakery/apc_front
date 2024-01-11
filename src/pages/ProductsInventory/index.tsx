import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Departments, MainPermissions, ToolTypes } from "@/utils/types";
import Pagination from "@/components/Pagination";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import InventoryFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import TableLoading from "@/components/TableLoading";
import EmptyList from "@/components/EmptyList";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import TableViewBtn from "@/components/TableViewBtn";
import useTools from "@/hooks/useTools";

const column = [
  { name: "№", key: "" },
  { name: "Наименование", key: "name" },
  { name: "", key: "" },
];

const ProductsInventory = () => {
  const navigate = useNavigate();
  const [sort, $sort] = useState<ToolTypes["items"]>();
  const page = Number(useQueryString("page")) || 1;
  const name = useQueryString("name");
  const permission = useAppSelector(permissionSelector);
  const handleNavigate = (route: string) => () => navigate(route);

  const { data: requests, isLoading: orderLoading } = useTools({
    department: Departments.inventory,
    page,
    name,
  });

  return (
    <Card>
      <Header title="Продукты Инвентарь" />

      <div className="table-responsive grid-view content">
        <ItemsCount data={requests} />
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            <InventoryFilter />
          </TableHead>

          <tbody>
            {!!requests?.items?.length &&
              (sort?.length ? sort : requests?.items)?.map((order, idx) => (
                <tr key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td>{order?.name}</td>
                  <td width={40}>
                    {permission?.[MainPermissions.edit_product_inventory] && (
                      <TableViewBtn onClick={handleNavigate(`${order.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
            {orderLoading && <TableLoading />}
          </tbody>
        </table>
        {!!requests && <Pagination totalPages={requests.pages} />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default ProductsInventory;
