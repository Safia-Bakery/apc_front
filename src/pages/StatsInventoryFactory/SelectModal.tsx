import useBackExcel from "@/hooks/custom/useBackExcel";
import useUpdateQueryStr from "@/hooks/custom/useUpdateQueryStr";
import { downloadFactoryStatsInv } from "@/hooks/useInventoryServiseStats";
import errorToast from "@/utils/errorToast";
import successToast from "@/utils/successToast";
import { Button, Flex, Modal } from "antd";
import { useEffect, useState } from "react";

const SelectModal = () => {
  const [selectModal, $selectModal] = useState(false);
  const btnAction = document.getElementById("export_to_excell");
  const toggleModal = () => $selectModal((prev) => !prev);
  const start = useUpdateQueryStr("start");
  const end = useUpdateQueryStr("end");

  const { mutate, isPending } = downloadFactoryStatsInv();

  const handleSelect = (id: number) => {
    mutate(
      {
        ...(!!start && { started_at: start }),
        ...(!!end && { finished_at: end }),
        report_type: id,
      },
      {
        onSuccess: (data) => {
          toggleModal();
          successToast("success");
          useBackExcel(data);
        },
        onError: (e) => {
          errorToast(e.message);
        },
      }
    );
  };

  useEffect(() => {
    if (btnAction)
      btnAction.addEventListener("click", () => {
        toggleModal();
      });
  }, [btnAction]);

  return (
    <div>
      <Modal
        loading={isPending}
        open={selectModal}
        onCancel={toggleModal}
        footer={false}
        title="Выберите тип отчёта"
      >
        <Flex vertical gap={20} className="pt-3">
          <Button
            className="bg-[#87cb16] text-white"
            size="large"
            onClick={() => handleSelect(1)}
          >
            Уровень сервиса
          </Button>
          <Button type="primary" size="large" onClick={() => handleSelect(2)}>
            Эффективность обслуживания
          </Button>
        </Flex>
      </Modal>
    </div>
  );
};

export default SelectModal;
