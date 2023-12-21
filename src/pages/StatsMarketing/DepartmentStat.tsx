import { useMemo, useRef } from "react";
import { MarketingSubDep } from "src/utils/types";
import TableHead from "src/components/TableHead";
import Chart from "react-apexcharts";
import useQueryString from "src/hooks/custom/useQueryString";
import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";
import useMarketingStatDep from "src/hooks/useMarketingStatDep";
import { handleDepartment } from "src/utils/helpers";
import useUpdateEffect from "src/hooks/useUpdateEffect";
import EmptyList from "src/components/EmptyList";

const options = {
  chart: {
    type: "pie",
  } as ApexChart,
  legend: {
    fontSize: "22px",
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "20px",
      fontFamily: "Helvetica, Arial, sans-serif",
      fontWeight: "bold",
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
          font: 20,
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
  { name: "Направления", key: "category" },
  { name: "Количество закрытых заявок", key: "amount" },
  {
    name: "Время обработки (ч)",
    key: "time",
  },
];

const DepartmentStat = () => {
  const start = useQueryString("start");
  const end = useQueryString("end");
  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Отчёт по отделам",
    sheet: "departments",
  });

  const { data, isLoading } = useMarketingStatDep({
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const series = useMemo(() => {
    if (data?.pie)
      return {
        serie: Object.keys(data?.pie).map((item) =>
          Math.round(data.pie[item][1])
        ),
        labels: Object.keys(data?.pie).map((item) =>
          handleDepartment({ sub: +item as unknown as MarketingSubDep })
        ),
      };
  }, [data?.pie]);

  useUpdateEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("department_stat")?.click();
      });
  }, [btnAction]);

  const downloadAsPdf = () => onDownload();

  const renderTable = useMemo(() => {
    if (data?.table)
      return Object.entries(data?.table)?.map((item, idx) => (
        <tr key={idx} className="bg-blue">
          <td width="40">{idx + 1}</td>
          <td>
            {handleDepartment({
              sub: +item[0] as unknown as MarketingSubDep,
            })}
          </td>
          <td>{item[1][0]}</td>
          <td>{item[1][1]}</td>
        </tr>
      ));
  }, [data?.table]);

  const renderChart = useMemo(() => {
    if (!!series?.labels && !!series?.serie?.length)
      return (
        <Chart
          options={{ ...options, labels: series.labels as string[] }}
          series={series.serie}
          type="pie"
          height={400}
        />
      );
  }, [series]);

  return (
    <>
      <table className="table table-hover table-bordered" ref={tableRef}>
        <TableHead column={column} />

        <tbody>{renderTable}</tbody>
      </table>
      {renderChart}
      {data?.table && !Object.values(data?.table).length && !isLoading && (
        <EmptyList />
      )}
      <button id={"department_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default DepartmentStat;
