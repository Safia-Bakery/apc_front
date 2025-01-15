import React, { useMemo, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import {
  Calendar,
  Radio,
  Row,
  Col,
  Badge,
  Modal,
  Button,
  Flex,
  Select,
  Tooltip,
  UploadProps,
  message,
  Popconfirm,
  Space,
  Input,
  Alert,
} from "antd";
import type { RadioChangeEvent } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import "antd/dist/reset.css";
import { useTranslation } from "react-i18next";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  editAddAppointment,
  getCalendarAppointments,
  getHrTimeSlots,
  getPositions,
} from "@/hooks/hr-registration";
import AntBranchSelect from "@/components/AntBranchSelect";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainInput from "@/components/BaseInputs/MainInput";
import { titleObj, workerFunction } from "@/utils/hr-registry";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";
import { useForm } from "react-hook-form";
import errorToast from "@/utils/errorToast";
import warnToast from "@/utils/warnToast";
import "./index.scss";
import Loading from "@/components/Loader";
import Card from "@/components/Card";
import Dragger from "antd/es/upload/Dragger";
import { baseURL } from "@/store/baseUrl";
import { useAppSelector } from "@/store/utils/types";
import { tokenSelector } from "@/store/reducers/auth";
import { RequestStatus } from "@/utils/types";
import { Link } from "react-router-dom";

// Статусы оформления:
// 0 ----> Новый
// 1 ----> Принят
// 3 ----> Оформлен
// 4 ---->  Отменен
// 8 ----> Не оформлен

const statusBadge: any = {
  [RequestStatus.closed_denied]: "error",
  [RequestStatus.denied]: "error",
  [RequestStatus.finished]: "success",
  [RequestStatus.received]: "processing",
};

dayjs.extend(weekday);

enum ViewMode {
  month,
  week,
  day,
}

const CustomCalendar: React.FC = () => {
  const { t } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.month);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [reportFile, $reportFile] = useState<string[]>([]);
  const [fileError, $fileError] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<CalendarAppointment | null>(null);
  const [selectedTime, $selectedTime] = useState<Dayjs>();
  const [selected_branch, $selected_branch] = useState<string>();
  const [is_intern, $is_intern] = useState(false);
  const [meetTime, $meetTime] = useState("");
  const [position, $position] = useState();
  const [deny_reason, $deny_reason] = useState("");
  const [other_deny_reason, $other_deny_reason] = useState("");

  const { isLoading, data, isRefetching, refetch } = getCalendarAppointments(
    {}
  );
  const { mutate, isPending } = editAddAppointment();
  const { register, getValues, reset } = useForm();

  const onDenyReasonChange = (e: RadioChangeEvent) =>
    $deny_reason(e.target.value);

  const editStatus = ({ status }: { status: RequestStatus }) => {
    const denyreaon =
      deny_reason === "Другое" ? other_deny_reason : deny_reason;
    if (status !== RequestStatus.finished && !denyreaon)
      warnToast("Выберите причину отмены");
    if (status === RequestStatus.finished && !reportFile.length)
      $fileError(true);
    else
      mutate(
        {
          id: selectedEvent?.id,
          status,
          deny_reason: denyreaon,
          ...(reportFile.length && { files: reportFile }),
        },
        {
          onSuccess: () => {
            refetch();
            $deny_reason("");
            $selectedTime(undefined);
            setSelectedEvent(null);
            $reportFile([]);
            $fileError(false);
          },
          onError: (e) => errorToast(e.message),
        }
      );
  };

  const { data: positions, isLoading: positionLoading } = getPositions({
    enabled: !!selectedTime,
    status: 1,
  });

  const {
    data: timeSlots,
    isLoading: timeLoading,
    refetch: timeRefetch,
  } = getHrTimeSlots({
    query_date: dayjs(selectedTime).format(yearMonthDate),
    enabled: !!selectedTime,
  });

  const onSubmit = () => {
    const { employee_name, description } = getValues();
    if (!employee_name) return warnToast("Введите имя сотрудника!!!");
    if (!description && is_intern) return warnToast("Введите комментарии!!!");
    if (!position) return warnToast("Выберите Должность!!!");
    if (!meetTime && viewMode === ViewMode.month)
      return warnToast("Выберите подходящее время!!!");
    if (!selected_branch) {
      warnToast("Выберите Филиал!!!");
    } else {
      const [hours, minutes] = meetTime.split(":").map(Number);
      const time_slot = !meetTime
        ? selectedTime!.toISOString()
        : selectedTime!.hour(hours)?.minute(minutes)?.second(0)?.toISOString();

      mutate(
        {
          employee_name,
          time_slot: time_slot!,
          description,
          position_id: position!,
          branch_id: selected_branch!,
        },
        {
          onSuccess: () => {
            $selectedTime(undefined);
            refetch();
            reset({});
          },
          onError: (e: any) => {
            const detail = e?.response?.data?.detail;
            if (!!detail) timeRefetch();
            errorToast(detail ? detail : e.name + e.message);
          },
        }
      );
    }
  };

  const onEventClick = (event: CalendarAppointment) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);
  const openAddEventModal = (time: Dayjs) => $selectedTime(time);

  const cellRender = (current: Dayjs) => {
    const eventsForDate =
      (data?.length &&
        data
          .filter((event) => dayjs(event.date).isSame(current, "day"))
          .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))) ||
      [];

    return (
      <ul className="list-none p-0">
        {eventsForDate.map((event) => (
          <li
            key={event.id}
            onClick={() => onEventClick({ ...event, date: event.date })}
            className="cursor-pointer"
          >
            <Badge
              status={statusBadge[event.status]}
              text={`${dayjs(event.date).format("HH:mm")} - ${
                event.branch?.name
              }`}
            />
          </li>
        ))}
        {current.isAfter(dayjs()) && (
          <Button
            className="add_event_btn"
            type="primary"
            onClick={() => openAddEventModal(current)}
          >
            {t("add_meet")}
          </Button>
        )}
      </ul>
    );
  };

  const props: UploadProps = {
    name: "files",
    openFileDialogOnClick: true,
    action: `${baseURL}/file/upload`,
    headers: { Authorization: `Bearer ${token}` },
    listType: "picture",
    className: `max-w-96 my-6 h-fit ${
      fileError ? "border-2 transition-colors border-red-600 rounded-lg" : ""
    }`,
    disabled: selectedEvent?.status !== RequestStatus.received,

    onChange(info) {
      const { status } = info?.file;
      if (status !== "uploading") {
        <Loading />;
      }
      if (status === "done") {
        $reportFile((prev) => [...prev, info?.file?.response?.files?.[0]]);
        if (fileError) $fileError(false);
        message.success(`${info?.file?.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info?.file?.name} file upload failed.`);
      }
    },
    onRemove(info) {
      $reportFile((prev) =>
        prev.filter((item) => item !== info?.response?.files?.[0])
      );
      // handleLocalRemove(info?.response?.files?.[0]);
    },
  };

  const weekViewRender = useMemo(() => {
    const weekStart = currentDate.startOf("week");
    const weekDays = Array.from({ length: 7 }, (_, i) =>
      weekStart.add(i, "day")
    );

    // Generate all time slots (e.g., 24 hours in a day)
    const timeSlots = Array.from({ length: 19 }, (_, i) =>
      dayjs()
        .startOf("day")
        .add(9, "hour")
        .add(i * 30, "minute")
    );

    const eventsForDate = (current: Dayjs) =>
      (data?.length &&
        data.filter((event) => dayjs(event.date).isSame(current, "day"))) ||
      // .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
      [];

    const groupEventsByTime = (events: CalendarAppointment[]) =>
      events.reduce((acc: any, event) => {
        const time = dayjs(event.date).format("HH:mm");
        if (!acc[time]) {
          acc[time] = [];
        }
        acc[time].push(event);
        return acc;
      }, {});

    return (
      <Row gutter={16} wrap={false}>
        {weekDays.map((day) => {
          const events = eventsForDate(day);
          const groupedEvents = groupEventsByTime(events);

          return (
            <Col key={day.toString()} span={3} className={`week-row min-w-64`}>
              <div className="p-3 border border-[#0000003B] rounded-md">
                <h3 className="text-center text-base w-full mb-0 capitalize">
                  {day.format("dddd")}
                </h3>
                <p className="text-[#9A9A9A] text-sm text-center">
                  {day.format("DD.MM.YYYY")}
                </p>

                <ul>
                  {timeSlots.map((timeSlot) => {
                    const timeKey = timeSlot.format("HH:mm");
                    const eventsAtTime = groupedEvents[timeKey] || [];

                    return (
                      <li
                        key={timeKey}
                        className={`border-[0.5px] h-16 flex items-center border-[#4B4B4B47] p-2 rounded-md mb-2 cursor-pointer ${
                          eventsAtTime.length >= 2
                            ? "bg-[#B5FDAA]"
                            : eventsAtTime.length === 0
                            ? "bg-[#F4F4F4]"
                            : ""
                        }`}
                      >
                        <p
                          onClick={() =>
                            eventsAtTime.length < 2 &&
                            // dayjs().isBefore(timeSlot) &&
                            openAddEventModal(timeSlot)
                          }
                          className="mb-0 hover:shadow-md p-1 rounded-md cursor-pointer"
                        >
                          {timeKey}
                        </p>
                        <ul className="pl-4">
                          {eventsAtTime.map((event: CalendarAppointment) => (
                            <li
                              onClick={() =>
                                onEventClick({ ...event, date: event.date })
                              }
                              className="hover:shadow-md z-10 relative text-xs p-1 rounded-md"
                              key={event.id}
                            >
                              <Badge
                                status={statusBadge[event.status]}
                                className="line-clamp-1"
                                text={event?.branch?.name}
                              />
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Col>
          );
        })}
      </Row>
    );
  }, [data, currentDate, openAddEventModal, onEventClick]);

  const dayViewRender = useMemo(() => {
    const timeSlots = Array.from(
      { length: 20 }, // 20 intervals of 30 minutes = 10 hours (from 9:00 to 19:00)
      (_, i) =>
        currentDate
          .startOf("day")
          .hour(9)
          .minute(0)
          .add(i * 30, "minutes") // Increment by 30 minutes
    );

    return (
      <div className="p-5 border border-[#ddd]">
        <h3>{currentDate.format("dddd, MMMM D, YYYY")}</h3>
        <div>
          {!!data?.length &&
            timeSlots.map((slot) => {
              const eventsForSlot = data?.filter((event) =>
                dayjs(event.date).isSame(slot, "minute")
              );

              return (
                <Flex
                  flex={1}
                  key={slot.toString()}
                  className="border-b border-x border-gray-300 hover:bg-hoverGray transition-colors first:border-t"
                >
                  <Flex
                    className="w-[10%] border-x border-x-gray-300 py-2"
                    align="center"
                    justify="center"
                  >
                    <strong>{slot.format("HH:mm")}</strong>
                  </Flex>
                  <Flex className="w-full border-r-gray-300 border-r" flex={1}>
                    {eventsForSlot.slice(0, 2).map((event) => (
                      <Flex
                        flex={1}
                        className="pt-2 cursor-pointer w-[45%] border-r-gray-300 first:border-r px-2"
                        key={event.id}
                        onClick={() =>
                          onEventClick({ ...event, date: event.date })
                        }
                      >
                        <Badge
                          status={statusBadge[event.status]}
                          text={event.branch?.name}
                        />
                      </Flex>
                    ))}
                  </Flex>
                  <Flex className="w-[45%]">
                    {eventsForSlot.length < 2 && dayjs().isBefore(slot) && (
                      <Button
                        // type="dashed"
                        type="primary"
                        className="m-3"
                        onClick={() => openAddEventModal(slot)}
                      >
                        {t("add_meet")}
                      </Button>
                    )}
                  </Flex>
                </Flex>
              );
            })}
        </div>
      </div>
    );
  }, [data]);

  if (isLoading) return <Loading />;

  return (
    <Card className="p-4">
      {(isRefetching || isPending) && <Loading />}
      <Flex justify="space-between" align="center">
        <Radio.Group
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
        >
          <Radio.Button value={ViewMode.month}>{t("month")}</Radio.Button>
          <Radio.Button value={ViewMode.week}>{t("week")}</Radio.Button>
          <Radio.Button value={ViewMode.day}>{t("day")}</Radio.Button>
        </Radio.Group>

        <button className="btn btn-primary" onClick={() => refetch()}>
          {t("refresh")}
        </button>
      </Flex>
      <div className="mt-5 overflow-x-auto">
        {viewMode === ViewMode.month && (
          <Calendar
            value={currentDate}
            onSelect={setCurrentDate}
            cellRender={cellRender}
          />
        )}
        {viewMode === ViewMode.week && weekViewRender}
        {viewMode === ViewMode.day && dayViewRender}
      </div>

      {/* Modal to display event details */}
      <Modal
        open={!!selectedEvent}
        onCancel={closeModal}
        footer={null}
        classNames={{ content: "w-max h-max" }}
      >
        <Flex gap={30}>
          <Flex vertical justify="space-between" className="min-w-80">
            <Link to={`/hr-requests/${selectedEvent?.id}`}>
              Заявка № {selectedEvent?.id}
            </Link>
            <div className="">
              <p>
                <strong>Дата оформления:</strong>{" "}
                {dayjs(selectedEvent?.date).format(dateTimeFormat)}
              </p>
              <p>
                <strong>Статус:</strong> {titleObj[selectedEvent?.status!]}
              </p>
              <p>
                <strong>Сотрудник:</strong> {selectedEvent?.title}
              </p>
              <p>
                <strong>{t("position")}:</strong>{" "}
                {selectedEvent?.position?.name}
              </p>
              <p>
                <strong>{t("branch")}:</strong> {selectedEvent?.branch?.name}
              </p>
              {selectedEvent?.description && (
                <p>
                  <strong>{t("description")}:</strong>{" "}
                  {selectedEvent?.description}
                </p>
              )}
            </div>

            <p>
              <strong>Дата обработки:</strong>{" "}
              {selectedEvent?.updated_at
                ? dayjs(selectedEvent?.updated_at).format(dateTimeFormat)
                : t("not_given")}
            </p>
          </Flex>

          <Flex className="min-w-96 w-full" vertical>
            <p>
              Дата поступления заявки:{" "}
              {dayjs(selectedEvent?.created_at).format(dateTimeFormat)}
            </p>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{t("upload_files")}</p>
              <p className="ant-upload-hint">{t("file_upload_descr")}</p>
            </Dragger>
            {fileError && (
              <Alert message={"Пожалуйста, добавьте файлы"} type="error" />
            )}

            {selectedEvent?.status === RequestStatus.received && (
              <Flex gap={20} className="justify-end mt-4">
                <Popconfirm
                  title={
                    <Radio.Group
                      onChange={onDenyReasonChange}
                      value={deny_reason}
                    >
                      <Space direction="vertical">
                        <Radio value={"Не готовы документы"}>
                          Не готовы документы
                        </Radio>
                        <Radio value={"Семейные обстоятельства"}>
                          Семейные обстоятельства
                        </Radio>
                        <Radio value={"Сотрудник не работает, увольнение"}>
                          Сотрудник не работает, увольнение
                        </Radio>
                        <Radio value={"Не пришел на оформление"}>
                          Не пришел на оформление
                        </Radio>
                        <Radio value={"Другое"}>
                          Другое
                          {deny_reason === "Другое" ? (
                            <Input
                              onChange={(e) =>
                                $other_deny_reason(e.target.value)
                              }
                              className="w-40 ml-3"
                            />
                          ) : null}
                        </Radio>
                      </Space>
                    </Radio.Group>
                  }
                  onConfirm={() => editStatus({ status: RequestStatus.denied })}
                  okText={t("yes")}
                  cancelText={t("no")}
                >
                  <button
                    disabled={isPending}
                    className="btn btn-danger flex flex-1 justify-center w-max text-nowrap"
                  >
                    Не оформлен
                  </button>
                </Popconfirm>
                <Popconfirm
                  title={
                    <Radio.Group
                      onChange={onDenyReasonChange}
                      value={deny_reason}
                    >
                      <Space direction="vertical">
                        <Radio value={"Не готовы документы"}>
                          Не готовы документы
                        </Radio>
                        <Radio value={"Семейные обстоятельства"}>
                          Семейные обстоятельства
                        </Radio>
                        <Radio value={"Сотрудник не работает, увольнение"}>
                          Сотрудник не работает, увольнение
                        </Radio>
                        <Radio value={"Не пришел на оформление"}>
                          Не пришел на оформление
                        </Radio>
                        <Radio value={"Другое"}>
                          Другое
                          {deny_reason === "Другое" ? (
                            <Input
                              onChange={(e) =>
                                $other_deny_reason(e.target.value)
                              }
                              className="w-40 ml-3"
                            />
                          ) : null}
                        </Radio>
                      </Space>
                    </Radio.Group>
                  }
                  onConfirm={() =>
                    editStatus({ status: RequestStatus.closed_denied })
                  }
                  okText={t("yes")}
                  cancelText={t("no")}
                >
                  <button
                    disabled={isPending}
                    className="btn btn-danger flex flex-1 justify-center"
                  >
                    Отменить
                  </button>
                </Popconfirm>
                <button
                  className="btn btn-primary flex flex-1 justify-center"
                  disabled={isPending}
                  onClick={() => editStatus({ status: RequestStatus.finished })}
                >
                  Оформлен
                </button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Modal>
      <Modal
        loading={isPending || isRefetching || positionLoading}
        title={t("add_new_meet")}
        open={!!selectedTime}
        onCancel={() => $selectedTime(undefined)}
        onOk={onSubmit}
      >
        <BaseInput label="branch">
          <AntBranchSelect onChange={(e) => $selected_branch(e)} />
        </BaseInput>
        <BaseInput label="ФИО">
          <MainInput placeholder="ФИО" register={register("employee_name")} />
        </BaseInput>
        <BaseInput label="Должность">
          <Select
            className="flex flex-1"
            placeholder="Должность"
            options={positions}
            fieldNames={{ label: "name", value: "id" }}
            onChange={(e) => $position(e)}
          />
        </BaseInput>

        <BaseInput
          label="Сотрудник будет работать в указанном филиале или проходит стажировку для другого?"
          className="relative"
        >
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
            <Button className="w-4 h-4 !p-0" icon={<InfoCircleOutlined />} />
          </Tooltip>
          <Select
            options={workerFunction}
            className="flex flex-1"
            placeholder="Функция сотрудника"
            onChange={(val) => $is_intern(val === 1)}
          />
        </BaseInput>

        {is_intern && (
          <BaseInput label="Добавьте комментарии">
            <MainTextArea
              register={register("description")}
              className="flex flex-1"
              placeholder={"Комментарии"}
            />
          </BaseInput>
        )}

        {viewMode === ViewMode.month && (
          <BaseInput label="Пожалуйста, выберите подходящее время">
            <Select
              options={timeSlots?.free?.map((item) => ({
                label: item,
                value: item,
              }))}
              className="flex flex-1"
              labelInValue
              placeholder="Выберите время"
              loading={timeLoading}
              onChange={(val) => $meetTime(val.value)}
            />
          </BaseInput>
        )}
      </Modal>
    </Card>
  );
};

export default CustomCalendar;
