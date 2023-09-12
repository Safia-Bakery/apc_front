import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Departments, Order, Sphere } from "src/utils/types";
import TableHead from "src/components/TableHead";
import useOrders from "src/hooks/useOrders";
import { itemsPerPage } from "src/utils/helpers";
import Pagination from "src/components/Pagination";
import Chart from "react-apexcharts";
import useStatsCategory from "src/hooks/useStatsCategory";
import Loading from "src/components/Loader";
import useQueryString from "src/hooks/useQueryString";

const options = {
  chart: {
    type: "pie",
  } as ApexChart,
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

const column = [
  { name: "№", key: "id" },
  { name: "Категория", key: "category" },
  { name: "Количество (шт)", key: "amount" },
  {
    name: "Время обработки (м)",
    key: "time",
  },
];

const CategoryStat = () => {
  const start = useQueryString("start");
  const end = useQueryString("end");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const handlePageChange = (page: number) => setCurrentPage(page);

  const { data, isLoading } = useStatsCategory({
    department: Departments.apc,
    sphere_status: Sphere.retail,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const series = useMemo(() => {
    return {
      serie: data?.piechart.map((item) => Math.round(item.percentage)),
      labels: data?.piechart.map((item) => item.category_name),
    };
  }, [data?.piechart]);

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
      <table className="table table-hover table-bordered">
        <TableHead
          column={column}
          sort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />

        <tbody>
          {isLoading ? (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          ) : (
            data?.table?.map((item, idx) => (
              <tr key={idx} className="bg-blue">
                <td width="40">{idx + 1}</td>
                <td>{item?.category}</td>
                <td>{item?.amount}</td>
                <td>{item?.time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!!series?.labels && !!series?.serie?.length && (
        <Chart
          options={{ ...options, labels: series.labels }}
          series={series.serie}
          type="pie"
          height={400}
        />
      )}
      {!data?.table.length && (
        <div className="w-100">
          <p className="text-center w-100">Спосок пуст</p>
        </div>
      )}
    </>
  );
};

export default CategoryStat;
