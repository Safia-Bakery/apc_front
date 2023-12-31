import { Departments, Order, Sphere } from "@/utils/types";
import useStatsBrigadaCateg from "@/hooks/useStatsBrigadaCateg";
import { FC, useEffect, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";

const column = [
  { name: "№", key: "id" as keyof Order["id"] },
  { name: "Бригада", key: "purchaser" as keyof Order["status"] },
  { name: "Категория", key: "category" as keyof Order["status"] },
  {
    name: "Кол-во",
    key: "qnt" as keyof Order["status"],
  },
  {
    name: "Среднее обработка заявков (мин)",
    key: "duration" as keyof Order["status"],
  },
];
interface Props {
  sphere_status: Sphere;
}

const BrigadaCategStat: FC<Props> = ({ sphere_status }) => {
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "статистика бригады по категориям",
    sheet: "categories",
  });

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("brigada_categ_stat")?.click();
      });
  }, [btnAction]);

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

  return (
    <>
      <table className="table table-bordered w-full border-dark" ref={tableRef}>
        <thead>
          <tr>
            {column.map(({ name, key }) => (
              <th key={key} className={"border-dark"}>
                {name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data &&
            Object.keys(data)?.map((mainKey: string, idx) => (
              <tr key={mainKey} className="bg-blue mb-2 ">
                <td className="border-dark" width="40">
                  {idx + 1}
                </td>

                <td className="border-dark">{mainKey}</td>
                <td className="p-0 border-dark">
                  <div className="flex flex-col">
                    {data?.[mainKey]?.map((categ, idx) => (
                      <span
                        key={idx}
                        className="border-bottom py-2 px-1 border-dark"
                      >
                        {categ[1]}
                      </span>
                    ))}
                    <span className="border-bottom py-2 px-1 text-center font-bold">
                      Общее
                    </span>
                  </div>
                </td>

                <td className="p-0 border-dark">
                  <div className="flex flex-col border-dark">
                    {data[mainKey]?.map((qnt, idx) => (
                      <span
                        key={idx}
                        className="border-bottom text-center py-2 px-1 border-dark"
                      >
                        {qnt[2]}
                      </span>
                    ))}
                    <span className=" py-2 px-1 text-center font-bold ">
                      {calculator(2, data[mainKey])}
                    </span>
                  </div>
                </td>

                <td className="p-0 border-dark">
                  <div className="flex flex-col">
                    {data[mainKey]?.map((timer, idx) => (
                      <span
                        key={idx}
                        className="border-bottom py-2 px-1 text-center border-dark"
                      >
                        {timer[3]}
                      </span>
                    ))}
                    <span className="border-bottom py-2 px-1 text-center font-bold">
                      {calculator(3, data[mainKey])}
                    </span>
                  </div>
                </td>
              </tr>
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
