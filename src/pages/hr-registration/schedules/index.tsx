import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx } from "@/utils/helpers";
import AntdTable from "@/components/AntdTable";
import { ColumnsType } from "antd/es/table";
import { editAddSchedule, getSchedules } from "@/hooks/schedules";
import TableViewBtn from "@/components/TableViewBtn";
import { DatePicker, Popconfirm, TimePicker } from "antd";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { useForm } from "react-hook-form";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import { dateMonthYear, yearMonthDate } from "@/utils/keys";
import errorToast from "@/utils/errorToast";
import AntModal from "@/components/AntModal";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import { MainPermissions } from "@/utils/permissions";

const Schedules = () => {
  const { t } = useTranslation();
  const [selected_date, $selected_date] = useState<dayjs.Dayjs>();
  const [selected_time, $selected_time] = useState<dayjs.Dayjs>();
  const [modal, $modal] = useState(0);
  const permissions = useAppSelector(permissionSelector);
  const { register, getValues, reset, setValue } = useForm();

  const closeModal = () => $modal(0);

  const handleModal = (item: ScheduleRes) => {
    $selected_date(dayjs(item.date));
    if (!!item.time) $selected_time(dayjs(item.time, "HH:mm"));
    setValue("description", item.description);
    $modal(item.id);
  };

  const columns = useMemo<ColumnsType<ScheduleRes>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 60,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("date"),
        dataIndex: "date",
      },
      {
        title: t("time"),
        dataIndex: "time",
        render: (_, record) => record?.time || "Весь день",
      },
      {
        title: t("description"),
        dataIndex: "description",
      },
      {
        title: "",
        render: (_, record) =>
          permissions?.[MainPermissions.edit_hr_schedules] && (
            <TableViewBtn onClick={() => handleModal(record)} />
          ),
        width: 80,
      },
    ],
    []
  );

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
    isRefetching,
    refetch,
  } = getSchedules({});

  const { mutate, isPending } = editAddSchedule();

  const handleAddSchedule = () => {
    const { description } = getValues();
    mutate(
      {
        time: selected_time?.format("HH:mm"),
        date: selected_date?.format(yearMonthDate),
        description,
        id: modal,
      },
      {
        onSuccess: () => {
          refetch();
          $selected_date(undefined);
          $selected_time(undefined);
          reset({});
          if (!!modal) closeModal();
        },
        onError: (e: any) => errorToast(e?.response?.data?.detail || e.message),
      }
    );
  };

  return (
    <Card>
      <Header title={"schedules"}>
        <Popconfirm
          title={
            <div className="flex flex-col">
              <h3>Добавить расписание</h3>
              <BaseInput label="selected_date">
                <DatePicker
                  className="block"
                  onChange={(e) => $selected_date(e)}
                  defaultValue={dayjs()}
                />
              </BaseInput>
              <BaseInput label="selected_time">
                <TimePicker
                  onChange={(e) => $selected_time(e)}
                  format="HH:mm"
                  minuteStep={5}
                  className="block"
                />
              </BaseInput>
              <BaseInput label="description">
                <MainTextArea register={register("description")} />
              </BaseInput>
            </div>
          }
          onConfirm={handleAddSchedule}
          okText={t("yes")}
          cancelText={t("no")}
        >
          {permissions?.[MainPermissions.edit_hr_schedules] && (
            <button className="btn btn-success mr-2">{t("add")}</button>
          )}
        </Popconfirm>
        <button className="btn btn-primary" onClick={() => refetch()}>
          {t("refresh")}
        </button>
      </Header>

      <div className="overflow-x-auto md:overflow-visible content">
        <AntdTable
          sticky
          data={requests}
          columns={columns}
          loading={orderLoading || orderFetching || isRefetching}
        />
      </div>

      <AntModal
        loading={isPending}
        open={!!modal}
        closable
        onCancel={closeModal}
        onOk={handleAddSchedule}
      >
        <div className="flex flex-col">
          <h3>Изменить расписание</h3>
          <BaseInput label="selected_date">
            <DatePicker
              className="block"
              onChange={(e) => $selected_date(e)}
              value={selected_date}
            />
          </BaseInput>
          <BaseInput label="selected_time">
            <TimePicker
              onChange={(e) => $selected_time(e)}
              format="HH:mm"
              value={selected_time}
              minuteStep={5}
              className="block"
            />
          </BaseInput>
          <BaseInput label="description">
            <MainTextArea register={register("description")} />
          </BaseInput>
        </div>
      </AntModal>
    </Card>
  );
};

export default Schedules;
