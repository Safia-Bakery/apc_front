import BaseInput from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import InvButton, { BtnSize, InvBtnType } from "@/webApp/components/InvButton";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  id?: number;
  title?: string;
  description?: String;
};

export const hrDenyReason = [
  {
    name: "не готовы документы",
    id: 1,
  },
  {
    name: "семейные обстоятельства",
    id: 2,
  },
  {
    name: "Сотрудник не работает, увольнение",
    id: 3,
  },
  {
    name: "Не пришел на оформление",
    id: 5,
  },
  {
    name: "Другое",
    id: 4,
  },
];

const HrOrderItem = ({ id, title, description }: Props) => {
  const [modal, $modal] = useState<number>();
  const { watch, register, handleSubmit, getValues } = useForm();
  const closeModal = () => {
    $modal(undefined);
  };

  const handleOrder = () => {
    // mutate(
    //     {
    //       id: Number(id),
    //       status,
    //       ...(status === RequestStatus.closed_denied && {
    //         deny_reason:
    //           fixedReason < 4
    //             ? t(CancelReason[fixedReason])
    //             : cancel_reason,
    //       }),
    //       request_products: currentOrderProds,
    //     },
    //     {
    //       onSuccess: () => {
    //         orderRefetch();
    //         successToast("success");
    //       },
    //       onError: (e) => errorToast(e.message),
    //     }
    //   );
  };

  return (
    <div className="rounded-3xl flex gap-5 w-full bg-white h-18 overflow-hidden">
      <div className="flex flex-1 justify-between pt-3 flex-col">
        <div className="flex flex-1 justify-center ml-4 flex-col">
          <h5 className="font-bold text-base">{title}</h5>

          <p className="text-gray-500 text-xs">{description}</p>
        </div>

        <div className="bg-tgPrimary flex items-center justify-center rounded-tl-3xl w-20 h-9 self-end">
          <button
            className="flex flex-1 justify-center"
            onClick={() => $modal(id)}
          >
            <CloseCircleOutlined className="text-white" />
          </button>
        </div>
      </div>

      <Modal
        open={!!modal}
        onCancel={closeModal}
        classNames={{ content: "!px-1 !pb-1" }}
        footer={false}
      >
        <h2 className="pl-2">
          {id}. {title}
        </h2>
        <form onSubmit={handleSubmit(() => handleOrder())}>
          <div className="p-3">
            <BaseInput label="select_reason">
              <MainSelect
                values={hrDenyReason}
                register={register("fixedReason", {
                  required: "Обязательное поле",
                })}
              />
            </BaseInput>

            {watch("fixedReason") == 4 && (
              <BaseInput label="comments">
                <MainTextArea register={register("cancel_reason")} />
              </BaseInput>
            )}

            <InvButton
              btnType={InvBtnType.primary}
              btnSize={BtnSize.medium}
              className="w-full capitalize font-bold"
              type="submit"
            >
              отправить
            </InvButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HrOrderItem;
