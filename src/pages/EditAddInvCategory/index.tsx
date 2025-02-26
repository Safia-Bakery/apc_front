import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@/components/Card";
import Header from "@/components/Header";
import useCategory from "@/hooks/useCategory";
import categoryMutation from "@/hooks/mutation/categoryMutation";
import useCategories from "@/hooks/useCategories";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import { ToolItemType } from "@/utils/types";
import { numberWithCommas } from "@/utils/helpers";
import { baseURL } from "@/store/baseUrl";
import useQueryString from "@/hooks/custom/useQueryString";
import { useTranslation } from "react-i18next";
import Loading from "@/components/Loader";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { useInvTools } from "@/hooks/useInvTools";
import { MainPermissions } from "@/utils/permissions";
import TableViewBtn from "@/components/TableViewBtn";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import InventoryRemainsFilter from "../InventoryRemains/filter";
import AntdTable from "@/components/AntdTable";
import cl from "classnames";
import { Image } from "antd";
import Table from "antd/es/table/Table";
import { ColumnsType } from "antd/es/table";

const EditAddInvCategory = () => {
  const { t } = useTranslation();
  const { id, dep: depId } = useParams();
  const navigate = useNavigate();
  const name = useQueryString("name");
  const page = Number(useQueryString("page")) || 1;

  const goBack = () => navigate(-1);
  const permission = useAppSelector(permissionSelector);
  const handleNavigate = (route: string) => () =>
    navigate(route, { state: { page, category_id: id } });

  const {
    data: category,
    isLoading,
    refetch,
  } = useCategory({ id: Number(id) });

  const { refetch: categoryRefetch } = useCategories({
    enabled: false,
    page: 1,
    department: depId,
  });
  const { mutate } = categoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const {
    data: products,
    isLoading: productLoading,
    isFetching,
  } = useInvTools({
    ...(name && { name }),
    ...(page && { page: +page }),
    ...(id && { category_id: +id }),
    enabled: !!id,
  });

  const onSubmit = () => {
    const { name, description, urgent, status } = getValues();
    mutate(
      {
        name,
        description,
        status: +!!status,
        urgent: +!!urgent,
        department: Number(depId),
        ...(id && { id: +id }),
      },
      {
        onSuccess: () => {
          categoryRefetch();
          successToast(!!id ? "updated" : "created");
          goBack();
          if (id) refetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const columns = useMemo<ColumnsType<ToolItemType>>(
    () => [
      {
        render: (_, r, idx) => idx + 1,
        title: "№",
        width: 50,
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
    []
  );

  const renderFilter = useMemo(() => {
    return <InventoryRemainsFilter />;
  }, []);

  const renderItems = useMemo(() => {
    return (
      <AntdTable
        data={products?.items}
        totalItems={products?.total}
        columns={columns}
        sticky
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
        summary={() => (
          <Table.Summary fixed={"top"}>
            <Table.Summary.Row className="sticky top-0 z-10">
              {renderFilter}
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    );
  }, [products, isFetching, isLoading]);

  useEffect(() => {
    if (category) {
      reset({
        name: category?.name,
        description: category?.description,
        urgent: category.urgent,
        status: !!category.status,
      });
    }
  }, [category, reset]);

  if ((isLoading && !!id) || productLoading) return <Loading />;

  return (
    <>
      <Card className="overflow-hidden pb-3">
        <Header title={!!id ? `${t("edit_category")} №${id}` : "add"}>
          <button className="btn btn-primary" onClick={goBack}>
            {t("back")}
          </button>
        </Header>
        <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
          <BaseInput label="name_in_table" error={errors.name}>
            <MainInput
              register={register("name", { required: t("required_field") })}
            />
          </BaseInput>

          <BaseInput label="description">
            <MainTextArea register={register("description")} />
          </BaseInput>

          <MainCheckBox
            label="urgent"
            register={register("urgent")}
            value={!!category?.urgent}
          />

          <MainCheckBox label={"active"} register={register("status")} />

          <button type="submit" className="btn btn-success float-end">
            {t("save")}
          </button>
        </form>
      </Card>

      <Card>
        <div className="overflow-x-auto md:overflow-visible content">
          <Header title={"products"} />
          {renderItems}
        </div>
      </Card>
    </>
  );
};

export default EditAddInvCategory;
