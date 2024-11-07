import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import useBrigada from "@/hooks/useBrigada";
import brigadaMutation from "@/hooks/mutation/brigadaMutation";
import useUsersForBrigada from "@/hooks/useUsersForBrigada";
import BaseInputs from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainInput from "@/components/BaseInputs/MainInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import useQueryString from "custom/useQueryString";
import Select from "react-select";
import useDebounce from "@/hooks/custom/useDebounce";
import Loading from "@/components/Loader";
import { Departments, Sphere } from "@/utils/types";
import { useTranslation } from "react-i18next";

interface SelectValue {
  value: number | string;
  label: string;
}

const EditAddMasters = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const sphere_status = Number(useQueryString("sphere_status"));
  const dep = Number(useQueryString("dep"));
  const [users, $users] = useState<SelectValue[]>();
  const [selectedUser, $selectedUser] = useState<SelectValue>();
  const [search, $search] = useDebounce("");

  const renderDep = useMemo(() => {
    switch (dep) {
      case Departments.APC:
        if (sphere_status === Sphere.fabric)
          return {
            inputTitle: "НАЗВАНИЕ МАСТЕРА",
            selectTitle: "Выберите Мастера",
            mainTitle: `Изменить Мастер №${id}`,
          };
        else
          return {
            inputTitle: "НАЗВАНИЕ БРИГАДЫ",
            selectTitle: "ВЫБЕРИТЕ БРИГАДИРА",
            mainTitle: `Изменить бригада №${id}`,
          };
      case Departments.IT:
        return {
          inputTitle: "НАЗВАНИЕ ИТ специалиста",
          selectTitle: "ВЫБЕРИТЕ ИТ специалиста",
          mainTitle: `Изменить ИТ специалиста №${id}`,
        };

      default:
        return {
          inputTitle: "НАЗВАНИЕ ИТ специалиста",
          selectTitle: "ВЫБЕРИТЕ ИТ специалиста",
          mainTitle: `Изменить специалиста №${id}`,
        };
    }
  }, [dep, sphere_status]);

  const { mutate } = brigadaMutation();
  const {
    refetch: usersRefetch,
    data,
    isFetching: usersLoading,
  } = useUsersForBrigada({
    id: Number(id),
    enabled: !!id,
    name: search,
    department: dep,
    ...(sphere_status && { sphere_status }),
  });
  const {
    data: brigada,
    refetch: brigadaRefetch,
    isLoading: brigadaLoading,
  } = useBrigada({
    id: Number(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const {
      brigada_name,
      brigada_description,
      status,
      is_outsource,
      topic_id,
    } = getValues();

    mutate(
      {
        status,
        description: brigada_description,
        name: brigada_name,
        is_outsource,
        topic_id,
        ...(id && { id: Number(id) }),
        ...(!!sphere_status && { sphere_status }),
        ...(!!dep && { department: dep }),
        ...(!!selectedUser && { users: [+selectedUser.value] }),
      },
      {
        onSuccess: () => {
          successToast(!!id ? "successfully updated" : "successfully created");
          goBack();
          if (!!id) {
            usersRefetch();
            brigadaRefetch();
          }
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const handleSearch = (e: string) => $search(e);

  const renderUsers = useMemo(() => {
    if (!!id)
      return (
        <BaseInputs label={renderDep.selectTitle}>
          <Select
            options={users}
            value={selectedUser}
            placeholder={"Выбрать"}
            isLoading={usersLoading}
            onChange={(e) => $selectedUser(e!)}
            onInputChange={handleSearch}
            isClearable
          />
        </BaseInputs>
      );
  }, [users, selectedUser, usersLoading]);

  useEffect(() => {
    if (data?.items?.length)
      $users(
        data.items.map((item) => {
          return {
            value: item.id,
            label: item.full_name,
          };
        })
      );
  }, [data]);

  useEffect(() => {
    if (id && brigada) {
      if (brigada?.user?.[0]?.full_name && brigada?.user?.[0]?.id)
        $selectedUser({
          label: brigada?.user?.[0]?.full_name,
          value: brigada?.user?.[0]?.id,
        });
      reset({
        brigada_name: brigada?.name,
        brigada_description: brigada?.description,
        status: !!brigada?.status,
        is_outsource: brigada?.is_outsource,
        topic_id: brigada?.topic_id,
      });
    }
  }, [brigada, id]);

  useEffect(() => {
    return () => {
      reset();
      $selectedUser(undefined);
    };
  }, []);

  if (
    !!id &&
    (brigadaLoading ||
      usersLoading ||
      (!!brigada?.user?.[0]?.id && !selectedUser) ||
      (!!data?.items?.length && !users?.length))
  )
    return <Loading />;

  return (
    <Card>
      <Header title={!id ? t("add") : renderDep.mainTitle}>
        <button className="btn btn-primary  " onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <BaseInputs
            label={renderDep.inputTitle}
            error={errors.brigada_name}
            className="w-full"
          >
            <MainInput
              register={register("brigada_name", {
                required: t("required_field"),
              })}
            />
          </BaseInputs>
        </div>

        {renderUsers}

        {dep === Departments.IT && (
          <BaseInputs label={"theme_id"} className="w-full">
            <MainInput type="number" register={register("topic_id")} />
          </BaseInputs>
        )}

        <BaseInputs label="description">
          <MainTextArea register={register("brigada_description")} />
        </BaseInputs>

        <MainCheckBox label={"active"} register={register("status")} />
        {sphere_status === Sphere.retail && (
          <MainCheckBox
            label={"is_outsource"}
            register={register("is_outsource")}
          />
        )}

        <button type="submit" className="btn btn-success  ">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddMasters;
