import dayjs from "dayjs";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "src/components/Loader";
import TableHead from "src/components/TableHead";
import useExpenditure from "src/hooks/useExpenditure";

const column = [
  { name: "№", key: "name" },
  { name: "Номер заявки", key: "name" },
  { name: "Филиалы", key: "name" },
  { name: "Количество (шт)", key: "amount" },
];

const ShowConsumption = () => {
  const { id } = useParams();
  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading } = useExpenditure({ id: Number(id) });

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <table className="table table-hover">
        <TableHead
          column={column}
          sort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />

        <tbody>
          {isLoading ? (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          ) : (
            data?.items?.map((item, idx) => (
              <tr key={idx} className="bg-blue">
                <td width="50">{idx + 1}</td>

                <td width={150}>
                  <Link
                    to={`/requests-apc/${item?.request_id.toString()}`}
                    state={{ prevPath: window.location.pathname }}
                  >
                    {item?.request_id}
                  </Link>
                </td>
                <td>{item?.amount}</td>
                <td>{dayjs(item?.created_at).format("DD.MM.YYYY HH:mm")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!data?.items?.length && !isLoading && (
        <div className="w-full">
          <p className="text-center w-full ">Спосок пуст</p>
        </div>
      )}
    </>
  );
};

export default ShowConsumption;
