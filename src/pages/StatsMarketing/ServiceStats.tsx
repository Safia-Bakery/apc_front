import { Departments, Sphere } from "@/utils/types";
import useStatsBrigadaCateg from "@/hooks/useStatsBrigadaCateg";
import { Fragment, useEffect, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import cl from "classnames";

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

  const { isLoading, data } = useStatsBrigadaCateg({
    department: Departments.apc,
    sphere_status: Sphere.retail,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const calculator = (idx: number, arr: any[]) => {
    const sumWithInitial = arr.reduce(
      (accumulator, currentValue) => accumulator + currentValue[idx],
      0
    );

    return sumWithInitial;
  };
  const averageCalculator = (idx: number, arr: any[]) => {
    const sumWithInitial = arr.reduce(
      (accumulator, currentValue) => accumulator + currentValue[idx],
      0
    );

    return (sumWithInitial / arr.length).toFixed(2);
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
          <tr>
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
          {data &&
            Object.entries(data).map((mainKey, idx) => (
              <Fragment key={idx}>
                <tr>
                  <td rowSpan={mainKey[1].length + 1}>{idx + 1}</td>
                  <td rowSpan={mainKey[1].length + 1}>{mainKey[0]}</td>

                  <td>{mainKey[1][0][1]}</td>
                  <td className="text-center">{mainKey[1][0][2]}</td>

                  <td className="text-center !bg-tableSuccess">in time</td>
                  <td className="text-center !bg-tableSuccess">in time</td>
                  <td className="text-center !bg-tableWarn">not in time</td>
                  <td className="text-center !bg-tableWarn">not in time</td>
                  <td className="text-center !bg-tableDanger">unhandled</td>
                  <td className="text-center !bg-tableDanger">unhandled</td>
                  <td className="text-center">average time</td>
                </tr>
                {mainKey[1]?.slice(1).map((qnt, index) => (
                  <Fragment key={index}>
                    <tr>
                      <td>{qnt[1]}</td>
                      <td className="text-center">{qnt[2]}</td>

                      <td className="text-center !bg-tableSuccess">in time</td>
                      <td className="text-center !bg-tableSuccess">in time</td>

                      <td className="text-center !bg-tableWarn">not in time</td>
                      <td className="text-center !bg-tableWarn">not in time</td>

                      <td className="text-center !bg-tableDanger">unhandled</td>
                      <td className="text-center !bg-tableDanger">unhandled</td>

                      <td className="text-center">average</td>
                    </tr>
                  </Fragment>
                ))}
                <tr>
                  <th className="text-center text-lg">Общее / Среднее(%):</th>
                  <th className="text-center text-lg">
                    {averageCalculator(2, mainKey[1])}
                  </th>
                  <th className="text-center text-lg !bg-tableSuccess">
                    {/* {calculator(3, mainKey[1])} */}
                  </th>
                  <th className="!bg-tableSuccess"></th>
                  <th className="!bg-tableWarn"></th>
                  <th className="!bg-tableWarn"></th>
                  <th className="!bg-tableDanger"></th>
                  <th className="!bg-tableDanger"></th>
                  <th></th>
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
