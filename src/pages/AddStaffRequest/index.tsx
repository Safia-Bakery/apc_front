import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
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
import { Sphere } from "@/utils/types";
import Loading from "@/components/Loader";
import dayjs from "dayjs";
import { staffCategoryId, yearMonthDate } from "@/utils/keys";
import { useTranslation } from "react-i18next";

const AddStaffRequest = () => {
  const { t } = useTranslation();
  const { mutate, isPending } = requestMutation();
  const sphere_status = Number(useQueryString("sphere_status"));
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const [date, $date] = useState<string>(dayjs().add(1, "day").toISOString());

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const navigate = useNavigate();
  const goBack = () => navigate("requests-staff");

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
        onError: (e) => errorToast(e.message),
      }
    );
  };
  useEffect(() => {
    reset({ date: dayjs().add(1, "day") });
  }, []);

  const handleDate = (e: ChangeEvent<HTMLInputElement>) =>
    $date(e.target.value);

  const renderBranchSelect = useMemo(() => {
    return (
      <BranchSelect
        origin={1}
        enabled
        warehouse={sphere_status === Sphere.fabric}
      />
    );
  }, [sphere_status]);

  if (isPending) return <Loading />;

  return (
    <Card>
      <Header title={"create_order"}>
        <button className="btn btn-primary  " onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form
        className={cl("content", styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseInputs
          className="relative"
          label="branch"
          error={errors.fillial_id}
        >
          {renderBranchSelect}
        </BaseInputs>

        <BaseInputs label="food_portion">
          <MainInput register={register("product")} type="number" />
        </BaseInputs>
        <BaseInputs label="bread_portion">
          <MainInput register={register("bread")} type="number" />
        </BaseInputs>
        <BaseInputs label="delivery_date">
          <input
            className="form-control mb-2"
            value={dayjs(date).format(yearMonthDate)}
            type="date"
            onChange={handleDate}
          />
        </BaseInputs>

        <BaseInputs label="comments">
          <MainTextArea
            register={register("description")}
            placeholder={t("comments")}
          />
        </BaseInputs>

        <div>
          <button
            type="submit"
            className={`btn btn-info   float-end ${styles.btn}`}
          >
            {t("create")}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AddStaffRequest;
