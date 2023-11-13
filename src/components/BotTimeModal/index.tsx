import botWorkingTime from "src/hooks/mutation/botWorkingTime";
import Modal from "../Modal";
import { useRemoveParams } from "src/hooks/useCustomNavigate";
import Header from "../Header";
import BaseInput from "../BaseInputs";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useBotWorkTime from "src/hooks/useBotWorkTime";
import useQueryString from "src/hooks/useQueryString";
import { MainPermissions } from "src/utils/types";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";

const timeConverter = (time: string) => {
  const currentDate = new Date();
  const combinedDateTimeString = `${
    currentDate.toISOString().split("T")[0]
  }T${time}`;
  const combinedDateTime = new Date(combinedDateTimeString);
  const formattedTime = combinedDateTime.toISOString().split("T")[1];
  return formattedTime;
};

const BotTimeModal = () => {
  const { mutate } = botWorkingTime();
  const modal = useQueryString("time_modal");
  const removeParams = useRemoveParams();
  const { register, getValues, handleSubmit, reset } = useForm();
  const { data: work_time } = useBotWorkTime({ enabled: !!modal });
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
        from_time: timeConverter(from_time),
        to_time: timeConverter(to_time),
      },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  if (!permission?.[MainPermissions.staff_modal_time]) return;

  return (
    <Modal onClose={closeModal} isOpen={!!modal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header title="Изменить время работы бота">
          <button onClick={closeModal} className="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </Header>
        <div className="p-4 d-flex gap-3">
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
          <button className="btn btn-fill h-40 btn-primary">Сохранить</button>
        </div>
      </form>
    </Modal>
  );
};

export default BotTimeModal;
