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
import dayjs from "dayjs";
import { ApexOptions } from "apexcharts";

const options = {
  chart: {
    height: 350,
    type: "bar",
  } as ApexChart,
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: "top", // top, center, bottom
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: any) {
      return val + "%";
    },
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#304758"],
    },
  },

  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    position: "top",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val: any) {
        return val + "%";
      },
    },
  },
  title: {
    text: "Monthly Inflation in Argentina, 2002",
    floating: true,
    offsetY: 380,
    align: "center",
    style: {
      color: "#444",
    },
  },
} as ApexOptions;

const series = [
  {
    name: "sales",
    data: [
      {
        x: "2019/01/01",
        y: 400,
      },
      {
        x: "2019/04/01",
        y: 430,
      },
      {
        x: "2019/07/01",
        y: 448,
      },
      {
        x: "2019/10/01",
        y: 470,
      },
      {
        x: "2020/01/01",
        y: 540,
      },
      {
        x: "2020/04/01",
        y: 580,
      },
      {
        x: "2020/07/01",
        y: 690,
      },
      {
        x: "2020/10/01",
        y: 690,
      },
    ],
  },
];
const column = [
  { name: "№", key: "" },
  { name: "Бригада", key: "" },
  { name: "Количество заявок", key: "" },
  {
    name: "Среднее обработка заявков (мин)",
    key: "",
  },
];

const BrigadaStat = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: requests } = useOrders({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });

  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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
              <td width="40">{idx + 1}</td>
              <td>test name brigada</td>
              <td>{idx * 2}</td>
              <td>{idx * 3} min</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Chart
        options={options}
        series={series}
        type="bar"
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

export default BrigadaStat;
