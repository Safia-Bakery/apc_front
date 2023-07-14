import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import { BrigadaType } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { useState } from "react";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useBrigadas from "src/hooks/useBrigadas";

const column = [
  { name: "#", key: "id" as keyof BrigadaType["id"] },
  { name: "Названия", key: "name" as keyof BrigadaType["name"] },
  { name: "Описания", key: "description" as keyof BrigadaType["description"] },
  { name: "", key: "" },
];

const Brigades = () => {
  const navigate = useNavigate();
  const handleNavigate = (id: number | string) => () => navigate(`${id}`);

  const [currentPage, setCurrentPage] = useState(1);
  const { data: brigadas, isLoading: orderLoading } = useBrigadas({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });

  const [sortKey, setSortKey] = useState<keyof BrigadaType>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortData = () => {
    if (brigadas?.items && sortKey) {
      const sortedData = [...brigadas?.items].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return sortedData;
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  if (orderLoading) return <Loading />;
  return (
    <Card>
      <Header title={"Бригады"}>
        <button
          className="btn btn-success btn-fill"
          onClick={handleNavigate("add")}
        >
          Добавить
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <div className={styles.summary}>
          Показаны записи <b>1-{brigadas?.items.length}</b> из{" "}
          <b>{brigadas?.total}</b>.
        </div>
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          />

          {brigadas?.items.length && (
            <tbody>
              {(sortData()?.length ? sortData() : brigadas?.items)?.map(
                (order, idx) => (
                  <tr className="bg-blue" key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td width={250}>{order.name}</td>
                    <td>{order.description}</td>
                    <TableViewBtn onClick={handleNavigate(`${1}`)} />
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
        {!!brigadas && (
          <Pagination
            totalItems={brigadas?.total}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        {!brigadas?.items?.length && (
          <div className="w-100">
            <p className="text-center w-100 ">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Brigades;
