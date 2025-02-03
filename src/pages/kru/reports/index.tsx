import AntBranchSelect from "@/components/AntBranchSelect";
import BaseInput from "@/components/BaseInputs";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import useBackExcel from "@/hooks/custom/useBackExcel";
import useDebounce from "@/hooks/custom/useDebounce";
import { kruDownloadReports, useKruCategories, useKruTools } from "@/hooks/kru";
import errorToast from "@/utils/errorToast";
import { yearMonthDate } from "@/utils/keys";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const { RangePicker } = DatePicker;
const currentDate = dayjs();

// First day of the current month
const firstDayOfMonth = dayjs().startOf("month");
const showBranch = [1, 3];
const showCode = [1, 2];

const KruReports = () => {
  const [report_type, $report_type] = useState<string>();
  const [branch, $branch] = useState<string>();
  const [tool_name, $tool_name] = useDebounce("");
  const [product_code, $product_code] = useState<string>();
  const [selected_category, $selected_category] = useState<string>();
  const [product_name, $product_name] = useState<string>();
  const [answer, $answer] = useState<string>();
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [startDate, endDate] = dateRange;

  const handleSelect = (item: KruTool | undefined) => {
    $product_code(item?.code);
    $product_name(item?.name);
  };

  const { data: categories, isLoading } = useKruCategories({
    page: 1,
  });

  const { mutate, isPending: downloading } = kruDownloadReports();
  const handleDownload = () => {
    mutate(
      {
        report_type: Number(report_type),
        category_id: Number(selected_category),
        ...(!!startDate && {
          start_date: dayjs(startDate).format(yearMonthDate),
        }),
        ...(!!endDate && { finish_date: dayjs(endDate).format(yearMonthDate) }),
        ...(branch && { branch_id: branch }),
        ...(product_code && { product_code }),
        ...(product_name && { product_name }),
        ...(answer && { answer }),
      },
      {
        onSuccess: (data) => {
          useBackExcel(data.file_name);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const { data: tool_item, isPending } = useKruTools({
    enabled: !!tool_name,
    tool_name,
  });

  if (isLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Загрузить отчеты"} />

      <div className="table-responsive content">
        <BaseInput label="Выберите категорию">
          <Select
            className="w-full flex"
            placeholder="Выберите категорию"
            fieldNames={{ label: "name", value: "id" }}
            onChange={(e) => $selected_category(e)}
            options={categories?.items}
          />
        </BaseInput>
        <BaseInput label="Тип отчёта">
          <Select
            className="w-full flex"
            placeholder="Выберите тип отчёта"
            onChange={(e) => $report_type(e)}
            options={[
              { value: "1", label: "Супер отчёт" },
              { value: "2", label: "Задачи | Вопросы" },
              { value: "3", label: "Выполнение" },
            ]}
          />
        </BaseInput>

        {/* {showBranch.includes(Number(report_type)) && (
          <BaseInput label="Выберите филиал">
            <AntBranchSelect onChange={(e) => $branch(e)} />
          </BaseInput>
        )}

        {showCode.includes(Number(report_type)) && (
          <BaseInput label="Выберите продукт">
            <Select
              loading={isPending}
              showSearch
              onSearch={(e) => $tool_name(e)}
              allowClear
              onClear={() => handleSelect(undefined)}
              className="flex"
              fieldNames={{ label: "name", value: "name" }}
              placeholder="Введите текст для поиска..."
              options={tool_item?.tools}
              onSelect={(e, r) => handleSelect(r)}
              // value={selected_tools}
            />
          </BaseInput>
        )}

        {report_type === "1" && (
          <BaseInput label="Причина">
            <Select
              className="w-full flex"
              allowClear
              onClear={() => $answer(undefined)}
              placeholder="Выберите причину"
              onChange={(e) => $answer(e)}
              options={[
                { value: "Привезли", label: "Привезли" },
                { value: "Мало привезли", label: "Мало привезли" },
                { value: "Не привезли", label: "Не привезли" },
                { value: "Продали", label: "Продали" },
              ]}
            />
          </BaseInput>
        )} */}

        {/* {showBranch.includes(Number(report_type)) && ( */}
        <BaseInput label="Выберите Дату">
          <RangePicker
            defaultValue={[
              dayjs(currentDate, yearMonthDate),
              dayjs(firstDayOfMonth, yearMonthDate),
            ]}
            className="flex w-96"
            format={yearMonthDate}
            onChange={(e, r) => setDateRange(r)}
          />
        </BaseInput>
        {/* )} */}

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn btn-success"
        >
          Загрузить
        </button>
      </div>
    </Card>
  );
};

export default KruReports;
