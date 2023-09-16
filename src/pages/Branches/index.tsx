import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import Pagination from "src/components/Pagination";
import { useMemo, useState } from "react";
import { BranchType, MainPermissions } from "src/utils/types";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useBranches from "src/hooks/useBranches";
import BranchesFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import useBranchSync from "src/hooks/sync/useBranchSync";
import Loading from "src/components/Loader";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";
import useQueryString from "src/hooks/useQueryString";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { refetch: branchSync, isFetching } = useBranchSync({ enabled: false });
  const permisisons = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;
  const fillial_status = useQueryString("fillial_status");
  const country = useQueryString("country");
  const name = useQueryString("name");

  const iikoBtn = permisisons?.[MainPermissions.synch_fillials_iiko];

  const { data: branches } = useBranches({
    size: itemsPerPage,
    page: currentPage,
    enabled: true,
    origin: 0,
    body: {
      ...(!!name && { name }),
      ...(!!country && { country }),
      ...(!!fillial_status && { fillial_status }),
    },
  });

  const handleSort = (key: keyof BranchType) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const sortData = useMemo(() => {
    if (branches?.items && sortKey) {
      return [...branches?.items].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
    }
    return [];
  }, [branches?.items, sortKey, sortOrder]);

  const handleNavigate = (route: string) => () => navigate(route);

  const handleSync = () => branchSync();

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  const renderFilter = useMemo(() => {
    return <BranchesFilter />;
  }, [name, country, fillial_status]);

  return (
    <Card>
      <Header title={"Филиалы"}>
        {iikoBtn && (
          <button
            onClick={handleSync}
            className="btn btn-primary btn-fill mr-2"
          >
            <img
              src="/assets/icons/sync.svg"
              height={20}
              width={20}
              alt="sync"
              className="mr-2"
            />
            Синхронизировать с iiko
          </button>
        )}
        {permisisons?.[MainPermissions.add_fillials] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate("add")}
            id="add_branch"
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={branches} />
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            {renderFilter}
          </TableHead>

          <tbody id="branch_body">
            {!!branches?.items?.length &&
              !isFetching &&
              (sortData?.length ? sortData : branches.items)?.map(
                (branch, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{branch?.name}</td>
                    <td>{branch.country}</td>
                    <td>{branch.latitude}</td>
                    <td>{branch.longtitude}</td>
                    <td>{!branch.status ? "Не активный" : "Активный"}</td>
                    <td width={40}>
                      {permisisons?.[MainPermissions.edit_fillials] && (
                        <TableViewBtn
                          onClick={handleNavigate(`/branches/${branch.id}`)}
                        />
                      )}
                    </td>
                  </tr>
                )
              )}

            {isFetching && (
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!!branches && <Pagination totalPages={branches.pages} />}
        {!branches?.items?.length && !isFetching && (
          <div className="w-100">
            <p className="text-center w-100 ">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Branches;
