import { ServiceStatsType, Sphere } from "@/utils/types";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import cl from "classnames";

import { numberWithCommas as fixedN } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import useApcServiceStats from "@/hooks/useApcServiceStats";
import Loading from "@/components/Loader";
import { Link } from "react-router-dom";
import { yearMonthDate } from "@/utils/keys";
import dayjs from "dayjs";
import { ExportOutlined } from "@ant-design/icons";
import useQueryString from "@/hooks/custom/useQueryString";
import { Flex } from "antd";

const column = [
  { name: "№" },
  { name: "department" },
  { name: "category" },
  { name: "receivedd" },
  { name: "handled_on_time", colSpan: 2, className: "!bg-tableSuccess" },
  { name: "not_handled_on_time", colSpan: 2, className: "!bg-tableWarn" },
  { name: "not_handled_in_process", colSpan: 2, className: "!bg-tableDanger" },
  { name: "avg_handling_time_days_hours" },
];

interface Props {
  sphere?: Sphere;
}

const ServiceStatsApc = ({ sphere }: Props) => {
  const { t } = useTranslation();
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");
  const request_ids = useQueryString("request_ids");

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("servise_level_stats"),
    sheet: t("service_level"),
  });

  const downloadAsPdf = () => onDownload();

  const { isLoading, data } = useApcServiceStats({
    sphere_status: sphere,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const renderUrl = useMemo(() => {
    return `service_filter=1&started_at=${
      !start ? dayjs().startOf("month").format(yearMonthDate) : start
    }&finished_at=${!end ? dayjs().format(yearMonthDate) : end}`;
  }, [data, end, start]);

  const renderTotal = useMemo(() => {
    let total_requests = 0;
    let finished_on_time = 0;
    let not_finished_on_time = 0;
    let status_zero = 0;
    // Iterate over each key in the object
    for (const key in data) {
      // Check if the key has an array with items
      if (Array.isArray(data[key]) && data[key].length > 0) {
        // Iterate over the array of objects
        data[key].forEach((item) => {
          // Sum up the total_requests values
          total_requests += item.total_requests;
          finished_on_time += item.finished_on_time;
          not_finished_on_time += item.not_finished_on_time;
          status_zero += item.status_zero;
        });
      }
    }
    return {
      total_requests,
      finished_on_time,
      status_zero,
      not_finished_on_time,
    };
  }, [data]);

  const calculator = (idx: any, key: keyof ServiceStatsType) => {
    const sumWithInitial = data?.[idx]?.reduce(
      (accumulator, currentValue) => accumulator + +currentValue[key],
      0
    );

    return sumWithInitial || 0;
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
                className={cl("border-dark text-center", className)}
                colSpan={colSpan}
              >
                {t(name)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!!data &&
            Object.entries(data).map((mainKey, idx) => (
              <Fragment key={idx}>
                <tr className="hover:bg-transparent">
                  <td rowSpan={!!mainKey[1].length ? mainKey[1].length + 1 : 2}>
                    {idx + 1}
                  </td>
                  <td rowSpan={!!mainKey[1].length ? mainKey[1].length + 1 : 2}>
                    {mainKey[0]}
                  </td>

                  <td>
                    <Link
                      to={`/requests-apc-retail?category_id=${mainKey[1][0]?.category_id}&${renderUrl}`}
                    >
                      {mainKey[1][0]?.category}
                    </Link>
                  </td>
                  <td className="text-center">
                    {mainKey[1][0]?.total_requests}
                  </td>

                  <td className="text-center !bg-tableSuccess">
                    {mainKey[1][0]?.finished_on_time}
                  </td>
                  <td className="text-center !bg-tableSuccess">
                    <Flex justify="space-between" align="center">
                      <p className="flex flex-1 text-center justify-center">
                        {fixedN(mainKey[1][0]?.percentage_finished_on_time)}%
                      </p>
                      {!!mainKey[1][0]?.finished_on_time_requests?.length && (
                        <Link
                          to={`/requests-apc-fabric?request_ids=${mainKey[1][0]?.finished_on_time_requests.join(
                            ","
                          )}`}
                        >
                          <ExportOutlined />
                        </Link>
                      )}
                    </Flex>
                  </td>
                  <td className="text-center !bg-tableWarn">
                    {mainKey[1][0]?.not_finished_on_time}
                  </td>
                  <td className="text-center !bg-tableWarn">
                    <Flex justify="space-between" align="center">
                      <p className="flex flex-1 text-center justify-center">
                        {fixedN(mainKey[1][0]?.percentage_not_finished_on_time)}
                        %
                      </p>

                      {!!mainKey[1][0]?.not_finished_on_time_requests
                        ?.length && (
                        <Link
                          to={`/requests-apc-fabric?request_ids=${mainKey[1][0]?.not_finished_on_time_requests.join(
                            ","
                          )}`}
                        >
                          <ExportOutlined />
                        </Link>
                      )}
                    </Flex>
                  </td>
                  <td className="text-center !bg-tableDanger">
                    {mainKey[1][0]?.status_zero}
                  </td>
                  <td className="text-center !bg-tableDanger">
                    <Flex justify="space-between" align="center">
                      <p className="flex flex-1 text-center justify-center">
                        {fixedN(mainKey[1][0]?.percentage_status_zero)}%
                      </p>

                      {!!mainKey[1][0]?.status_zero_requests?.length && (
                        <Link
                          to={`/requests-apc-fabric?request_ids=${mainKey[1][0]?.status_zero_requests.join(
                            ","
                          )}`}
                        >
                          <ExportOutlined />
                        </Link>
                      )}
                    </Flex>
                  </td>
                  <td className="text-center">
                    {mainKey[1][0]?.avg_finishing}
                  </td>
                </tr>
                {mainKey[1]
                  ?.slice(1)
                  .map((item: ServiceStatsType, index: number) => (
                    <Fragment key={index}>
                      <tr className="hover:bg-transparent">
                        <td>
                          <Link
                            to={`/requests-apc-retail?category_id=${item?.category_id}&${renderUrl}`}
                          >
                            {item.category}
                          </Link>
                        </td>
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

                        <td className="text-center">
                          {(item.avg_finishing / 60).toFixed(2)} ({" "}
                          {(item.avg_finishing / 1440) // 60*24 to get days from minutes
                            .toFixed(2)}
                          {t("days")})
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                <tr className="hover:bg-transparent">
                  <th className="text-center text-lg">{t("total_avg")}:</th>
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
                    {(
                      averageCalculator(mainKey[0], "avg_finishing") / 60
                    ).toFixed(2)}{" "}
                    (
                    {(averageCalculator(mainKey[0], "avg_finishing") / 1440) // 60*24 to get days from minutes
                      .toFixed(2)}
                    {t("days")})
                  </th>
                </tr>
              </Fragment>
            ))}
          {!!renderTotal.total_requests && (
            <tr className="text-center">
              <th colSpan={3} className="text-center">
                Общий:
              </th>
              <td>{renderTotal.total_requests}</td>
              <td>{renderTotal.finished_on_time}</td>
              <td>
                {(
                  (renderTotal.finished_on_time * 100) /
                  renderTotal.total_requests
                ).toFixed(2)}
                %
              </td>
              <td>{renderTotal.not_finished_on_time}</td>
              <td>
                {(
                  (renderTotal.not_finished_on_time * 100) /
                  renderTotal.total_requests
                ).toFixed(2)}
                %
              </td>
              <td>{renderTotal.status_zero}</td>
              <td>
                {(
                  (renderTotal.status_zero * 100) /
                  renderTotal.total_requests
                ).toFixed(2)}
                %
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      {isLoading && <Loading />}
      {!data && !isLoading && <EmptyList />}
      <button id={"service_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default ServiceStatsApc;
