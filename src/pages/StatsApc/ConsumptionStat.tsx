import { useEffect, useMemo, useRef, useState } from "react";
import TableHead from "@/components/TableHead";
import useDistinct from "@/hooks/useDistinct";
import { Link } from "react-router-dom";
import { useDownloadExcel } from "react-export-table-to-excel";
import { Departments, Sphere } from "@/utils/types";
import EmptyList from "@/components/EmptyList";
import useUpdateQueryStr from "custom/useUpdateQueryStr";
import { numberWithCommas } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

interface ItemType {
  amount: number;
  name: string;
  id: number;
  price: number;
}

const column = [
  { name: "№", key: "" },
  { name: "material", key: "name" },
  { name: "price", key: "price" },
  { name: "quantity", key: "amount" },
  { name: "summ", key: "total" },
];
interface Props {
  sphere_status: Sphere;
}

const ConsumptionStat = ({ sphere_status }: Props) => {
  const { t } = useTranslation();
  const [sort, $sort] = useState<ItemType[]>();

  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { data, isLoading } = useDistinct({
    department: Departments.apc,
    sphere_status,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("stats_cunsumption"),
    sheet: "categories",
  });

  const renderProductCount = useMemo(() => {
    if (data?.tests)
      return data?.tests.reduce((acc, item) => (acc += item.price || 0), 0);
  }, [data?.tests]);

  const downloadAsPdf = () => onDownload();

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("consumption_stat")?.click();
      });
  }, [btnAction]);

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
                <Link to={`${item?.id.toString()}?sub_title=${item?.name}`}>
                  {item?.name}
                </Link>
              </td>

              <td>{item?.price && numberWithCommas(item?.price)}</td>
              <td>{item?.amount}</td>

              <td>
                {item?.price && numberWithCommas(item?.amount * item?.price)}
              </td>
            </tr>
          ))}
          <tr>
            <th colSpan={4} className="text-lg">
              {t("in_total")}:
            </th>
            <th className="text-lg">{numberWithCommas(renderProductCount!)}</th>
          </tr>
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
