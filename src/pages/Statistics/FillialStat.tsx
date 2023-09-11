import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { Order } from "src/utils/types";
import TableHead from "src/components/TableHead";
import useOrders from "src/hooks/useOrders";
import { itemsPerPage } from "src/utils/helpers";
import Pagination from "src/components/Pagination";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import ItemsCount from "src/components/ItemsCount";
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
  { name: "fillials", key: "id" },
  { name: "Qnt", key: "purchaser" },
];

const FillialStat = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: requests } = useOrders({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });

  console.log("fillials");

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
              <td>fillial name</td>
              <td>qnt{idx * 2}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <Chart
        options={options}
        series={series}
        type="pie"
        // width={380}
        height={400}
      /> */}
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

export default FillialStat;
