import { Fragment, useEffect, useMemo, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import cl from "classnames";
import { useInventoryServiseStats } from "@/hooks/useInventoryServiseStats";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const column = [
  { name: "department" },
  { name: "groups" },
  { name: "receivedd" },
  { name: "handled_on_time", colSpan: 2, className: "!bg-tableSuccess" },
  { name: "not_handled_on_time", colSpan: 2, className: "!bg-tableWarn" },
  { name: "not_handled", colSpan: 2, className: "!bg-tableDanger" },
  { name: "avg_handling_time_mins" },
];

interface Props {
  factory?: boolean;
}

const InventoryServiceStats = ({ factory }: Props) => {
  const { t } = useTranslation();
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("servise_level_stats"),
    sheet: t("service_level"),
  });

  const downloadAsPdf = () => onDownload();

  const { isLoading, data } = useInventoryServiseStats({
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
    factory,
  });
  const renderAvgCalculator = useMemo(() => {
    if (!!data) {
      const mainObj = Object.values(data);
      const totals = mainObj.reduce(
        (acc, curr) => {
          acc.total_req += curr.total_tools;
          acc.on_time_requests += curr.on_time_requests;
          acc.total_on_time_requests_percent += curr.on_time_requests_percent; // per
          acc.not_finishedontime += curr.not_finishedontime;
          acc.total_not_finishedon_time_percent +=
            curr.not_finishedon_time_percent; //per
          acc.not_even_started += curr.not_even_started;
          acc.total_not_started_percent += curr.not_started_percent; //per
          acc.avg_finishing += curr.avg_finishing; //per

          return acc;
        },
        {
          total_req: 0,
          on_time_requests: 0,
          total_on_time_requests_percent: 0,
          not_finishedontime: 0,
          total_not_finishedon_time_percent: 0,
          not_even_started: 0,
          total_not_started_percent: 0,
          avg_finishing: 0,
        }
      );

      return {
        total_req: totals.total_req,
        avg_ontime: (
          totals.total_on_time_requests_percent / mainObj.length
        ).toFixed(2),
        ontime: totals.on_time_requests,
        avg_not_ontime: (
          totals.total_not_finishedon_time_percent / mainObj.length
        ).toFixed(2),
        not_ontime: totals.not_finishedontime,
        avg_not_started: (
          totals.total_not_started_percent / mainObj.length
        ).toFixed(2),
        not_started: totals.not_even_started,
        avg_finishing: (totals.avg_finishing / mainObj.length).toFixed(2),
      };
    }
  }, [data]);

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("service_stat")?.click();
      });
  }, [btnAction]);

  return (
    <>
      <table className="table table-bordered w-full border-dark" ref={tableRef}>
        {!!data ? (
          <>
            <thead>
              <tr className="hover:bg-transparent">
                {column.map(({ name, colSpan, className }) => (
                  <th
                    key={name}
                    className={cl("border-dark", className)}
                    colSpan={colSpan}
                  >
                    {t(name)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-transparent">
                <td rowSpan={Object.values(data!).length}>
                  {factory ? t("inventory_fabric") : t("inventory_retail")}
                </td>
                {[Object.entries(data!)?.[0]]?.map((item) => (
                  <Fragment key={item?.[0]}>
                    <td>{item?.[0]}</td>
                    <td>{item?.[1]?.total_tools}</td>
                    <td className="!bg-tableSuccess">
                      {item?.[1]?.on_time_requests}
                    </td>
                    <td className="!bg-tableSuccess">
                      {item?.[1]?.on_time_requests_percent.toFixed(2)}
                    </td>
                    <td className="!bg-tableWarn">
                      {item?.[1]?.not_finishedontime}
                    </td>
                    <td className="!bg-tableWarn">
                      {item?.[1]?.not_finishedon_time_percent.toFixed(2)}
                    </td>
                    <td className="!bg-tableDanger">
                      {item?.[1]?.not_even_started}
                    </td>
                    <td className="!bg-tableDanger">
                      {item?.[1]?.not_started_percent.toFixed(2)}
                    </td>
                    <td>{item?.[1]?.avg_finishing.toFixed(2)}</td>
                  </Fragment>
                ))}
              </tr>

              {Object.entries(data!)
                ?.splice(1)
                ?.map((item) => (
                  <tr key={item?.[0]} className="hover:bg-transparent">
                    <td>{item?.[0]}</td>
                    <td>{item?.[1]?.total_tools}</td>
                    <td className="!bg-tableSuccess">
                      {item?.[1]?.on_time_requests}
                    </td>
                    <td className="!bg-tableSuccess">
                      {item?.[1]?.on_time_requests_percent.toFixed(2)}
                    </td>
                    <td className="!bg-tableWarn">
                      {item?.[1]?.not_finishedontime}
                    </td>
                    <td className="!bg-tableWarn">
                      {item?.[1]?.not_finishedon_time_percent.toFixed(2)}
                    </td>
                    <td className="!bg-tableDanger">
                      {item?.[1]?.not_even_started}
                    </td>
                    <td className="!bg-tableDanger">
                      {item?.[1]?.not_started_percent.toFixed(2)}
                    </td>
                    <td>{item?.[1]?.avg_finishing.toFixed(2)}</td>
                  </tr>
                ))}
              <tr className="hover:!bg-transparent">
                <th className="text-center" colSpan={2}>
                  {t("total_avg")}:
                </th>
                <td>{renderAvgCalculator?.total_req}</td>
                <td className="!bg-tableSuccess">
                  {renderAvgCalculator?.ontime}
                </td>
                <td className="!bg-tableSuccess">
                  {renderAvgCalculator?.avg_ontime}
                </td>
                <td className="!bg-tableWarn">
                  {renderAvgCalculator?.not_ontime}
                </td>
                <td className="!bg-tableWarn">
                  {renderAvgCalculator?.avg_not_ontime}
                </td>
                <td className="!bg-tableDanger">
                  {renderAvgCalculator?.not_started}
                </td>
                <td className="!bg-tableDanger">
                  {renderAvgCalculator?.avg_not_started}
                </td>
                <td>{renderAvgCalculator?.avg_finishing}</td>
              </tr>
            </tbody>
          </>
        ) : (
          <tbody>
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          </tbody>
        )}
      </table>

      {!Object.keys(data || {}) && !isLoading && <EmptyList />}
      <button id={"service_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default InventoryServiceStats;
