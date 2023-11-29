import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Departments, Sphere } from "src/utils/types";
import TableHead from "src/components/TableHead";
import Chart from "react-apexcharts";

import { ApexOptions } from "apexcharts";
import useStatsBrigada from "src/hooks/useStatsBrigada";
import useQueryString from "src/hooks/custom/useQueryString";
import Loading from "src/components/Loader";
import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";

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

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "статистика по бригадам",
    sheet: "categories",
  });

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("brigada_stat")?.click();
      });
  }, [btnAction]);

  const downloadAsPdf = () => onDownload();

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
  if (isLoading) return <Loading />;
  return (
    <>
      <table ref={tableRef} className="table table-hover">
        <TableHead
          column={column}
          sort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />

        <tbody>
          {data?.map((brigada, idx) => (
            <tr key={idx} className="bg-blue">
              <td width="40">{idx + 1}</td>
              <td>{brigada.name}</td>
              <td>{brigada.amount}</td>
              <td>{idx * 3} </td>
            </tr>
          ))}
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
      {!data?.length && !isLoading && (
        <div className="w-full">
          <p className="text-center w-full ">Спосок пуст</p>
        </div>
      )}
      <button id={"brigada_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default BrigadaStat;
