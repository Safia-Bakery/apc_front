import { FC, useEffect, useMemo, useRef, useState } from "react";
import { DepartmentStatTypes, Departments, Sphere } from "@/utils/types";
import TableHead from "@/components/TableHead";
import Chart from "react-apexcharts";
import useStatsBrigada from "@/hooks/useStatsBrigada";
import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import { useTranslation } from "react-i18next";

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
} as any;

const column = [
  { name: "№", key: "" },
  { name: "brigade", key: "" },
  { name: "requests_qnt", key: "" },
  {
    name: "avg_request_progress",
    key: "",
  },
];

const BrigadaStat: FC<Props> = ({ sphere_status }) => {
  const { t } = useTranslation();
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");
  const [sort, $sort] = useState<DepartmentStatTypes[]>();

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("brigade_stats"),
    sheet: t("brigade_stats"),
  });

  const downloadAsPdf = () => onDownload();

  const { isLoading, data } = useStatsBrigada({
    department: Departments.APC,
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

  const renderProductCount = useMemo(() => {
    if (data?.length)
      return data?.reduce((acc, item) => (acc += item.amount || 0), 0);
  }, [data]);

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("brigada_stat")?.click();
      });
  }, [btnAction]);

  return (
    <>
      <table ref={tableRef} className="table table-hover">
        <TableHead onSort={(data) => $sort(data)} data={data} column={column} />

        <tbody>
          {(sort?.length ? sort : data)?.map((brigada, idx) => (
            <tr key={idx} className="bg-blue">
              <td width="40">{idx + 1}</td>
              <td>{brigada.name}</td>
              <td>{brigada.amount}</td>
              <td>{idx * 3} </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <th className="text-lg">{t("in_total")}:</th>
            <th className="text-lg">{renderProductCount}</th>
            <td></td>
          </tr>
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
      {!data?.length && !isLoading && <EmptyList />}
      <button id={"brigada_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default BrigadaStat;
