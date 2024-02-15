import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { useMemo, useState } from "react";
import { BranchType, MainPermissions } from "@/utils/types";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import useBranches from "@/hooks/useBranches";
import BranchesFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import useBranchSync from "@/hooks/sync/useBranchSync";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "id" },
  { name: "name", key: "name" },
  { name: "region", key: "country" },
  {
    name: "latitude",
    key: "latitude",
  },
  {
    name: "longtitude",
    key: "longtitude",
  },
  { name: "is_active", key: "status" },
  { name: "", key: "" },
];

const Branches = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<BranchType[]>();
  const { refetch: branchSync, isFetching: syncFetching } = useBranchSync({
    enabled: false,
  });
  const permisisons = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;
  const fillial_status = useQueryString("fillial_status");
  const country = useQueryString("country");
  const name = useQueryString("name");

  const iikoBtn = permisisons?.[MainPermissions.synch_fillials_iiko];

  const { data: branches, isFetching } = useBranches({
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
      <Header title={"branches"}>
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
              {t("sync_with_iico")}
            </button>
          )}
          {permisisons?.[MainPermissions.add_fillials] && (
            <button
              className="btn btn-success btn-fill"
              onClick={handleNavigate("add")}
              id="add_branch"
            >
              {t("add")}
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
                  <td>{!branch.status ? t("not_active") : t("active")}</td>
                  <td width={40}>
                    {permisisons?.[MainPermissions.edit_fillials] && (
                      <TableViewBtn
                        onClick={handleNavigate(`/branches/${branch.id}`)}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(isFetching || syncFetching) && <Loading absolute />}
        {!branches?.items?.length && !isFetching && <EmptyList />}
        {!!branches && <Pagination totalPages={branches.pages} />}
      </div>
    </Card>
  );
};

export default Branches;
