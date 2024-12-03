import { freezerBalanceMutation, getFreezerBalances } from "@/hooks/freezer";
import errorToast from "@/utils/errorToast";
import { InputNumber, Modal, Typography } from "antd";
import { useRef, useState } from "react";

interface Props {
  tool_id?: number;
  closeModal: () => void;
  tool_name?: string;
}

const FreezerItemModal = ({ tool_id, closeModal, tool_name }: Props) => {
  const [count, $count] = useState<number>();
  const inputRef = useRef<any>(null);
  const {
    data: toolBalance,
    refetch,
    isLoading,
    isRefetching,
  } = getFreezerBalances({
    enabled: !!tool_id,
    id: tool_id!,
  });
  const { mutate, isPending } = freezerBalanceMutation();

  const onSubmit = () => {
    mutate(
      { tool_id: tool_id!, amount: count || 0 },
      {
        onSuccess: async () => {
          await refetch();
          closeModal();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  return (
    <Modal
      open={!!tool_id}
      loading={isPending || isLoading || isRefetching}
      title={tool_name}
      onCancel={closeModal}
      onOk={onSubmit}
      okText={"Сохранить"}
      cancelText={"Отмена"}
      classNames={{ content: "!p-1" }}
    >
      <Typography>Введите кол-во</Typography>
      <InputNumber
        onFocus={inputRef?.current?.focus({
          cursor: "end",
        })}
        ref={inputRef}
        className="w-full"
        type="number"
        autoFocus
        placeholder="Кол-во"
        controls
        onChange={(e) => $count(Number(e))}
        defaultValue={toolBalance?.amount}
      />
    </Modal>
  );
};

export default FreezerItemModal;
