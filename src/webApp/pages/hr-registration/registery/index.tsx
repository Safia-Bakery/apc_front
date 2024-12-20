import WebAppContainer from "@/webApp/components/WebAppContainer";
import { useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { Button, Flex, Modal, Select, Tooltip } from "antd";
import { getPositions } from "@/hooks/hr-registration";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import Loading from "@/components/Loader";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import warnToast from "@/utils/warnToast";
import { workerFunction } from "@/utils/hr-registry";
import AntBranchSelect from "@/components/AntBranchSelect";

const HrSignRegistery = () => {
  const navigate = useNavigate();
  const [branch, $branch] = useState<string>();
  const [is_intern, $is_intern] = useState<boolean>(false);
  const [position, $position] = useState<number>();
  const [warnModal, $warnModal] = useState(true);
  const [animate, setAnimate] = useState(false);

  const closeWarnMdoal = () => {
    $warnModal(false);
    setAnimate(true); // Trigger the animation when modal is closed
  };

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data: positions, isLoading: positionLoading } = getPositions({
    status: 1,
    enabled: !warnModal,
  });

  const onSubmit = () => {
    if (!position) return warnToast("Выберите Должность!!!");
    if (!branch) {
      window.scrollTo(0, 0);
      warnToast("Выберите Филиал!!!");
    } else {
      const { employee_name, description } = getValues();
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
    }
  };

  if (positionLoading) return <Loading />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`min-h-svh h-full ${animate ? "animate-fadeIn" : ""}`}
    >
      <Modal footer={false} closable onCancel={closeWarnMdoal} open={warnModal}>
        <p className="text-sm text-center mt-5">
          Пожалуйста, проверьте, что весь пакет документов полностью готов,
          прежде чем приступать к записи на оформление
        </p>
        <Flex className="gap-x-4 mt-4 gap-y-2" wrap flex={1}>
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

      <WebAppContainer className="pb-10 relative">
        <h1 className="text-xl mb-4">Подать заявку</h1>
        {!warnModal && (
          <BaseInput label="Филиал">
            <AntBranchSelect onChange={(e) => $branch(e)} />
          </BaseInput>
        )}
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
        <img
          src="/images/safia.jpg"
          alt="safia-logo"
          width={50}
          className="mt-14 mb-4 mx-auto opacity-30"
        />
      </WebAppContainer>

      <div className="fixed bottom-0 left-0 right-0 p-2 bg-[#DFDFDF]">
        <Button
          htmlType="submit"
          className="bg-[#3B21FF] rounded-full text-white w-full transition-transform duration-300 hover:scale-105"
        >
          Далее
        </Button>
      </div>
    </form>
  );
};

export default HrSignRegistery;
