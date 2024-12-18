import useUpdateEffect from "@/hooks/custom/useUpdateEffect";
import { EPresetTimes } from "@/utils/types";
import { Button, Flex, Modal } from "antd";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useLocation, useNavigate } from "react-router-dom";

const docsDescr = `Документы, необходимые при приёме на работу:

1. Паспорт(прописка) - ID карта(выписка с местожительства);
2. Трудовая книжка (если есть в бумажном виде);
3. Выписка с электронной трудовой книжки заверенная печатью и подписью от последнего места работы;
4. Диплом об окончании учебного учреждения (аттестат об окончании средне-общего образования). Студентам справка с места учёбы.
5. Военный билет (для лиц старше 27 лет) или приписное свидетельство (до 27 лет, если не служил)
6. ИНН (если имеется обязательно) 
7. ИНПС (открывается в ХАЛК БАНКЕ) 
8. Фото 3х4 – 4 шт. (на белом фоне в классическом виде)`;

const HrRegisteryMain = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [copied, $copied] = useState(false);
  const [warnModal, $warnModal] = useState(false);

  const handleWarnModal = () => $warnModal((prev) => !prev);
  const closeWarnMdoal = () => {
    navigate("/tg/hr-registery/main");
    handleWarnModal();
  };

  useUpdateEffect(() => {
    if (copied)
      setTimeout(() => {
        $copied(false);
      }, EPresetTimes.SECOND * 3);
  }, [copied]);

  useEffect(() => {
    if (state?.isWarn) handleWarnModal();
  }, [state?.isWarn]);

  return (
    <div className="p-2">
      <Modal
        footer={false}
        closable
        centered
        onCancel={handleWarnModal}
        open={warnModal}
        classNames={{ body: "flex flex-col items-center !pt-4" }}
      >
        <p className="text-sm text-center">
          <span className="font-bold flex justify-center">
            В следующий раз убедитесь,{" "}
          </span>
          что все документы сотрудника собраны, прежде чем записывать его на
          оформление. В случае отсутствия необходимых документов запись не
          осуществляется.
        </p>

        <Button
          className="bg-[#46B72F] w-40 text-white rounded-xl mt-4"
          onClick={closeWarnMdoal}
        >
          OK
        </Button>
      </Modal>
      <Flex justify="space-between" align="center" gap={10}>
        <div className="">
          <h1 className="text-xl">Мои заяки</h1>
          <p className="text-[#A3A3A3] text-[10px]">2 заявки в работе</p>
        </div>

        <Flex className="" align="center" vertical>
          <img src="/icons/archive.svg" alt="archive" height={17} width={15} />
          <h3 className="text-[10px]">Архив</h3>
        </Flex>
      </Flex>

      <Flex className="w-full mt-4 overflow-x-auto py-1" gap={10}>
        {[...Array(6)].map((_, idx) => (
          <Flex
            className="rounded-lg overflow-hidden min-w-[150px] bg-[#F6F6F6]"
            key={idx}
            vertical
          >
            <div className="px-1 pt-2">
              <p className="text-[10px]">№123456</p>
              <p className="text-[10px] my-1">12.01.2024 9:30</p>
              <p className="text-[10px] line-clamp-2">Имя Фамилия</p>
            </div>

            <Flex
              className="w-full bg-[#46B72F] text-white"
              align="center"
              justify="center"
            >
              Оформлено
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Flex
        onClick={() => navigate("/tg/hr-registery/registery")}
        className="h-24 w-full rounded-lg relative overflow-hidden mt-4 p-3"
        align="center"
      >
        <img
          src="/images/registery.png"
          alt="registery-image"
          height={96}
          width={"100%"}
          className="!absolute object-fill inset-0 z-0"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 20.1%, rgba(0, 0, 0, 0.65) 35.98%, rgba(0, 0, 0, 0.55) 43.44%, rgba(0, 0, 0, 0.45) 52.53%, rgba(60, 60, 60, 0.35) 64.6%, rgba(60, 60, 60, 0.35) 73.69%)",
          }}
        />
        <h2 className="text-white z-10">Подать заявку</h2>
      </Flex>

      <h3 className="mt-4 mb-2">Документы</h3>
      <div className="bg-[#F6F6F6] rounded-lg p-2 w-full text-xs relative">
        <div className="absolute top-3 right-3">
          <CopyToClipboard text={docsDescr} onCopy={() => $copied(true)}>
            <img src={`/icons/${copied ? "tick" : "copy"}.svg`} />
          </CopyToClipboard>
        </div>
        <p className="my-4 text-xs">
          Документы, необходимые при приёме на работу:
        </p>

        <p className="font-normal text-[#1E1E1E] text-xs leading-5">
          1. Паспорт(прописка) - ID карта(выписка с местожительства);
        </p>
        <p className="font-normal text-[#1E1E1E] text-xs leading-5">
          2. Трудовая книжка (если есть в бумажном виде);
        </p>
        <p className="font-normal text-[#1E1E1E] text-xs leading-5">
          3. Выписка с электронной трудовой книжки заверенная печатью и подписью
          от последнего места работы;
        </p>
        <p className="font-normal text-[#1E1E1E] text-xs leading-5">
          4. Диплом об окончании учебного учреждения (аттестат об окончании
          средне-общего образования). Студентам справка с места учёбы.
        </p>
        <p className="font-normal text-[#1E1E1E] text-xs leading-5">
          5. Военный билет (для лиц старше 27 лет) или приписное свидетельство
          (до 27 лет, если не служил)
        </p>
        <p className="font-normal text-[#1E1E1E] text-xs leading-5">
          6. ИНН (если имеется обязательно){" "}
        </p>
        <p className="font-normal text-[#1E1E1E] text-xs leading-5">
          7. ИНПС (открывается в ХАЛК БАНКЕ){" "}
        </p>
        <p className="font-normal text-[#1E1E1E] text-xs leading-5">
          8. Фото 3х4 – 4 шт. (на белом фоне в классическом виде)
        </p>
      </div>
    </div>
  );
};

export default HrRegisteryMain;
