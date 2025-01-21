import { freezerBalanceMutation, getFreezerProducts } from "@/hooks/freezer";
import errorToast from "@/utils/errorToast";
import { Button, Flex, InputNumber, Modal, Typography } from "antd";
import { useRef, useState } from "react";

interface Props {
  tool_id?: number;
  closeModal: () => void;
  tool_name?: string;
  tool_parent?: string;
  tool_count?: number;
}

const FreezerItemModal = ({
  tool_id,
  closeModal,
  tool_name,
  tool_count,
  tool_parent,
}: Props) => {
  const [count, $count] = useState<number | undefined>(tool_count);
  const inputRef = useRef<any>(null);
  const { refetch, isLoading, isRefetching } = getFreezerProducts({
    enabled: false,
    ...(!!tool_parent && { parent_id: tool_parent }),
  });
  const { mutate, isPending } = freezerBalanceMutation();

  const handleIncrement = () => {
    $count((prev) => (prev || 0) + 1);
  };

  const handleDecrement = () =>
    count && count > 0 && $count((prev) => (prev || 0) - 1);

  const onSubmit = () => {
    mutate(
      { tool_id: tool_id!, amount: count || 0 },
      {
        onSuccess: async (data) => {
          await refetch();
          closeModal();
          $count(data.amount);
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
      <Flex gap={15} className="mb-4">
        <Button
          onClick={handleDecrement}
          className="bg-tgPrimary min-w-20 text-white hover:!bg-tgPrimary hover:!text-white"
        >
          -
        </Button>
        <InputNumber
          // onFocus={inputRef?.current?.focus({
          //   cursor: "end",
          // })}
          // ref={inputRef}
          // @ts-ignore
          onWheel={(e) => e.target?.blur()}
          className="w-full"
          type="number"
          autoFocus
          placeholder="Кол-во"
          controls
          onChange={(e) => $count(Number(e))}
          value={count}
        />
        <Button
          onClick={handleIncrement}
          className="bg-tgPrimary min-w-20 text-white hover:!bg-tgPrimary hover:!text-white"
        >
          +
        </Button>
      </Flex>
    </Modal>
  );
};

export default FreezerItemModal;
