import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import Pagination from "src/components/Pagination";
import { useState } from "react";
import { BranchType } from "src/utils/types";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useBranches from "src/hooks/useBranches";
import BranchesFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import useBranchSync from "src/hooks/useBranchSync";
import Loading from "src/components/Loader";

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
  const {
    refetch: branchSync,
    isLoading,
    isFetching,
  } = useBranchSync({ enabled: false });

  const { data: branches, refetch } = useBranches({
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

  const handlePageChange = (page: number) => {
    refetch();
    setCurrentPage(page);
  };
  const handleNavigate = (route: string) => () => navigate(route);

  const handleSync = () => branchSync();

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  if (isFetching) return <Loading />;

  return (
    <Card>
      <Header title={"Филиалы"}>
        <button onClick={handleSync} className="btn btn-primary btn-fill mr-2">
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
        <ItemsCount data={branches} currentPage={currentPage} />
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            <BranchesFilter currentPage={currentPage} />
          </TableHead>

          {!!branches?.items?.length && (
            <tbody>
              {(sortData()?.length ? sortData() : branches.items)?.map(
                (branch, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{branch?.name}</td>
                    <td>{branch.country}</td>
                    <td>{branch.latitude}</td>
                    <td>{branch.longtitude}</td>
                    <td>{!branch.status ? "Не активный" : "Активный"}</td>
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
            refetch={refetch}
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
