import Loading from "@/components/Loader";
import useUpdateEffect from "@/hooks/custom/useUpdateEffect";
import { getMyAppointments } from "@/hooks/hr-registration";
import { titleObj } from "@/utils/hr-registry";
import { dateTimeFormat } from "@/utils/keys";
import { EPresetTimes, RequestStatus } from "@/utils/types";
import { Button, Flex, Modal } from "antd";
import cl from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useLocation, useNavigate } from "react-router-dom";

export const statusClassName: { [key: number]: string } = {
  [RequestStatus.received]: "bg-[#4630EB]",
  [RequestStatus.new]: "bg-[#4630EB]",
  [RequestStatus.finished]: "bg-[#46B72F]",
  [RequestStatus.closed_denied]: "bg-[#FF0000]",
  [RequestStatus.denied]: "bg-[#FF0000]",
};

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

  const { data, isLoading } = getMyAppointments({});

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

  if (isLoading) return <Loading />;

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
        <div>
          <h1 className="text-xl">Мои заяки</h1>
          <p className="text-[#A3A3A3] text-xs">2 заявки в работе</p>
        </div>

        <Flex
          align="center"
          vertical
          onClick={() => navigate(`/tg/hr-registery/orders`)}
        >
          <img src="/icons/archive.svg" alt="archive" height={17} width={15} />
          <h3 className="text-xs">Архив</h3>
        </Flex>
      </Flex>

      {!!data?.new?.length && (
        <Flex className="w-full mt-4 overflow-x-auto py-1" gap={10}>
          {data?.new?.map((item, idx) => (
            <Flex
              onClick={() => navigate(`/tg/hr-registery/orders/${item.id}`)}
              className="rounded-lg overflow-hidden min-w-[150px] bg-[#F6F6F6]"
              key={idx}
              vertical
            >
              <div className="px-1 pt-2">
                <p className="text-xs">№{item.id}</p>
                <p className="text-xs my-1">
                  {dayjs(item.time_slot).format(dateTimeFormat)}
                </p>
                <p className="text-xs line-clamp-2">
                  {item.employee_name || "Не задано"}
                </p>
              </div>

              <Flex
                className={cl(
                  statusClassName[item.status],
                  "w-full text-white text-sm"
                )}
                align="center"
                justify="center"
              >
                {titleObj[item.status]}
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}

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
          {/* @ts-ignore */}
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
      <img
        src="/images/safia.jpg"
        alt="safia-logo"
        width={50}
        className="mx-auto my-3"
      />
    </div>
  );
};

export default HrRegisteryMain;
