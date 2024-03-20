import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { useMemo } from "react";
import { BranchType, MainPermissions } from "@/utils/types";
import { handleIdx } from "@/utils/helpers";
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
import { ColumnDef } from "@tanstack/react-table";
import VirtualTable from "@/components/VirtualTable";

const Branches = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refetch: branchSync, isFetching: syncFetching } = useBranchSync({
    enabled: false,
  });
  const permisisons = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;
  const fillial_status = useQueryString("fillial_status");
  const country = useQueryString("country");
  const name = useQueryString("name");

  const columns = useMemo<ColumnDef<BranchType>[]>(
    () => [
      {
        accessorFn: (_, idx) => idx + 1,
        cell: (props) => (
          <div className="w-4">{handleIdx(props.row.index)}</div>
        ),
        header: "№",
        size: 10,
      },
      {
        accessorKey: "name",
        header: t("name_in_table"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "country",
        header: t("region"),
      },
      {
        accessorKey: "latitude",
        header: t("latitude"),
      },
      {
        accessorKey: "longtitude",
        header: t("longtitude"),
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) =>
          !row.original.status ? t("not_active") : t("active"),
      },
      {
        accessorKey: "action",
        size: 30,
        header: "",
        cell: ({ row }) => {
          return (
            permisisons?.[MainPermissions.edit_fillials] && (
              <TableViewBtn
                onClick={handleNavigate(`/branches/${row.original.id}`)}
              />
            )
          );
        },
      },
    ],
    []
  );

  const iikoBtn = permisisons?.[MainPermissions.synch_fillials_iiko];

  const {
    data: branches,
    isFetching,
    isLoading,
  } = useBranches({
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

  if (isFetching || isLoading) return <Loading />;

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
        <VirtualTable columns={columns} data={branches?.items}>
          {renderFilter}
        </VirtualTable>

        {(isFetching || syncFetching) && <Loading />}
        {!branches?.items?.length && !isFetching && <EmptyList />}
        {!!branches && <Pagination totalPages={branches.pages} />}
      </div>
    </Card>
  );
};

export default Branches;
