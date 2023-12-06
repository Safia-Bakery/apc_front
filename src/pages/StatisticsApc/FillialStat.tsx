import { FC, useEffect, useRef, useState } from "react";
import { DepartmentStatTypes, Departments, Sphere } from "src/utils/types";
import TableHead from "src/components/TableHead";
import useStatsDepartment from "src/hooks/useStatsDepartment";
import useQueryString from "src/hooks/custom/useQueryString";

import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";

const column = [
  { name: "Филиалы", key: "name" },
  { name: "Количество (шт)", key: "amount" },
];

interface Props {
  sphere_status: Sphere;
}

const BranchStat: FC<Props> = ({ sphere_status }) => {
  const start = useQueryString("start");
  const end = useQueryString("end");
  const [sort, $sort] = useState<DepartmentStatTypes[]>();

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "статистика по филиалам",
    sheet: "categories",
  });

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("branch_stat")?.click();
      });
  }, [btnAction]);

  const downloadAsPdf = () => onDownload();

  const { data, isLoading } = useStatsDepartment({
    department: Departments.apc,
    sphere_status,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  return (
    <>
      <table className="table table-hover" ref={tableRef}>
        <TableHead column={column} onSort={(data) => $sort(data)} data={data} />

        <tbody>
          {(sort?.length ? sort : data)?.map((item, idx) => (
            <tr key={idx} className="bg-blue">
              <td>{item.name}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!data?.length && !isLoading && (
        <div className="w-full">
          <p className="text-center w-full ">Спосок пуст</p>
        </div>
      )}
      <button id={"branch_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default BranchStat;
