import { useEffect, useRef, useState } from "react";
import TableHead from "@/components/TableHead";
import useDistinct from "@/hooks/useDistinct";
import { Link } from "react-router-dom";
import { useDownloadExcel } from "react-export-table-to-excel";
import { Departments, Sphere } from "@/utils/types";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";

interface ItemType {
  amount: number;
  name: string;
  id: number;
  price: number;
}

const column = [
  { name: "№", key: "" },
  { name: "Материал", key: "name" },
  { name: "Количество (шт)", key: "amount" },
  { name: "Сумма", key: "total" },
];
interface Props {
  sphere_status: Sphere;
}

const ConsumptionStat = ({ sphere_status }: Props) => {
  const [sort, $sort] = useState<ItemType[]>();

  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");

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

  return (
    <>
      <table className="table table-hover" ref={tableRef}>
        <TableHead
          column={column}
          onSort={(data) => $sort(data)}
          data={data?.tests}
        />

        <tbody>
          {(sort?.length ? sort : data?.tests)?.map((item, idx) => (
            <tr key={idx} className="bg-blue">
              <td width="50">{idx + 1}</td>

              <td>
                <Link to={item?.id.toString()}>{item?.name}</Link>
              </td>
              <td>{item?.amount} </td>
              {item.price && <td>{item?.amount * item?.price} </td>}
            </tr>
          ))}
        </tbody>
      </table>

      {!data?.tests?.length && !isLoading && <EmptyList />}
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
