import Loading from "@/components/Loader";
import {
  editAddAppointment,
  getAppointment,
  getMyAppointments,
} from "@/hooks/hr-registration";
import errorToast from "@/utils/errorToast";
import { RequestStatus } from "@/utils/types";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Button, Flex, Modal, Radio } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { statusClassName } from "../main";
import cl from "classnames";
import { titleObj } from "@/utils/hr-registry";

const denyReasons = [
  "Не готовы документы",
  "Семейные обстоятельства",
  "Сотрудник не работает, увольнение",
  "Другое",
];

const inActiveBtn: { [key: number]: boolean } = {
  [RequestStatus.closed_denied]: true,
  [RequestStatus.finished]: true,
  [RequestStatus.denied]: true,
};

const ShowHrOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = getAppointment({
    id: Number(id),
    enabled: !!id,
  });
  const [modal, $modal] = useState(false);
  const [selectedReason, $selectedReason] = useState("");
  const { refetch: ordersRefetch } = getMyAppointments({});

  const { mutate, isPending } = editAddAppointment();

  const handleModal = () => $modal((prev) => !prev);

  const handleCancel = () => {
    mutate(
      {
        deny_reason: selectedReason,
        id: Number(id),
        status: RequestStatus.closed_denied,
      },
      {
        onSuccess: () => {
          ordersRefetch();
          refetch();
          navigate(-1);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  if (isLoading) return <Loading />;

  return (
    <WebAppContainer>
      {isPending && <Loading />}
      <Flex justify="space-between" align="center" className="mb-4">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/back-circled.svg" alt="" />
        </button>
        <h1>№{id}</h1>

        <Flex
          className={cl(
            statusClassName[data?.status!],
            "w-min py-1 px-3 text-white text-xs rounded-full"
          )}
          align="center"
          justify="center"
        >
          {titleObj[data?.status!]}
        </Flex>
      </Flex>

      <Modal
        title={"Укажите причину отмены"}
        open={modal}
        loading={isPending}
        closable
        onCancel={handleModal}
        footer={false}
      >
        <Radio.Group onChange={(e) => $selectedReason(e.target.value)}>
          {denyReasons.map((item) => (
            <Radio key={item} value={item}>
              {item}
            </Radio>
          ))}
          {/* <Row>
          <Col span={12} >
            
          </Col>
          <Col span={12}>
            <Radio value={2}>2022</Radio>
          </Col>
        </Row>  */}
        </Radio.Group>
        <Flex className="w-full" justify="center">
          <Button
            disabled={isPending || !selectedReason}
            onClick={handleCancel}
            className="bg-[#DC0004] text-white rounded-full w-36 mx-auto mt-4"
          >
            Подтвердить
          </Button>
        </Flex>
      </Modal>

      <p>Филиал: {data?.branch?.name} </p>
      <p>Фио: {data?.employee_name}</p>
      <p>Должность: {data?.position?.name}</p>
      {data?.description && (
        <p>Комментарий (если для другого филиала): {data?.description}</p>
      )}
      <p>Дата: {dayjs(data?.time_slot).format("dddd DD.MM.YYYY")}</p>
      <p>Время: {dayjs(data?.time_slot).format("HH:mm")}</p>
      {!!data?.deny_reason && <p>Причина отклонении: {data.deny_reason}</p>}

      {!inActiveBtn[data?.status!] && (
        <button
          disabled={isPending}
          onClick={handleModal}
          className="text-[#FF0000] text-sm absolute bottom-20 left-1/2 -translate-x-1/2"
        >
          Отменить запись
        </button>
      )}

      <img
        src="/images/safia.jpg"
        alt="safia-logo"
        width={50}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      />
    </WebAppContainer>
  );
};

export default ShowHrOrder;
