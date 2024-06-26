import { FC, useEffect, useMemo, useRef, useState } from "react";
import { DepartmentStatTypes, Departments, Sphere } from "@/utils/types";
import TableHead from "@/components/TableHead";
import useStatsDepartment from "@/hooks/useStatsDepartment";

import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import { handleIdx } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "branches", key: "name" },
  { name: "quantity", key: "amount" },
];

interface Props {
  sphere_status: Sphere;
}

const BranchStat: FC<Props> = ({ sphere_status }) => {
  const { t } = useTranslation();
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");
  const [sort, $sort] = useState<DepartmentStatTypes[]>();

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("branch_stats"),
    sheet: t("branch_stats"),
  });

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("branch_stat")?.click();
      });
  }, [btnAction]);

  const downloadAsPdf = () => onDownload();

  const { data, isLoading } = useStatsDepartment({
    department: Departments.APC,
    sphere_status,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const renderProductCount = useMemo(() => {
    if (data?.length)
      return data?.reduce((acc, item) => (acc += item.amount || 0), 0);
  }, [data]);

  return (
    <>
      <table className="table table-hover" ref={tableRef}>
        <TableHead column={column} onSort={(data) => $sort(data)} data={data} />

        <tbody>
          {(sort?.length ? sort : data)?.map((item, idx) => (
            <tr key={item.name + idx} className="bg-blue">
              <td width={30}> {handleIdx(idx)}</td>
              <td>{item.name}</td>
              <td>{item.amount}</td>
            </tr>
          ))}

          <tr>
            <th></th>
            <th className="text-lg">{t("in_total")}:</th>
            <th className="text-lg">{renderProductCount}</th>
          </tr>
        </tbody>
      </table>

      {!data?.length && !isLoading && <EmptyList />}
      <button id={"branch_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default BranchStat;
