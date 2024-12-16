import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import BranchModal from "../../SelectBranchAndCateg/BranchModal";
import { useMemo, useState } from "react";
import cl from "classnames";
import arrow from "/icons/primaryArrow.svg";
import warnIcon from "/icons/warn.svg";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { DatePicker, Select } from "antd";
import InvButton, { BtnSize, InvBtnType } from "@/webApp/components/InvButton";
import {
  editAddAppointment,
  getHrTimeSlots,
  getPositions,
} from "@/hooks/hr-registration";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import dayjs, { Dayjs } from "dayjs";
import { yearMonthDate } from "@/utils/keys";
import Loading from "@/components/Loader";
import { useForm } from "react-hook-form";
import errorToast from "@/utils/errorToast";
import { useNavigate } from "react-router-dom";
import warnToast from "@/utils/warnToast";
import { disabledDate, workerFunction } from "@/utils/hr-registry";

type BranchType = { name: string; id: string };

export enum HrModals {
  first,
  branch,
  working_branch,
}

const HrSignRegistery = () => {
  const navigate = useNavigate();
  const [modal, $modal] = useState<HrModals>();
  const [branch, $branch] = useState<BranchType>();
  const [is_intern, $is_intern] = useState<boolean>(false);
  const [working_branch, $working_branch] = useState<BranchType>();
  const [position, $position] = useState<number>();
  const [meetDate, $meetDate] = useState<Dayjs>();
  const [meetTime, $meetTime] = useState("");

  const { mutate, isPending } = editAddAppointment();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data: positions, isLoading: positionLoading } = getPositions({});
  const { data: timeSlots, isLoading: timeLoading } = getHrTimeSlots({
    query_date: dayjs(meetDate).format(yearMonthDate),
    enabled: !!meetDate,
  });

  const closeModal = () => $modal(undefined);

  const handleBranch = (item: BranchType) => {
    if (modal === HrModals.branch) {
      $branch(item);
      if (!working_branch) $working_branch(item);
    }
    if (modal === HrModals.working_branch) {
      $working_branch(item);
    }
  };

  const onSubmit = () => {
    if (!position) return warnToast("Выберите Должность!!!");
    if (!meetTime) return warnToast("Выберите подходящее время!!!");
    if (!branch?.id) {
      window.scrollTo(0, 0);
      warnToast("Выберите Филиал!!!");
    } else {
      const { employee_name, description } = getValues();
      const [hours, minutes] = meetTime.split(":").map(Number);
      const time_slot = meetDate!
        .hour(hours)
        ?.minute(minutes)
        ?.second(0)
        ?.toISOString();

      mutate(
        {
          employee_name,
          time_slot,
          description,
          position_id: position!,
          branch_id: branch?.id!,
        },
        {
          onSuccess: (data) => {
            navigate(`/tg/hr-registery/success/${data.id}`);
          },
          onError: (e) => {
            errorToast(e.name + e.message);
          },
        }
      );
    }
  };

  const renderModal = useMemo(() => {
    return (
      <BranchModal
        isOpen={modal === HrModals.branch || modal === HrModals.working_branch}
        onClose={closeModal}
        onChange={handleBranch}
      />
    );
  }, [modal]);

  if (positionLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isPending && <Loading />}
      <InvHeader title="Оформление" sticky goBack />

      <WebAppContainer>
        <div
          className="bg-white my-4 rounded-full"
          onClick={() => $modal(HrModals.branch)}
        >
          <WebAppContainer className="flex items-center justify-between">
            <h4
              className={cl("font-normal text-[#BEA087] text-xl", {
                ["!font-bold"]: !branch?.id,
              })}
            >
              {!!branch?.name ? branch.name : "Выберите филиал"}
            </h4>
            <div className="flex gap-3 items-center">
              {!branch?.id && <img src={warnIcon} alt="select-branch" />}
              <img src={arrow} alt="select-branch" />
            </div>
          </WebAppContainer>
        </div>
        <BaseInput label="ФИО" error={errors.employee_name}>
          <MainInput
            placeholder="ФИО"
            register={register("employee_name", {
              required: "Обязательное поле",
            })}
          />
        </BaseInput>
        <BaseInput label="Должность">
          <Select
            className="flex flex-1"
            placeholder="Должность"
            options={positions}
            fieldNames={{ label: "name", value: "id" }}
            onChange={(e) => $position(e)}
          />
        </BaseInput>

        <BaseInput label="Функция сотрудника">
          <Select
            options={workerFunction}
            className="flex flex-1"
            placeholder="Функция сотрудника"
            onChange={(val) => $is_intern(val === 1)}
          />
        </BaseInput>

        {is_intern && (
          <BaseInput label="Добавьте комментарии" error={errors.description}>
            <MainTextArea
              register={register("description", {
                required: "Обязательное поле",
              })}
              className="flex flex-1"
              placeholder={"Комментарии"}
            />
          </BaseInput>
        )}

        <BaseInput label="Пожалуйста, выберите подходящую дату">
          <DatePicker
            required
            disabledDate={disabledDate}
            onChange={(val) => $meetDate(val)}
            className="flex flex-1"
          />
        </BaseInput>

        <BaseInput label="Пожалуйста, выберите подходящее время">
          <Select
            options={
              timeSlots?.free &&
              Object.keys(timeSlots?.free)?.map((item) => ({
                label: item,
                value: item,
              }))
            }
            className="flex flex-1"
            placeholder="Выберите время"
            loading={timeLoading}
            onChange={(val) => $meetTime(val)}
          />
        </BaseInput>

        <InvButton
          btnSize={BtnSize.medium}
          type="submit"
          btnType={InvBtnType.primary}
          className="w-full capitalize"
        >
          отправить
        </InvButton>
      </WebAppContainer>
      {renderModal}
    </form>
  );
};

export default HrSignRegistery;
