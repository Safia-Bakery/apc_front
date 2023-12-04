import { useMemo, useRef, useState } from "react";
import TableHead from "src/components/TableHead";
import Chart from "react-apexcharts";
import useQueryString from "src/hooks/custom/useQueryString";
import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";
import useUpdateEffect from "src/hooks/useUpdateEffect";
import useMarketingStatCat from "src/hooks/useMarketingStatCat";
import { ApexOptions } from "apexcharts";

const optionsBar = {
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
      text: "Процент выполнения",
      floating: true,
      offsetY: 380,
      align: "center",
      style: {
        color: "#444",
      },
    },
  },
} as ApexOptions;

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
  { name: "Количество поступивших заявок", key: "amount" },
  {
    name: "Количество выполненных заявок",
    key: "time",
  },
  {
    name: "Процент выполнения",
    key: "time",
  },
];

const StatCategory = () => {
  const start = useQueryString("start");
  const end = useQueryString("end");
  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Отчёт по категориям",
    sheet: "categories",
  });
  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading } = useMarketingStatCat({
    ...(!!start && { created_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const series = useMemo(() => {
    if (data?.pie)
      return {
        serie: Object.keys(data?.pie).map((item) =>
          Math.round(data.pie[item][1])
        ),
        labels: Object.keys(data?.pie).map((item) => item),
      };
  }, [data?.pie]);

  const bar = useMemo(() => {
    if (data?.tables)
      return {
        serie: {
          data: Object.keys(data?.tables).map((item) =>
            Math.round(data.tables[item][2])
          ),
        },
        categories: Object.keys(data?.tables).map((item) => item),
      };
  }, [data?.tables]);

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  useUpdateEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("department_stat")?.click();
      });
  }, [btnAction]);

  const downloadAsPdf = () => onDownload();

  const renderTable = useMemo(() => {
    if (data?.tables)
      return Object.entries(data?.tables)?.map((item, idx) => (
        <tr key={idx} className="bg-blue hover:bg-mainGray">
          <td width="40">{idx + 1}</td>
          <td>{item[0]}</td>
          <td>{item[1][0]}</td>
          <td>{item[1][1]}</td>
          <td>{item[1][2]}</td>
        </tr>
      ));
  }, [data?.tables]);

  const renderPie = useMemo(() => {
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

  const renderBar = useMemo(() => {
    if (!!bar?.categories?.length && !!bar?.serie)
      return (
        <Chart
          options={{ ...optionsBar, xaxis: { categories: bar.categories } }}
          series={[bar.serie]}
          type="bar"
          // width={380}
          height={400}
        />
      );
  }, [bar]);

  return (
    <>
      <table className="table hover table-bordered " ref={tableRef}>
        <TableHead
          column={column}
          sort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />

        <tbody>{renderTable}</tbody>
      </table>
      {renderPie}
      {renderBar}
      {data?.tables && !Object.values(data?.tables).length && !isLoading && (
        <div className="w-full">
          <p className="text-center w-full">Спосок пуст</p>
        </div>
      )}
      <button id={"department_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default StatCategory;
