import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import { useToolsRetail } from "@/hooks/useToolsIerarch";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import cl from "classnames";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import { InventoryTools } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import TableViewBtn from "@/components/TableViewBtn";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import InventoryRemainsFilter from "./filter";
import { numberWithCommas } from "@/utils/helpers";
import AntdTable from "@/components/AntdTable";
import Table, { ColumnsType } from "antd/es/table";
import { Image } from "antd";
import { baseURL } from "@/store/baseUrl";
import MainInput from "@/components/BaseInputs/MainInput";
import { useForm } from "react-hook-form";

const InventoryRemains = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();
  const permission = useAppSelector(permissionSelector);
  const { search, state } = useLocation();
  const name = useQueryString("name");
  const parent_id = useQueryString("parent_id");
  const parent_name = useQueryString("parent_name");

  const { data, isLoading, isFetching } = useToolsRetail({
    ...(!!parent_id && { parent_id }),
    ...(!!name && { name }),
  });

  const { register, getValues } = useForm();

  const goBack = () => navigate(-1);

  const handleParentId = (id: string, name: string) => () =>
    navigateParams({ parent_id: id, parent_name: name });

  const columns = useMemo<ColumnsType<InventoryTools>>(
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
        dataIndex: "price",
        title: t("price"),
        render: (_, record) => numberWithCommas(record?.price),
      },
      {
        dataIndex: "num",
        title: t("num"),
      },
      {
        dataIndex: "amount_left",
        title: t("remains"),
      },
      {
        dataIndex: "min_amount",
        title: t("min"),
      },
      {
        dataIndex: "max_amount",
        title: t("max"),
      },
      {
        dataIndex: "ftime",
        title: t("deadline_in_hours"),
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
          record.image ? (
            <Image src={`${baseURL}/${record.image}`} height={30} width={30} />
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
            permission?.has(MainPermissions.edit_product_inventory_retail) && (
              <TableViewBtn
                onClick={handleNavigate(`/inventory-remains/${record.id}`)}
              />
            )
          );
        },
      },
    ],
    [search]
  );

  const handleNavigate = (route: string) => () =>
    navigate(route, { state: { scrolled: window.scrollY, search, parent_id } });

  useEffect(() => {
    if (state?.scrolled) window.scrollTo(0, state.scrolled);
  }, []);

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
          data={data?.tools}
          loading={isFetching || isLoading}
          rowClassName={(tool) =>
            cl({
              ["table-danger"]:
                tool.min_amount &&
                tool.amount_left &&
                tool.amount_left < tool.min_amount,
              ["table-success"]:
                tool.min_amount && tool.amount_left > tool.min_amount,
            })
          }
        />
      );
  }, [data?.tools, isFetching, isLoading]);

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
          {/* <button className="btn btn-primary" onClick={handleMins}>
            {!mins ? t("upload_mins") : t("upload_all")}
          </button> */}
          <button className="btn btn-primary" onClick={goBack}>
            {t("back")}
          </button>
        </div>
      </Header>

      <ul>
        {data?.folders?.map((folder) => (
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

export default InventoryRemains;
