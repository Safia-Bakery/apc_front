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
import { baseURL } from "@/store/baseUrl";
import useQueryString from "@/hooks/custom/useQueryString";
import { useTranslation } from "react-i18next";
import Loading from "@/components/Loader";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { MainPermissions } from "@/utils/permissions";
import TableViewBtn from "@/components/TableViewBtn";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import AntdTable from "@/components/AntdTable";
import { Image } from "antd";
import { ColumnsType } from "antd/es/table";
import { getInvFactoryCategoriesTools } from "@/hooks/factory";
import { ToolsProductsType } from "@/Types/factory";
import { Departments } from "@/utils/types";

const EditAddInvFabricCategory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const name = useQueryString("name");
  const page = Number(useQueryString("page")) || 1;

  const goBack = () => navigate(-1);
  const permission = useAppSelector(permissionSelector);
  const handleNavigate = (route: string) => () =>
    navigate(route, { state: { parent_id: id, page } });

  const {
    data: category,
    isLoading,
    refetch,
  } = useCategory({ id: Number(id) });

  const { refetch: categoryRefetch } = useCategories({
    enabled: false,
    page: 1,
    department: Departments.inventory_factory,
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
  } = getInvFactoryCategoriesTools({
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
        department: Departments.inventory_factory,
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

  const columns = useMemo<ColumnsType<ToolsProductsType>>(
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
            permission?.has(MainPermissions.edit_prods_inv_factory) && (
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
    []
  );

  const renderItems = useMemo(() => {
    return (
      <AntdTable
        data={products?.items}
        totalItems={products?.total}
        columns={columns}
        sticky
        loading={isFetching || isLoading}
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
  }, [category]);

  if ((isLoading && !!id) || productLoading) return <Loading />;

  return (
    <>
      <Card className="overflow-hidden pb-3">
        <Header title={id ? `${t("edit_category")} №${id}` : "add"}>
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

export default EditAddInvFabricCategory;
