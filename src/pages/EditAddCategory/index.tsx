import { FC, useEffect, useMemo } from "react";
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
import {
  BaseReturnBoolean,
  Departments,
  MarketingSubDepRu,
  Sphere,
} from "@/utils/types";
import MainSelect from "@/components/BaseInputs/MainSelect";
import { imageConverter } from "@/utils/helpers";
import { baseURL } from "@/store/baseUrl";
import useQueryString from "@/hooks/custom/useQueryString";
import { useTranslation } from "react-i18next";
import useTgLinks from "@/hooks/useTgLinks";
import Loading from "@/components/Loader";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";

const showTime: BaseReturnBoolean = {
  [Departments.IT]: true,
  [Departments.APC]: true,
  [Departments.marketing]: true,
};

interface Props {
  sphere_status?: Sphere;
  dep?: Departments;
}

const EditAddCategory: FC<Props> = ({ sphere_status, dep }) => {
  const { t } = useTranslation();
  const { id, sphere, dep: depId } = useParams();
  const navigate = useNavigate();
  const parent_id = Number(useQueryString("parent_id"));
  const parent_name = useQueryString("parent_name");
  const { data: tg_links, isLoading: linkLoading } = useTgLinks({
    enabled: Number(dep) === Departments.IT,
  });

  const goBack = () => navigate(-1);

  const {
    data: category,
    isLoading,
    refetch,
  } = useCategory({ id: Number(id) });
  const { refetch: categoryRefetch } = useCategories({
    enabled: false,
    page: 1,
    department: depId || dep,
    ...((sphere_status || !!sphere) && {
      sphere_status: Number(sphere) || sphere_status,
    }),
    ...(!!category?.parent_id && { parent_id: category.parent_id }),
  });
  const { mutate } = categoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
  } = useForm();

  const onSubmit = () => {
    const {
      name,
      description,
      urgent,
      status,
      sub_id,
      files,
      time,
      is_child,
      telegram_id,
    } = getValues();
    mutate(
      {
        name,
        description,
        status: +!!status,
        urgent: +!!urgent,
        department: Number(depId) || dep,
        is_child,
        telegram_id,
        sphere_status: Number(sphere) || sphere_status || Sphere.retail,
        ...(!!time && { ftime: +time }),
        ...(id && { id: +id }),
        ...(!!files?.length && { file: files[0] }),
        ...(!!sub_id && { sub_id: +sub_id }),
        ...(!!parent_id && { parent_id }),
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

  useEffect(() => {
    if (category) {
      reset({
        name: category?.name,
        description: category?.description,
        urgent: category.urgent,
        status: !!category.status,
        sub_id: Number(category?.sub_id),
        time: category.ftime,
        is_child: !!category.is_child,
        telegram_id: category.telegram_id,
      });
    }
  }, [category, reset]);

  const renderImage = useMemo(() => {
    if (!!watch("files"))
      return (
        <img
          src={imageConverter(watch("files")?.[0])}
          alt="category-files"
          height={150}
          width={150}
        />
      );

    if (category?.file && !!id)
      return (
        <img
          src={`${baseURL}/${category.file}`}
          alt="category-files"
          height={150}
          width={150}
        />
      );
    if (Number(dep) !== Departments.marketing) return;
  }, [watch("files"), category?.file, id]);

  const renderTitle = useMemo(() => {
    if (id) return `${t("edit_category")} №${id}`;
    else return parent_name ? `${t("add_to")} ${parent_name}` : "add";
  }, []);

  if ((isLoading && !!id) || (linkLoading && Number(dep) === Departments.IT))
    return <Loading />;

  return (
    <Card className="overflow-hidden pb-3">
      <Header title={renderTitle}>
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        {Number(dep) === Departments.marketing && (
          <BaseInput label="department" error={errors.name}>
            <MainSelect
              register={register("sub_id", { required: t("required_field") })}
              values={MarketingSubDepRu}
            />
          </BaseInput>
        )}

        <BaseInput label="name_in_table" error={errors.name}>
          <MainInput
            register={register("name", { required: t("required_field") })}
          />
        </BaseInput>

        {showTime?.[Number(dep)] && (
          <BaseInput label="execution_time_hoours" error={errors.time}>
            <MainInput
              register={register("time", { required: t("required_field") })}
              type="number"
            />
          </BaseInput>
        )}

        {Number(dep) === Departments.IT && (
          <BaseInput label="telegram_id">
            <MainSelect
              register={register("telegram_id")}
              values={tg_links?.items as any}
            />
          </BaseInput>
        )}
        <BaseInput label="description">
          <MainTextArea register={register("description")} />
        </BaseInput>

        <MainCheckBox
          label="urgent"
          register={register("urgent")}
          value={!!category?.urgent}
        />

        <MainCheckBox label={"active"} register={register("status")} />

        {(dep === Departments.APC || dep === Departments.IT) && (
          <MainCheckBox label="last" register={register("is_child")} />
        )}

        {dep === Departments.marketing && (
          <BaseInput label="upload_photo" className="relative">
            <MainInput
              value={
                !!watch("files")?.length ? `${watch("files")?.[0].name}` : ""
              }
              register={register("image_name")}
            />
            <MainInput
              type="file"
              register={register("files")}
              className="opacity-0 absolute right-0 bottom-0"
            />
          </BaseInput>
        )}

        {renderImage}

        <button type="submit" className="btn btn-success   float-end">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddCategory;
