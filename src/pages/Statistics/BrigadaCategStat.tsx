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
  { name: "№", key: "id" as keyof Order["id"] },
  { name: "Бригада", key: "purchaser" as keyof Order["status"] },
  { name: "Категория", key: "status" as keyof Order["status"] },
  {
    name: "Кол-во",
    key: "status" as keyof Order["status"],
  },
  {
    name: "Среднее обработка заявков (мин)",
    key: "status" as keyof Order["status"],
  },
];

const BrigadaCategStat = () => {
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
      <table className="table table-bordered w-100">
        <thead>
          <tr>
            {column.map(({ name, key }) => (
              <th key={key} className={styles.tableHead}>
                {name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* {[...Array(6)]?.map((order, idx) => ( */}
          <tr className="bg-blue">
            <td width="40" className="border-left border-right">
              1
            </td>

            <td className="border-left border-right">
              <tr>Арс-Команда №1 (01|536 REA)</tr>
            </td>
            <td className="p-0 text-center">
              {[...Array(6)]?.map((order, idx) => (
                <tr
                  style={{ width: "100%" }}
                  className="border-bottom text-center m-auto"
                >
                  <td className="border-0">test name BrigadaCategStat</td>
                </tr>
              ))}
            </td>
            <td className="p-0">
              {[...Array(6)]?.map((order, idx) => (
                <div className="border-bottom">
                  <td className="border-top-0">{(idx + 1) * 2}</td>
                </div>
              ))}
            </td>
            <td className="p-0">
              {[...Array(6)]?.map((order, idx) => (
                <div className="border-bottom">
                  <td className="border-top-0">{(idx + 1) * 4}</td>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      <Chart
        options={options}
        series={series}
        type="pie"
        // width={380}
        height={400}
      />
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

export default BrigadaCategStat;
