import WebAppContainer from "@/webApp/components/WebAppContainer";
import BranchModal from "../../SelectBranchAndCateg/BranchModal";
import { useMemo, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { Button, DatePicker, Flex, Modal, Select, Tooltip } from "antd";
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
import { useNavigate } from "react-router-dom";
import warnToast from "@/utils/warnToast";
import { disabledDate, workerFunction } from "@/utils/hr-registry";
import AntBranchSelect from "@/components/AntBranchSelect";

type BranchType = { name: string; id: string };

const HrSignRegistery = () => {
  const navigate = useNavigate();
  const [branch, $branch] = useState<string>();
  const [is_intern, $is_intern] = useState<boolean>(false);
  const [position, $position] = useState<number>();
  const [meetDate, $meetDate] = useState<Dayjs>();
  const [meetTime, $meetTime] = useState("");
  const [warnModal, $warnModal] = useState(true);

  const closeWarnMdoal = () => $warnModal((prev) => !prev);

  const { mutate, isPending } = editAddAppointment();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data: positions, isLoading: positionLoading } = getPositions({
    status: 1,
  });

  const { data: timeSlots, isLoading: timeLoading } = getHrTimeSlots({
    query_date: dayjs(meetDate).format(yearMonthDate),
    enabled: !!meetDate,
  });

  const onSubmit = () => {
    if (!position) return warnToast("Выберите Должность!!!");
    // if (!meetTime) return warnToast("Выберите подходящее время!!!");
    if (!branch) {
      window.scrollTo(0, 0);
      warnToast("Выберите Филиал!!!");
    } else {
      const { employee_name, description } = getValues();
      // const [hours, minutes] = meetTime.split(":").map(Number);
      // const time_slot = meetDate!
      //   .hour(hours)
      //   ?.minute(minutes)
      //   ?.second(0)
      //   ?.toISOString();

      navigate("/tg/hr-registery/select-time", {
        state: {
          data: {
            employee_name,
            description,
            position_id: position!,
            branch_id: branch!,
          },
        },
      });

      // mutate(
      //   {
      //     employee_name,
      //     time_slot,
      //     description,
      //     position_id: position!,
      //     branch_id: branch!,
      //   },
      //   {
      //     onSuccess: (data) => {
      //       navigate(`/tg/hr-registery/success/${data.id}`);
      //     },
      //     onError: (e) => {
      //       errorToast(e.name + e.message);
      //     },
      //   }
      // );
    }
  };

  if (positionLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isPending && <Loading />}

      <Modal footer={false} closable onClose={closeWarnMdoal} open={warnModal}>
        <p className="text-sm text-center mt-5">
          Пожалуйста, проверьте, что весь пакет документов полностью готов,
          прежде чем приступать к записи на оформление
        </p>
        <Flex className="gap-x-4 mt-4" wrap flex={1}>
          <Button
            className="bg-[#46B72F] text-white rounded-xl flex flex-1 text-[11px]"
            onClick={closeWarnMdoal}
          >
            Да, документы готовы
          </Button>
          <Button
            className="bg-[#DC0004] text-white rounded-xl flex flex-1 text-[11px]"
            onClick={() =>
              navigate("/tg/hr-registery/main", { state: { isWarn: true } })
            }
          >
            Нет, документы не готовы
          </Button>
        </Flex>
      </Modal>
      <WebAppContainer>
        <h1 className="text-xl mb-4">Подать заявку</h1>
        <BaseInput label="Филиал">
          <AntBranchSelect onChange={(e) => $branch(e)} />
        </BaseInput>
        <BaseInput
          label="Укажите полное ФИО сотрудника"
          error={errors.employee_name}
        >
          <MainInput
            placeholder="ФИО"
            register={register("employee_name", {
              required: "Обязательное поле",
            })}
          />
        </BaseInput>
        <BaseInput label="Укажите должность сотрудника">
          <Select
            className="flex flex-1"
            placeholder="Должность"
            options={positions}
            fieldNames={{ label: "name", value: "id" }}
            onChange={(e) => $position(e)}
          />
        </BaseInput>

        <BaseInput label="Сотрудник будет работать в указанном филиале или проходит стажировку для другого?">
          <Tooltip
            placement="top"
            color="white"
            title={
              <span className="text-black">
                Если на вашем филиале стажируется сотрудник другого филиала, его
                оформление будет производиться на фирму того филиала.
              </span>
            }
          >
            <Button
              className="w-4 h-4 !p-0"
              icon={<InfoCircleOutlined />}
            ></Button>
          </Tooltip>
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

        {/* <BaseInput label="Пожалуйста, выберите подходящую дату">
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
        </BaseInput> */}

        <InvButton
          btnSize={BtnSize.medium}
          type="submit"
          btnType={InvBtnType.primary}
          className="w-full capitalize"
        >
          Далее
        </InvButton>
      </WebAppContainer>
    </form>
  );
};

export default HrSignRegistery;
