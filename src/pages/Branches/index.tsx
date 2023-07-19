import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import Pagination from "src/components/Pagination";
import { useState } from "react";
import { BranchType } from "src/utils/types";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useBranches from "src/hooks/useBranches";
import { useForm } from "react-hook-form";
import BranchesFilter from "./filter";

const column = [
  { name: "#", key: "id" },
  { name: "Название", key: "name" },
  { name: "Регион", key: "country" },
  {
    name: "Широта",
    key: "latitude",
  },
  {
    name: "Долгота",
    key: "longtitude",
  },
  { name: "Актив", key: "status" },
  { name: "", key: "" },
];

const Branches = () => {
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<keyof BranchType>();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { data: branches } = useBranches({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });

  const handleSort = (key: keyof BranchType) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const sortData = () => {
    if (branches?.items && sortKey) {
      const sortedData = [...branches?.items].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return sortedData;
    }
  };
  const { register, getValues } = useForm();

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNavigate = (route: string) => () => navigate(route);

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  return (
    <Card>
      <Header title={"Филиалы"}>
        <button className="btn btn-primary btn-fill mr-2">
          <img
            src="/assets/icons/sync.svg"
            height={20}
            width={20}
            alt="sync"
            className="mr-2"
          />
          Синхронизировать с iiko
        </button>
        <button
          className="btn btn-success btn-fill"
          onClick={handleNavigate("add")}
        >
          Добавить
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <div className={styles.summary}>
          Показаны записи <b>1-{branches?.items.length}</b> из{" "}
          <b>{branches?.total}</b>.
        </div>
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            <BranchesFilter currentPage={currentPage} />
          </TableHead>

          {!!branches?.items.length && (
            <tbody>
              {(sortData()?.length ? sortData() : branches.items)?.map(
                (branch, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{branch?.name}</td>
                    <td>{branch.country}</td>
                    <td>{branch.latitude}</td>
                    <td>{branch.longtitude}</td>
                    <td>{branch.status ? "Не активный" : "Активный"}</td>
                    <TableViewBtn
                      onClick={handleNavigate(`/branches/${branch.id}`)}
                    />
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
        {!!branches && (
          <Pagination
            totalItems={branches?.total}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        {!branches?.items?.length && (
          <div className="w-100">
            <p className="text-center w-100 ">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Branches;
