import { useEffect, useMemo, useRef } from "react";
import { MarketingSubDep } from "@/utils/types";
import TableHead from "@/components/TableHead";
import Chart from "react-apexcharts";
import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";
import useMarketingStatDep from "@/hooks/useMarketingStatDep";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import { useTranslation } from "react-i18next";

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
  { name: "direction", key: "category" },
  { name: "open_req_qnt", key: "amount" },
  { name: "closed_req_qnt", key: "amount" },
  {
    name: "handling_time_h",
    key: "time",
  },
];

const DepartmentStat = () => {
  const { t } = useTranslation();
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");
  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("departments_reports"),
    sheet: t("departments"),
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
        labels: Object.keys(data?.pie).map((item) => t(MarketingSubDep[+item])),
      };
  }, [data?.pie]);

  useEffect(() => {
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
          <td>{t(MarketingSubDep[+item[0]])}</td>
          {/* insert open date */}
          <td>{item[1][2]}</td>
          <td>{item[1][0]}</td>
          <td>{item[1][1] || 0}</td>
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
