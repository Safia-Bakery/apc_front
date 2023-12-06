import dayjs from "dayjs";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import TableHead from "src/components/TableHead";
import TableLoading from "src/components/TableLoading";
import useExpenditure from "src/hooks/useExpenditure";
import { ExpenditureType } from "src/utils/types";

const column = [
  { name: "№", key: "name" },
  { name: "Номер заявки", key: "request_id" },
  { name: "Филиалы", key: "amount" },
  { name: "Количество (шт)", key: "amount" },
];

const ShowConsumption = () => {
  const { id } = useParams();
  const [sort, $sort] = useState<ExpenditureType[]>();
  const { data, isLoading } = useExpenditure({ id: Number(id) });

  return (
    <>
      <table className="table table-hover">
        <TableHead
          column={column}
          onSort={(data) => $sort(data)}
          data={data?.items}
        />

        <tbody>
          {isLoading ? (
            <TableLoading />
          ) : (
            (sort?.length ? sort : data?.items)?.map((item, idx) => (
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
