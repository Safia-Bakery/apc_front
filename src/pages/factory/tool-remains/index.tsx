import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import cl from "classnames";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import { MainPermissions } from "@/utils/permissions";
import TableViewBtn from "@/components/TableViewBtn";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import AntdTable from "@/components/AntdTable";
import Table, { ColumnsType } from "antd/es/table";
import { Image } from "antd";
import { baseURL } from "@/store/baseUrl";
import InventoryRemainsFilter from "./filter";
import { getInvFactoryTools } from "@/hooks/factory";
import { ToolsProductsType } from "@/Types/factory";
import MainInput from "@/components/BaseInputs/MainInput";
import { useForm } from "react-hook-form";

const InventoryFactoryRemains = () => {
  const { t } = useTranslation();
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();
  const permission = useAppSelector(permissionSelector);
  const name = useQueryString("name");
  const parent_id = useQueryString("parent_id");
  const parent_name = useQueryString("parent_name");

  const handleNavigate = (route: string) => () =>
    navigate(route, { state: { scrolled: window.scrollY, search, parent_id } });

  const { data, isLoading, isFetching } = getInvFactoryTools({
    ...(!!parent_id && { parent_id }),
    ...(!!name && { name }),
  });

  const { register, getValues } = useForm();

  const goBack = () => navigate(-1);

  const handleParentId = (id: string, name: string) => () =>
    navigateParams({ parent_id: id, parent_name: name });

  useEffect(() => {
    if (state?.scrolled) window.scrollTo(0, state.scrolled);
  }, []);

  const columns = useMemo<ColumnsType<ToolsProductsType>>(
    () => [
      {
        render: (_, r, idx) => idx + 1,
        title: "№",
        width: 100,
      },
      {
        dataIndex: "name",
        title: t("name_in_table"),
      },
      {
        dataIndex: "factory_ftime",
        title: t("deadline_in_hours"),
        render: (_, record) =>
          record.factory_ftime ? record.factory_ftime : t("not_given"),
      },
      {
        dataIndex: "status",
        title: t("status"),
        render: (_, record) => (!record.status ? t("not_active") : t("active")),
      },
      {
        dataIndex: "image",
        title: t("photo"),
        render: (_, record) =>
          record.file ? (
            <Image src={`${baseURL}/${record.file}`} height={30} width={30} />
          ) : (
            t("not_given")
          ),
      },
      {
        dataIndex: "action",
        width: 50,
        title: "",
        render: (_, record) => {
          return (
            permission?.has(
              MainPermissions.edit_purchase_prods_inv_factory
            ) && (
              <TableViewBtn
                onClick={handleNavigate(
                  `/inventory-remains-factory/${record.id}`
                )}
              />
            )
          );
        },
      },
    ],
    [search]
  );

  const renderFilter = useMemo(() => {
    return <InventoryRemainsFilter />;
  }, []);

  const renderItems = useMemo(() => {
    if (!!parent_id || !!name)
      return (
        <AntdTable
          sticky
          columns={columns}
          summary={() => (
            <Table.Summary fixed={"top"}>
              <Table.Summary.Row className="sticky top-0 z-10">
                {renderFilter}
              </Table.Summary.Row>
            </Table.Summary>
          )}
          data={data?.products}
          loading={isFetching || isLoading}
        />
      );
  }, [data?.products, isFetching, isLoading, name]);

  if (isFetching || isLoading) return <Loading />;

  return (
    <Card className="pb-4">
      <Header title={!parent_name ? "Инвентарь / Товары" : parent_name}>
        <div className="flex gap-2">
          <MainInput
            placeholder={t("search")}
            register={register("name")}
            className="!mb-0"
            onKeyDown={(e) =>
              e.key === "Enter" && navigateParams({ name: getValues("name") })
            }
          />
          <button className="btn btn-primary" onClick={goBack}>
            {t("back")}
          </button>
        </div>
      </Header>

      <ul>
        {data?.groups?.map((folder) => (
          <li
            className={cl(styles.folder, "bg-gray-300")}
            onClick={handleParentId(folder.id, folder.name)}
            key={folder.id}
          >
            <img src="/icons/folder.svg" alt="folder" />
            <span>{folder.name}</span>
          </li>
        ))}
        <hr />
        {renderItems}
      </ul>
    </Card>
  );
};

export default InventoryFactoryRemains;
