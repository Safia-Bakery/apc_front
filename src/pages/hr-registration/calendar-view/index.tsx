import React, { useMemo, useState } from "react";
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
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import "antd/dist/reset.css";
import Container from "@/components/Container";
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
import { workerFunction } from "@/utils/hr-registry";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";
import { useForm } from "react-hook-form";
import errorToast from "@/utils/errorToast";
import warnToast from "@/utils/warnToast";
import "./index.scss";
import Loading from "@/components/Loader";

dayjs.extend(weekday);

interface Event {
  id: number;
  title: string;
  date: Dayjs;
  description: string;
}

enum ViewMode {
  month,
  week,
  day,
}

const CustomCalendar: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.month);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [selectedEvent, setSelectedEvent] =
    useState<CalendarAppointment | null>(null);
  const [selectedTime, $selectedTime] = useState<Dayjs>();
  const [selected_branch, $selected_branch] = useState<string>();
  const [is_intern, $is_intern] = useState(false);
  const [meetTime, $meetTime] = useState("");
  const [position, $position] = useState();

  const { isLoading, data, isRefetching, refetch } = getCalendarAppointments(
    {}
  );
  const { mutate, isPending } = editAddAppointment();
  const { register, getValues, reset } = useForm();

  const { data: positions, isLoading: positionLoading } = getPositions({
    enabled: !!selectedTime,
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
    if (!meetTime && viewMode !== ViewMode.day)
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
        data.filter((event) => dayjs(event.date).isSame(current, "day"))) ||
      [];

    return (
      <ul className="list-none p-0">
        {eventsForDate.map((event) => (
          <li
            key={event.id}
            onClick={() => onEventClick({ ...event, date: event.date })}
            className="cursor-pointer"
          >
            <Badge status="success" text={event.title} />
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

  const weekViewRender = useMemo(() => {
    const weekStart = currentDate.startOf("week");
    const weekDays = Array.from({ length: 7 }, (_, i) =>
      weekStart.add(i, "day")
    );

    return (
      <Row gutter={16}>
        {weekDays.map((day) => (
          <Col key={day.toString()} span={3} className="week-row">
            <div style={{ padding: 10, border: "1px solid #ddd" }}>
              <strong>{day.format("dddd, MMMM D")}</strong>
              {cellRender(day)}
            </div>
          </Col>
        ))}
      </Row>
    );
  }, [data]);

  const dayViewRender = useMemo(() => {
    const timeSlots = Array.from(
      { length: 11 },
      (_, i) => currentDate.hour(i + 9).minute(0) // Start from 9:00 and go up to 19:00
    );

    return (
      <div style={{ padding: 20, border: "1px solid #ddd" }}>
        <h3>{currentDate.format("dddd, MMMM D, YYYY")}</h3>
        <div>
          {!!data?.length &&
            timeSlots.map((slot) => {
              const eventsForSlot = data?.filter((event) =>
                dayjs(event.date).isSame(slot, "hour")
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
                        <Badge status="success" text={event.title} />
                      </Flex>
                    ))}
                  </Flex>
                  <Flex className="w-[45%]">
                    {eventsForSlot.length < 2 && (
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
    <Container>
      {isRefetching && <Loading />}
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
      <div style={{ marginTop: 20 }}>
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
        title={selectedEvent?.title}
        open={!!selectedEvent}
        onCancel={closeModal}
        footer={null}
      >
        <p>
          <strong>{t("date")}:</strong>{" "}
          {dayjs(selectedEvent?.date).format(dateTimeFormat)}
        </p>
        <p>
          <strong>Сотрудник:</strong> {selectedEvent?.title}
        </p>
        <p>
          <strong>{t("position")}:</strong> {selectedEvent?.position?.name}
        </p>
        <p>
          <strong>{t("branch")}:</strong> {selectedEvent?.branch?.name}
        </p>
        {selectedEvent?.description && (
          <p>
            <strong>{t("description")}:</strong> {selectedEvent?.description}
          </p>
        )}
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
            <Button
              className="w-4 h-4 !p-0"
              icon={<InfoCircleOutlined />}
            ></Button>
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

        {viewMode !== ViewMode.day && (
          <BaseInput label="Пожалуйста, выберите подходящее время">
            <Select
              options={
                timeSlots?.free &&
                Object.keys(timeSlots?.free)?.map((item) => ({
                  label: item,
                  value: item,
                }))
              }
              className="flex flex-1"
              placeholder="Выберите время"
              loading={timeLoading}
              onChange={(val) => $meetTime(val)}
            />
          </BaseInput>
        )}
      </Modal>
    </Container>
  );
};

export default CustomCalendar;
