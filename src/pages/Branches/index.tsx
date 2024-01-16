import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { useMemo, useState } from "react";
import { BranchType, MainPermissions } from "@/utils/types";
import { handleIdx, itemsPerPage } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import useBranches from "@/hooks/useBranches";
import BranchesFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import useBranchSync from "@/hooks/sync/useBranchSync";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import TableLoading from "@/components/TableLoading";
import EmptyList from "@/components/EmptyList";

const column = [
  { name: "№", key: "id" },
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
  const [sort, $sort] = useState<BranchType[]>();
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

  const handleNavigate = (route: string) => () => navigate(route);

  const handleSync = () => branchSync();

  const renderFilter = useMemo(() => {
    return <BranchesFilter />;
  }, [name, country, fillial_status]);

  return (
    <Card>
      <Header title={"Филиалы"}>
        <div className="flex">
          {iikoBtn && (
            <button
              onClick={handleSync}
              disabled={isFetching}
              className="btn btn-primary btn-fill mr-2 !flex"
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
        </div>
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={branches} />
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={branches?.items}
          >
            {renderFilter}
          </TableHead>

          <tbody id="branch_body">
            {!!branches?.items?.length &&
              !isFetching &&
              (sort?.length ? sort : branches.items)?.map((branch, idx) => (
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
              ))}

            {isFetching && <TableLoading />}
          </tbody>
        </table>
        {!!branches && <Pagination totalPages={branches.pages} />}
        {!branches?.items?.length && !isFetching && <EmptyList />}
      </div>
    </Card>
  );
};

export default Branches;
