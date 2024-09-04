import { useState } from "react";
import {
  Alert,
  Calendar,
  Badge,
  CalendarProps,
  BadgeProps,
  Modal,
  Button,
  Select,
  ConfigProvider,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import ruRU from "antd/es/locale/ru_RU";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import Container from "@/components/Container";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";

// Apply the plugins globally
dayjs.extend(weekday);
dayjs.extend(localeData);

const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = [];
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is a warning event." },
        { type: "success", content: "This is a usual event." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is a warning event." },
        { type: "success", content: "This is a usual event." },
        { type: "error", content: "This is an error event." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is a warning event" },
        { type: "success", content: "This is a very long usual event..." },
        { type: "error", content: "This is error event 1." },
        { type: "error", content: "This is error event 2." },
        { type: "error", content: "This is error event 3." },
        { type: "error", content: "This is error event 4." },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const Cleaning = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<Dayjs>(dayjs());
  const [selectedValue, setSelectedValue] = useState<Dayjs>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<{
    date: Dayjs;
    events: { type: string; content: string }[];
  }>({
    date: dayjs(),
    events: [],
  });
  const [showInput, setShowInput] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    // toggleModal();
    setSelectedValue(newValue);

    const events = getListData(newValue);
    // if (events.length) {
    setModalData({ date: newValue, events });
    toggleModal();
    // }
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
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

  const handleSelectChange = (value: string[]) => {
    setSelectedItems(value);
  };

  return (
    <ConfigProvider locale={ruRU}>
      <Container>
        <Alert
          message={
            t("selected_date") + ` ${selectedValue?.format("YYYY-MM-DD")}`
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
            <Button key="add" type="dashed" onClick={handleAddClick}>
              {t("add")}
            </Button>,
            <Button key="ok" type="dashed" onClick={handleModalOk}>
              OK
            </Button>,
          ]}
        >
          <ul>
            {!!modalData?.events?.length ? (
              modalData.events.map((event) => (
                <li key={event.content}>
                  <Badge
                    status={event.type as BadgeProps["status"]}
                    text={event.content}
                  />
                </li>
              ))
            ) : (
              <Empty description={t("empty_list")} />
            )}
          </ul>
          {showInput && (
            <Select
              mode="multiple"
              style={{ width: "100%", marginTop: "16px" }}
              placeholder="Select events"
              onChange={handleSelectChange}
              options={[
                { label: "Meeting", value: "meeting" },
                { label: "Lunch", value: "lunch" },
                { label: "Project Deadline", value: "deadline" },
                { label: "Workshop", value: "workshop" },
              ]}
              value={selectedItems}
            />
          )}
        </Modal>
      </Container>
    </ConfigProvider>
  );
};

export default Cleaning;
