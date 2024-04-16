import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Departments, Sphere } from "@/utils/types";
import TableHead from "@/components/TableHead";
import Chart from "react-apexcharts";
import useStatsCategory from "@/hooks/useStatsCategory";
import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import { useTranslation } from "react-i18next";
import Loading from "@/components/Loader";

interface SortTypes {
  category: string;
  amount: number;
  time: number;
}

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
  { name: "category", key: "category" },
  { name: "quantity", key: "amount" },
  {
    name: "handling_time_m_av",
    key: "time",
  },
];

const CategoryStat: FC<Props> = ({ sphere_status }) => {
  const { t } = useTranslation();
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");
  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");
  const [sort, $sort] = useState<SortTypes[]>();

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("stats_by_categ"),
    sheet: t("stats_by_categ"),
  });

  const { data, isLoading } = useStatsCategory({
    department: Departments.APC,
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
  const renderAvarage = useMemo(() => {
    if (!!data?.table.length) {
      const totals = data?.table?.reduce(
        (acc, item) => {
          acc.totalAmount += item.amount;
          acc.totalTime += item.time;
          return acc;
        },
        { totalAmount: 0, totalTime: 0 }
      );

      return totals;
    }
  }, [data?.table]);

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
          onSort={(data) => $sort(data)}
          data={data?.table}
        />

        <tbody>
          {(sort?.length ? sort : data?.table)?.map((item, idx) => (
            <tr key={idx} className="bg-blue">
              <td width="40">{idx + 1}</td>
              <td>{item?.category}</td>
              <td>{item?.amount}</td>
              <td>{item?.time}</td>
            </tr>
          ))}
          {renderAvarage?.totalTime && renderAvarage?.totalAmount && (
            <>
              <tr>
                <td></td>
                <th className="text-2xl">{t("in_total")}: </th>
                <td className="text-2xl">{renderAvarage?.totalAmount} шт</td>
                <td className="text-2xl">
                  {renderAvarage?.totalTime} м (
                  {(renderAvarage?.totalTime / 60).toFixed(3)} {t("hours")})
                </td>
              </tr>
              <tr>
                <td></td>
                <th className="text-2xl">В среднем:</th>
                <td colSpan={2} className="text-2xl">
                  {(renderAvarage?.totalTime / data?.table.length!).toFixed(3)}{" "}
                  минут (
                  {(
                    renderAvarage?.totalTime /
                    data?.table.length! /
                    60
                  ).toFixed(3)}{" "}
                  {t("hours")})
                </td>
              </tr>
            </>
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
      {!data?.table.length && !isLoading && <EmptyList />}
      <button id={"category_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>

      {isLoading && <Loading />}
    </>
  );
};

export default CategoryStat;
