import { Departments, Order, Sphere } from "@/utils/types";
import useStatsBrigadaCateg from "@/hooks/useStatsBrigadaCateg";
import { FC, Fragment, useEffect, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "id" as keyof Order["id"] },
  { name: "brigade", key: "purchaser" as keyof Order["status"] },
  { name: "category", key: "category" as keyof Order["status"] },
  {
    name: "qnt",
    key: "qnt" as keyof Order["status"],
  },
  {
    name: "avg_request_progress",
    key: "duration" as keyof Order["status"],
  },
];
interface Props {
  sphere_status: Sphere;
}

const BrigadaCategStat: FC<Props> = ({ sphere_status }) => {
  const { t } = useTranslation();
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("stats_brigade_categ"),
    sheet: "categories",
  });

  const downloadAsPdf = () => onDownload();

  const { isLoading, data } = useStatsBrigadaCateg({
    department: Departments.apc,
    sphere_status,
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

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("brigada_categ_stat")?.click();
      });
  }, [btnAction]);

  return (
    <>
      <table className="table table-bordered w-full border-dark" ref={tableRef}>
        <thead>
          <tr className="hover:bg-transparent">
            {column.map(({ name, key }) => (
              <th key={key} className={"border-dark"}>
                {t(name)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            Object.entries(data).map((mainKey, idx) => (
              <Fragment key={idx}>
                <tr className="hover:bg-transparent">
                  <td rowSpan={mainKey[1].length + 1}>{idx + 1}</td>
                  <td rowSpan={mainKey[1].length + 1}>{mainKey[0]}</td>

                  <td>{mainKey[1][0][1]}</td>
                  <td className="text-center">{mainKey[1][0][2]}</td>
                  <td className="text-center">{mainKey[1][0][3]}</td>
                </tr>
                {mainKey[1]?.slice(1).map((qnt, index) => (
                  <Fragment key={index}>
                    <tr className="hover:bg-transparent">
                      <td>{qnt[1]}</td>
                      <td className="text-center">{qnt[2]}</td>
                      <td className="text-center">{qnt[3]}</td>
                    </tr>
                  </Fragment>
                ))}
                <tr className="bg-green-400 hover:bg-green-400">
                  <th className="text-center text-lg">{t("total")}</th>
                  <th className="text-center  text-lg">
                    {calculator(2, mainKey[1])}
                  </th>
                  <th className="text-center  text-lg">
                    {calculator(3, mainKey[1])}
                  </th>
                </tr>
              </Fragment>
            ))}
        </tbody>
      </table>

      {!data && !isLoading && <EmptyList />}
      <button
        id={"brigada_categ_stat"}
        className="hidden"
        onClick={downloadAsPdf}
      >
        download
      </button>
    </>
  );
};

export default BrigadaCategStat;
