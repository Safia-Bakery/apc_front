import botWorkingTime from "@/hooks/mutation/botWorkingTime";
import Modal from "../Modal";
import { useRemoveParams } from "custom/useCustomNavigate";
import Header from "../Header";
import BaseInput from "../BaseInputs";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useBotWorkTime from "@/hooks/useBotWorkTime";
import useQueryString from "custom/useQueryString";
import { MainPermissions } from "@/utils/permissions";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import Loading from "../Loader";
import errorToast from "@/utils/errorToast";
import { useTranslation } from "react-i18next";

const BotTimeModal = () => {
  const { t } = useTranslation();
  const { mutate } = botWorkingTime();
  const modal = useQueryString("time_modal");
  const removeParams = useRemoveParams();
  const { register, getValues, handleSubmit, reset } = useForm();
  const { data: work_time, isLoading } = useBotWorkTime({ enabled: !!modal });
  const permission = useAppSelector(permissionSelector);

  useEffect(() => {
    if (work_time)
      reset({ from_time: work_time.from_time, to_time: work_time.to_time });
  }, [work_time]);

  const closeModal = () => removeParams(["time_modal"]);

  const onSubmit = () => {
    const { from_time, to_time } = getValues();

    mutate(
      {
        from_time: from_time + ":00.000Z",
        to_time: to_time + ":00.000Z",
      },
      {
        onSuccess: () => {
          closeModal();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  if (!permission?.has(MainPermissions.staff_modal_time)) return;

  return (
    <Modal onClose={closeModal} isOpen={!!modal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header title={t("change_working_time")}>
          <button onClick={closeModal} className="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </Header>
        {isLoading ? (
          <Loading is_static />
        ) : (
          <div className="p-4 flex gap-3">
            <BaseInput>
              <input
                type="time"
                className="form-control"
                {...register("from_time")}
              />
            </BaseInput>
            <BaseInput>
              <input
                type="time"
                className="form-control"
                {...register("to_time")}
              />
            </BaseInput>
            <button className="btn   h-40 btn-primary">{t("save")}</button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default BotTimeModal;
