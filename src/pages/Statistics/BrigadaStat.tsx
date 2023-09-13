import { FC, useMemo, useState } from "react";
import { Departments, Sphere } from "src/utils/types";
import TableHead from "src/components/TableHead";
import Chart from "react-apexcharts";

import { ApexOptions } from "apexcharts";
import useStatsBrigada from "src/hooks/useStatsBrigada";
import useQueryString from "src/hooks/useQueryString";
import Loading from "src/components/Loader";

interface Props {
  sphere_status: Sphere;
}

const options = {
  options: {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "по количеству заявкам",
      floating: true,
      offsetY: 380,
      align: "center",
      style: {
        color: "#444",
      },
    },
  },
} as ApexOptions;

const column = [
  { name: "№", key: "" },
  { name: "Бригада", key: "" },
  { name: "Количество заявок", key: "" },
  {
    name: "Среднее обработка заявков (мин)",
    key: "",
  },
];

const BrigadaStat: FC<Props> = ({ sphere_status }) => {
  const start = useQueryString("start");
  const end = useQueryString("end");

  const { isLoading, data } = useStatsBrigada({
    department: Departments.apc,
    sphere_status,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const series = useMemo(() => {
    if (!!data?.length)
      return {
        serie: {
          data: data?.map((item) => item.amount),
        },
        categories: data?.map((item) => item.name),
      };
  }, [data]);
  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
          {isLoading ? (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          ) : (
            data?.map((brigada, idx) => (
              <tr key={idx} className="bg-blue">
                <td width="40">{idx + 1}</td>
                <td>{brigada.name}</td>
                <td>{brigada.amount}</td>
                <td>{idx * 3} </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {series?.serie && (
        <Chart
          options={{ ...options, xaxis: { categories: series.categories } }}
          series={[series.serie]}
          type="bar"
          // width={380}
          height={400}
        />
      )}
      {!data?.length && (
        <div className="w-100">
          <p className="text-center w-100 ">Спосок пуст</p>
        </div>
      )}
    </>
  );
};

export default BrigadaStat;
