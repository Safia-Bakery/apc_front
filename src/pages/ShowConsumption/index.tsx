import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyList from "@/components/EmptyList";
import TableHead from "@/components/TableHead";
import useExpenditure from "@/hooks/useExpenditure";
import { ExpenditureType } from "@/utils/types";
import Loading from "@/components/Loader";
import { useDownloadExcel } from "react-export-table-to-excel";
import useQueryString from "@/hooks/custom/useQueryString";

const column = [
  { name: "№", key: "name" },
  { name: "Номер заявки", key: "request_id" },
  { name: "Количество (шт)", key: "amount" },
  { name: "Дата использование", key: "created_at" },
];

const ShowConsumption = () => {
  const { id } = useParams();
  const [sort, $sort] = useState<ExpenditureType[]>();
  const { data, isLoading } = useExpenditure({ id: Number(id) });
  const sub_title = useQueryString("sub_title");

  const tableRef = useRef(null);
  const btnAction = document.getElementById("export_to_excell");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef?.current,
    filename: sub_title || "Расходы",
    sheet: sub_title || "Расходы",
  });

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        document.getElementById("const_stat")?.click();
      });
  }, [btnAction]);

  const downloadAsPdf = () => onDownload();

  if (isLoading) return <Loading absolute />;

  return (
    <>
      <table ref={tableRef} className="table table-hover">
        <TableHead
          column={column}
          onSort={(data) => $sort(data)}
          data={data?.items}
        />

        <tbody>
          {(sort?.length ? sort : data?.items)?.map((item, idx) => (
            <tr key={idx} className="bg-blue">
              <td width="50">{idx + 1}</td>

              <td width={150}>
                <Link
                  to={`/requests-apc/${item?.request_id}`}
                  state={{ prevPath: window.location.pathname }}
                >
                  {item?.request_id}
                </Link>
              </td>
              <td>{item?.amount}</td>
              <td>{dayjs(item?.created_at).format("DD.MM.YYYY HH:mm")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!data?.items?.length && !isLoading && <EmptyList />}
      <button id={"const_stat"} className="hidden" onClick={downloadAsPdf}>
        download
      </button>
    </>
  );
};

export default ShowConsumption;
