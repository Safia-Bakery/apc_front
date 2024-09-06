import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Calendar,
  CalendarProps,
  Modal,
  Button,
  ConfigProvider,
  AlertProps,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import ruRU from "antd/es/locale/ru_RU";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import Container from "@/components/Container";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";
import { deleteCalendar, useCalendars } from "@/hooks/cleaning";
import { yearMonthDate } from "@/utils/keys";
import Loading from "@/components/Loader";
import { antdType } from "@/utils/antdTypes";
import CalendarInput from "./calendarInput";
import { errorToast } from "@/utils/toast";

// Apply the plugins globally
dayjs.extend(weekday);
dayjs.extend(localeData);
const today = new Date();

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const Cleaning = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<Dayjs>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, $selectedMonth] = useState(
    dayjs(today).format(yearMonthDate)
  );
  const { mutate: deleteItem } = deleteCalendar();
  const [modalData, setModalData] = useState<{
    date: Dayjs;
    events: { type: string; content: string }[];
  }>({
    date: dayjs(),
    events: [],
  });

  const {
    data: calendars,
    isLoading,
    refetch,
  } = useCalendars({
    current_date: selectedMonth,
  });
  const [showInput, setShowInput] = useState(false);

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const handleDelete = (id: number) => {
    deleteItem(id, {
      onSuccess: () => {
        refetch();
      },
      onError: (e) => errorToast(e.message),
    });
  };

  const getListData = useCallback(
    (value: Dayjs) => {
      const listData: { type: string; content: string; id: number }[] = [];
      calendars?.forEach((calendar) => {
        const eventDate = dayjs(calendar?.date);
        if (value.isSame(eventDate, "day")) {
          listData.push({
            type: calendar.is_active ? antdType.success : antdType.warning,
            content: `${calendar?.branch?.name}`,
            id: calendar.id,
          });
        }
      });
      return listData;
    },
    [calendars]
  );

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Alert
              className="py-1 px-2"
              type={item.type as AlertProps["type"]}
              message={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const toggleModal = useCallback(
    () => setIsModalVisible((prev) => !prev),
    [isModalVisible]
  );

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    const events = getListData(newValue);
    setModalData({ date: newValue, events });
    toggleModal();
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
    $selectedMonth(dayjs(newValue).format(yearMonthDate));
  };

  const handleModalOk = () => {
    toggleModal();
  };

  const handleModalCancel = () => {
    toggleModal();
  };

  const handleAddClick = () => {
    setShowInput(true);
  };

  const renderModal = useMemo(() => {
    return (
      <ul>
        {!!modalData?.events?.length ? (
          modalData.events.map((event: any) => (
            <li key={event.content}>
              <Alert
                className="py-1 px-2"
                closable
                onClose={() => handleDelete(event.id)}
                type={event.type as AlertProps["type"]}
                message={event.content}
              />
            </li>
          ))
        ) : (
          <Empty description={t("empty_list")} />
        )}
      </ul>
    );
  }, [modalData?.events, showInput]);

  useEffect(() => {
    return () => {
      setShowInput(false);
    };
  }, []);

  if (isLoading) return <Loading />;

  return (
    <ConfigProvider locale={ruRU}>
      <Container>
        <Alert
          message={
            t("selected_date") + ` ${modalData?.date?.format("YYYY-MM-DD")}`
          }
        />
        <Calendar
          className="p-4"
          value={value}
          cellRender={cellRender}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
        />
        <Modal
          title={t("cleanings_on") + ` ${modalData.date.format("YYYY-MM-DD")}`}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          footer={[
            <Button
              key="add"
              disabled={showInput}
              type="dashed"
              className="bg-primary text-white"
              onClick={handleAddClick}
            >
              {t("add")}
            </Button>,
            <Button
              key="ok"
              type="dashed"
              className="bg-invBtn"
              onClick={handleModalOk}
            >
              OK
            </Button>,
          ]}
        >
          {renderModal}
          {showInput && (
            <CalendarInput
              closeModal={() => {
                toggleModal();
                setShowInput(false);
              }}
              selectedDate={dayjs(modalData.date).format(yearMonthDate)}
              selectedMonth={selectedMonth}
            />
          )}
        </Modal>
      </Container>
    </ConfigProvider>
  );
};

export default Cleaning;
