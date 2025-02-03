import Top50Header from "../../components/header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Select } from "antd";
import BaseInput from "@/components/BaseInputs";
import ReactDatePicker from "react-datepicker";
import { useRef, useState } from "react";
import AntBranchSelect from "@/components/AntBranchSelect";
import { kruDownloadReports, useKruTools } from "@/hooks/kru";
import useDebounce from "@/hooks/custom/useDebounce";
import errorToast from "@/utils/errorToast";
import dayjs from "dayjs";
import { yearMonthDate } from "@/utils/keys";
import useBackExcel from "@/hooks/custom/useBackExcel";

const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

const showBranch = [1, 3];
const showCode = [1, 2];

const Top50Reports = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const startRef = useRef<any>(null);
  const [report_type, $report_type] = useState<string>();
  const [branch, $branch] = useState<string>();
  const [tool_name, $tool_name] = useDebounce("");
  const [product_code, $product_code] = useState<string>();
  const [product_name, $product_name] = useState<string>();
  const [answer, $answer] = useState<string>();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    firstDay,
    date,
  ]);
  const [startDate, endDate] = dateRange;

  const handleSelect = (item: KruTool | undefined) => {
    $product_code(item?.code);
    $product_name(item?.name);
  };

  const { mutate, isPending: downloading } = kruDownloadReports();
  const handleDownload = () => {
    mutate(
      {
        report_type: Number(report_type),
        category_id: Number(id),
        ...(startDate && {
          start_date: dayjs(startDate).format(yearMonthDate),
        }),
        ...(endDate && { finish_date: dayjs(endDate).format(yearMonthDate) }),
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
  return (
    <>
      <Top50Header />
      <h1 className="w-full py-5 bg-[#F2F2F2] text-center text-base">
        Загрузить отчеты
      </h1>
      <WebAppContainer className="pt-0 ">
        <div className=""></div>
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

        {showBranch.includes(Number(report_type)) && (
          <BaseInput label="Выберите филиал">
            <AntBranchSelect onChange={(e) => $branch(e)} />
          </BaseInput>
        )}

        {showCode.includes(Number(report_type)) && (
          <BaseInput label="Выберите продукт">
            <Select
              loading={isPending}
              showSearch
              allowClear
              onClear={() => handleSelect(undefined)}
              onSearch={(e) => $tool_name(e)}
              className="flex"
              fieldNames={{ label: "name", value: "name" }}
              placeholder="Введите текст для поиска..."
              options={tool_item?.tools}
              onSelect={(_, r) => handleSelect(r)}
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
        )}

        {showBranch.includes(Number(report_type)) && (
          <BaseInput label="Выберите Дату">
            {/* @ts-ignore */}
            <ReactDatePicker
              className="!border mb-6 rounded-lg w-full text-center py-2 !flex flex-1"
              selectsRange
              startDate={startDate}
              wrapperClassName="flex"
              endDate={endDate}
              ref={startRef}
              onChange={(update) => {
                setDateRange(update);
              }}
            />
          </BaseInput>
        )}

        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-[#009D6E] rounded-xl absolute right-2 left-2 bottom-2 text-white h-12"
        >
          Загрузить
        </Button>
      </WebAppContainer>
    </>
  );
};

export default Top50Reports;
