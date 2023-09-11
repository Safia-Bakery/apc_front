import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Order } from "src/utils/types";
import TableHead from "src/components/TableHead";
import useOrders from "src/hooks/useOrders";
import { itemsPerPage } from "src/utils/helpers";
import Pagination from "src/components/Pagination";
import Chart from "react-apexcharts";

const options = {
  chart: {
    type: "pie",
  } as ApexChart,
  labels: [
    "Category A",
    "Category B",
    "Category C",
    "Category D",
    "Category E",
  ],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

const series = [44, 55, 13, 43, 55];
const column = [
  { name: "№", key: "id" as keyof Order["id"] },
  { name: "category", key: "purchaser" as keyof Order["status"] },
  { name: "Qnt", key: "status" as keyof Order["status"] },
  {
    name: "Время обработки ",
    key: "status" as keyof Order["status"],
  },
];

const CategoryStat = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: requests } = useOrders({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });
  const { pathname } = useLocation();
  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const handleNavigate = (route: string) => () => navigate(route);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <table className="table table-hover">
        <TableHead
          column={column}
          sort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />

        <tbody>
          {[...Array(6)]?.map((order, idx) => (
            <tr key={idx} className="bg-blue">
              <td width="40">1</td>
              <td>test name</td>
              <td>Активный</td>
              <td>Активный</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Chart options={options} series={series} type="pie" height={400} />
      {!!requests && (
        <Pagination
          totalItems={requests?.total}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {!requests?.items?.length && (
        <div className="w-100">
          <p className="text-center w-100 ">Спосок пуст</p>
        </div>
      )}
    </>
  );
};

export default CategoryStat;
