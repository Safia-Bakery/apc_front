import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Card from "@/components/Card";
import Header from "@/components/Header";
import { BrigadaType, Departments, Sphere } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Loading from "@/components/Loader";
import { handleIdx } from "@/utils/helpers";
import TableViewBtn from "@/components/TableViewBtn";
import useBrigadas from "@/hooks/useBrigadas";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import { useTranslation } from "react-i18next";
import { ColumnsType } from "antd/es/table";
import AntdTable from "@/components/AntdTable";

interface Props {
  dep: Departments;
  sphere_status?: Sphere;
  add: MainPermissions;
  edit: MainPermissions;
}

const Masters = ({ dep, sphere_status, add, edit }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const permission = useAppSelector(permissionSelector);
  const { pathname } = useLocation();
  const currentPage = Number(useQueryString("page")) || 1;

  const handleNavigate = (id: number | string) => () => navigate(`${id}`);

  const renderDep = useMemo(() => {
    switch (dep) {
      case Departments.APC:
        if (sphere_status === Sphere.fabric)
          return { mainTitle: "masters", tableTitle: "master" };
        else return { mainTitle: "brigades", tableTitle: "brigadir" };
      case Departments.IT:
        return { mainTitle: "it_specialists", tableTitle: "it_specialist" };

      default:
        return { mainTitle: "masters", tableTitle: "master" };
    }
  }, [dep, sphere_status]);

  const columns = useMemo<ColumnsType<BrigadaType>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 50,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("name_in_table"),
        dataIndex: "name",
      },
      {
        title: t(renderDep?.tableTitle),
        dataIndex: "full_name",
        render: (_, order) =>
          !!order.user?.length ? order.user?.[0]?.full_name : t("not_given"),
      },
      {
        title: t("description"),
        dataIndex: "description",
      },
      {
        title: t("role"),
        dataIndex: "role",
        render: (_, record) => (
          <Link
            to={
              permission?.[MainPermissions.edit_roles]
                ? `/roles/${record.user?.[0]?.group?.id}`
                : pathname
            }
          >
            {record.user?.[0]?.group?.name}
          </Link>
        ),
      },
      {
        title: t("status"),
        dataIndex: "status",
        render: (_, record) =>
          !!record.status ? t("active") : t("not_active"),
      },
      {
        title: "",
        dataIndex: "action",
        render: (_, record) =>
          permission?.[edit] && (
            <TableViewBtn
              onClick={handleNavigate(
                `${record.id}?dep=${dep}&sphere_status=${sphere_status}`
              )}
            />
          ),
      },
    ],
    []
  );

  const {
    data: brigadas,
    isLoading: orderLoading,
    isFetching,
    refetch,
  } = useBrigadas({
    page: currentPage,
    enabled: true,
    ...(!!dep && { department: Number(dep) }),
    ...(!!sphere_status && { sphere_status }),
  });

  useEffect(() => {
    refetch();
  }, []);

  if (orderLoading || isFetching) return <Loading />;

  return (
    <Card>
      <Header title={renderDep?.mainTitle}>
        {permission?.[add] && (
          <button
            className="btn btn-success  "
            id="add_master"
            onClick={handleNavigate(
              `add?dep=${dep}&sphere_status=${sphere_status}`
            )}
          >
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive content">
        <AntdTable
          columns={columns}
          data={brigadas?.items}
          totalItems={brigadas?.total}
        />
      </div>
    </Card>
  );
};

export default Masters;
