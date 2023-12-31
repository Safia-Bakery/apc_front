import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { successToast } from "@/utils/toast";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import requestMutation from "@/hooks/mutation/orderMutation";
import styles from "./index.module.scss";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import useQueryString from "custom/useQueryString";
import BranchSelect from "@/components/BranchSelect";
import { MainPermissions, Sphere } from "@/utils/types";
import WarehouseSelect from "@/components/WarehouseSelect";
import Loading from "@/components/Loader";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import dayjs from "dayjs";
import { staffCategoryId } from "@/utils/helpers";

const AddStaffRequest = () => {
  const { mutate, isLoading } = requestMutation();
  const branchJson = useQueryString("branch");
  const sphere_status = Number(useQueryString("sphere_status"));
  const branch = branchJson && JSON.parse(branchJson);
  const perm = useAppSelector(permissionSelector);
  const [date, $date] = useState<string>(dayjs().add(1, "day").toISOString());

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const onSubmit = () => {
    const { description, product, bread } = getValues();
    mutate(
      {
        category_id: staffCategoryId,
        size: product,
        description,
        bread_size: bread,
        fillial_id: branch?.id,
        arrival_date: date,
      },
      {
        onSuccess: () => {
          successToast("Заказ успешно создано");
          navigate("/requests-staff");
        },
      }
    );
  };
  useEffect(() => {
    reset({ date: dayjs().add(1, "day") });
  }, []);

  const handleDate = (e: ChangeEvent<HTMLInputElement>) =>
    $date(e.target.value);

  const renderBranchSelect = useMemo(() => {
    if (perm?.[MainPermissions.get_fillials_list]) {
      if (sphere_status === Sphere.fabric) return <WarehouseSelect />;
      else return <BranchSelect origin={1} enabled />;
    }
  }, [sphere_status]);

  if (isLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title={"Создать заказ"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form
        className={cl("content", styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseInputs
          className="relative"
          label="ФИЛИАЛ"
          error={errors.fillial_id}
        >
          {renderBranchSelect}
        </BaseInputs>

        <BaseInputs label="Порция еды">
          <MainInput register={register("product")} type="number" />
        </BaseInputs>
        <BaseInputs label="Порции хлеба">
          <MainInput register={register("bread")} type="number" />
        </BaseInputs>
        <BaseInputs label="Дата поставки">
          <input
            className="form-control mb-2"
            value={dayjs(date).format("YYYY-MM-DD")}
            type="date"
            onChange={handleDate}
          />
        </BaseInputs>

        <BaseInputs label="Комментарии">
          <MainTextArea
            register={register("description")}
            placeholder="Комментарии"
          />
        </BaseInputs>

        <div>
          <button
            type="submit"
            className={`btn btn-info btn-fill float-end ${styles.btn}`}
          >
            Создать
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AddStaffRequest;
