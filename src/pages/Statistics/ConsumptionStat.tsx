import { useState } from "react";
import TableHead from "src/components/TableHead";

import Loading from "src/components/Loader";
import useDistinct from "src/hooks/useDistinct";
import { Link } from "react-router-dom";

const column = [
  { name: "№", key: "" },
  { name: "Материал", key: "name" },
  { name: "Количество (шт)", key: "amount" },
];

const ConsumptionStat = () => {
  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading } = useDistinct({});

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
            data?.tests?.map((item, idx) => (
              <tr key={idx} className="bg-blue">
                <td width="50">{idx + 1}</td>

                <td>
                  <Link to={item?.id.toString()}>{item?.name}</Link>
                </td>
                <td>{item?.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!data?.tests?.length && !isLoading && (
        <div className="w-100">
          <p className="text-center w-100 ">Спосок пуст</p>
        </div>
      )}
    </>
  );
};

export default ConsumptionStat;
