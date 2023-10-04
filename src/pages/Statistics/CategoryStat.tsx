import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Departments, Sphere } from "src/utils/types";
import TableHead from "src/components/TableHead";
import Chart from "react-apexcharts";
import useStatsCategory from "src/hooks/useStatsCategory";
import Loading from "src/components/Loader";
import useQueryString from "src/hooks/useQueryString";
import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";

interface Props {
  sphere_status: Sphere;
}

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

const CategoryStat: FC<Props> = ({ sphere_status }) => {
  const start = useQueryString("start");
  const end = useQueryString("end");
  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "статистика по категориям",
    sheet: "categories",
  });

  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading } = useStatsCategory({
    department: Departments.apc,
    sphere_status,
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

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("category_stat")?.click();
      });
  }, [btnAction]);

  const downloadAsPdf = () => onDownload();

  return (
    <>
      <table className="table table-hover table-bordered" ref={tableRef}>
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
      {!data?.table.length && !isLoading && (
        <div className="w-100">
          <p className="text-center w-100">Спосок пуст</p>
        </div>
      )}
      <button id={"category_stat"} className="d-none" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default CategoryStat;
