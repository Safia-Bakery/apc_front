import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { errorToast, successToast } from "@/utils/toast";
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

interface SelectValue {
  value: number | string;
  label: string;
}

const EditAddMasters = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const sphere_status = useQueryString("sphere_status");
  const dep = useQueryString("dep");
  const [users, $users] = useState<SelectValue[]>();
  const [selectedUser, $selectedUser] = useState<SelectValue>();
  const [search, $search] = useDebounce("");

  const { mutate } = brigadaMutation();
  const {
    refetch: usersRefetch,
    data,
    isFetching: usersLoading,
  } = useUsersForBrigada({
    id: Number(id),
    enabled: !!id,
    name: search,
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
    const { brigada_name, brigada_description, status } = getValues();

    mutate(
      {
        status,
        description: brigada_description,
        name: brigada_name,
        ...(id && { id: Number(id) }),
        ...(!!sphere_status && { sphere_status: Number(sphere_status) }),
        ...(!!dep && { department: Number(dep) }),
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
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  const handleSearch = (e: string) => $search(e);

  const renderUsers = useMemo(() => {
    if (!!id)
      return (
        <BaseInputs label="Выберите бригадира">
          <Select
            options={users}
            value={selectedUser}
            isLoading={usersLoading}
            onChange={(e) => $selectedUser(e!)}
            onInputChange={handleSearch}
            isClearable
          />
        </BaseInputs>
      );
  }, [users, selectedUser, usersLoading]);

  useEffect(() => {
    if (data?.items.length)
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
        status: !!brigada.status,
      });
    }
  }, [brigada, id]);

  if (!!id && brigadaLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить бригада №${id}`}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <BaseInputs
            label="Название бригады"
            error={errors.brigada_name}
            className="w-full"
          >
            <MainInput
              register={register("brigada_name", {
                required: "Обязательное поле",
              })}
            />
          </BaseInputs>
        </div>

        {renderUsers}
        <BaseInputs label="ОПИСАНИЕ">
          <MainTextArea register={register("brigada_description")} />
        </BaseInputs>

        <MainCheckBox label="Активный" register={register("status")} />

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddMasters;
