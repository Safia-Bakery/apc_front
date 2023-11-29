import { useEffect, useRef, useState } from "react";
import TableHead from "src/components/TableHead";
import Loading from "src/components/Loader";
import useDistinct from "src/hooks/useDistinct";
import { Link } from "react-router-dom";
import { useDownloadExcel } from "react-export-table-to-excel";
import { Departments, Sphere } from "src/utils/types";
import useQueryString from "src/hooks/custom/useQueryString";

const column = [
  { name: "№", key: "" },
  { name: "Материал", key: "name" },
  { name: "Количество (шт)", key: "amount" },
];
interface Props {
  sphere_status: Sphere;
}

const ConsumptionStat = ({ sphere_status }: Props) => {
  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const start = useQueryString("start");
  const end = useQueryString("end");

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "статистика по расходам",
    sheet: "categories",
  });

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("consumption_stat")?.click();
      });
  }, [btnAction]);

  const downloadAsPdf = () => onDownload();

  const { data, isLoading } = useDistinct({
    department: Departments.apc,
    sphere_status,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <table className="table table-hover" ref={tableRef}>
        <TableHead
          column={column}
          sort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />

        <tbody>
          {data?.tests?.map((item, idx) => (
            <tr key={idx} className="bg-blue">
              <td width="50">{idx + 1}</td>

              <td>
                <Link to={item?.id.toString()}>{item?.name}</Link>
              </td>
              <td>{item?.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!data?.tests?.length && !isLoading && (
        <div className="w-full">
          <p className="text-center w-full ">Спосок пуст</p>
        </div>
      )}
      <button
        id={"consumption_stat"}
        className="hidden"
        onClick={downloadAsPdf}
      >
        download
      </button>
    </>
  );
};

export default ConsumptionStat;
