import {
  Departments,
  ServiceStatsType,
  ServiceStatsTypes,
} from "@/utils/types";
import { Fragment, useEffect, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import cl from "classnames";
import useServiceMarkStats from "@/hooks/useServiceMarkStats";
import { handleDepartment, numberWithCommas as fixedN } from "@/utils/helpers";

const column = [
  { name: "№" },
  { name: "Отдел" },
  { name: "Категория" },
  { name: "Поступило" },
  { name: "Обработанных во время", colSpan: 2, className: "!bg-tableSuccess" },
  { name: "Обработанных не во время", colSpan: 2, className: "!bg-tableWarn" },
  { name: "Не обработано", colSpan: 2, className: "!bg-tableDanger" },
  { name: "Среднее время обработки (минут)" },
];

const ServiceStats = () => {
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "статистика по уровнем сервиса",
    sheet: "уровень сервиса",
  });

  const downloadAsPdf = () => onDownload();

  const { isLoading, data } = useServiceMarkStats({
    department: Departments.marketing,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const calculator = (idx: any, key: keyof ServiceStatsType) => {
    const sumWithInitial = data?.[idx]?.reduce(
      (accumulator, currentValue) => accumulator + +currentValue[key],
      0
    );

    if (sumWithInitial) return sumWithInitial;
    else return 0;
  };
  const averageCalculator = (idx: any, key: keyof ServiceStatsType) => {
    const sumWithInitial = data?.[idx]?.reduce(
      (accumulator, currentValue) => accumulator + +currentValue[key],
      0
    );

    if (sumWithInitial)
      return +(sumWithInitial / (data?.[idx]?.length || 0)).toFixed(2);
    else return 0;
  };

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("service_stat")?.click();
      });
  }, [btnAction]);

  return (
    <>
      <table className="table table-bordered w-full border-dark" ref={tableRef}>
        <thead>
          <tr className="hover:bg-transparent">
            {column.map(({ name, colSpan, className }) => (
              <th
                key={name}
                className={cl("border-dark", className)}
                colSpan={colSpan}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!!data &&
            Object.entries(data).map((mainKey, idx) => (
              <Fragment key={idx}>
                <tr className="hover:bg-transparent">
                  <td rowSpan={mainKey[1].length + 1}>{idx + 1}</td>
                  <td rowSpan={mainKey[1].length + 1}>
                    {handleDepartment({ sub: +mainKey[0] })}
                  </td>

                  <td>{mainKey[1][0].category}</td>
                  <td className="text-center">
                    {mainKey[1][0].total_requests}
                  </td>

                  <td className="text-center !bg-tableSuccess">
                    {mainKey[1][0].finished_on_time}
                  </td>
                  <td className="text-center !bg-tableSuccess">
                    {fixedN(mainKey[1][0].percentage_finished_on_time)}%
                  </td>
                  <td className="text-center !bg-tableWarn">
                    {mainKey[1][0].not_finished_on_time}
                  </td>
                  <td className="text-center !bg-tableWarn">
                    {fixedN(mainKey[1][0].percentage_not_finished_on_time)}%
                  </td>
                  <td className="text-center !bg-tableDanger">
                    {mainKey[1][0].status_zero}
                  </td>
                  <td className="text-center !bg-tableDanger">
                    {fixedN(mainKey[1][0].percentage_status_zero)}%
                  </td>
                  <td className="text-center">{mainKey[1][0].avg_finishing}</td>
                </tr>
                {mainKey[1]
                  ?.slice(1)
                  .map((item: ServiceStatsType, index: number) => (
                    <Fragment key={index}>
                      <tr className="hover:bg-transparent">
                        <td>{item.category}</td>
                        <td className="text-center">{item.total_requests}</td>

                        <td className="text-center !bg-tableSuccess">
                          {item.finished_on_time}
                        </td>
                        <td className="text-center !bg-tableSuccess">
                          {fixedN(item.percentage_finished_on_time)}%
                        </td>

                        <td className="text-center !bg-tableWarn">
                          {item.not_finished_on_time}
                        </td>
                        <td className="text-center !bg-tableWarn">
                          {fixedN(item.percentage_not_finished_on_time)}%
                        </td>

                        <td className="text-center !bg-tableDanger">
                          {item.status_zero}
                        </td>
                        <td className="text-center !bg-tableDanger">
                          {fixedN(item.percentage_status_zero)}%
                        </td>

                        <td className="text-center">{item.avg_finishing}</td>
                      </tr>
                    </Fragment>
                  ))}
                <tr className="hover:bg-transparent">
                  <th className="text-center text-lg">Общее / Среднее(%):</th>
                  <th className="text-center text-lg">
                    {calculator(mainKey[0], "total_requests")}
                  </th>
                  <th className="text-center text-lg !bg-tableSuccess">
                    {calculator(mainKey[0], "finished_on_time")}
                  </th>
                  <th className="!bg-tableSuccess text-center">
                    {averageCalculator(
                      mainKey[0],
                      "percentage_finished_on_time"
                    )}
                    %
                  </th>
                  <th className="!bg-tableWarn text-center">
                    {calculator(mainKey[0], "not_finished_on_time")}
                  </th>
                  <th className="!bg-tableWarn text-center">
                    {averageCalculator(
                      mainKey[0],
                      "percentage_not_finished_on_time"
                    )}
                    %
                  </th>
                  <th className="!bg-tableDanger text-center">
                    {calculator(mainKey[0], "status_zero")}
                  </th>
                  <th className="!bg-tableDanger text-center">
                    {averageCalculator(mainKey[0], "percentage_status_zero")}%
                  </th>
                  <th className="text-center">
                    {averageCalculator(mainKey[0], "avg_finishing")} (
                    {(
                      averageCalculator(mainKey[0], "avg_finishing") / 60
                    ).toFixed(2)}
                    часов)
                  </th>
                </tr>
              </Fragment>
            ))}
        </tbody>
      </table>

      {!data && !isLoading && <EmptyList />}
      <button id={"service_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default ServiceStats;