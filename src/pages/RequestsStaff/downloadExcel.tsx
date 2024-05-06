import Loading from "@/components/Loader";
import useBackExcel from "@/hooks/custom/useBackExcel";
import useQueryString from "@/hooks/custom/useQueryString";
import useStaffExcell from "@/hooks/useStaffExcell";
import { yearMonthDate } from "@/utils/keys";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const today = new Date();
const tomorrow = today.setDate(today.getDate() + 1);

const DownloadExcel = () => {
  const { t } = useTranslation();
  const [excelFile, $excelFile] = useState(false);
  const arrival_date = useQueryString("arrival_date");

  const {
    data: totals,
    isFetching: excellFtching,
    isLoading: excellLoading,
  } = useStaffExcell({
    date: dayjs(!!arrival_date ? arrival_date : tomorrow).format(yearMonthDate),
    file: excelFile,
  });

  const handleExcell = () => $excelFile(true);

  useEffect(() => {
    if (excelFile && totals?.url) useBackExcel(totals.url);
  }, [excelFile, totals?.url]);

  if (excellFtching || excellLoading) return <Loading />;

  return (
    <button className="btn btn-success" onClick={handleExcell}>
      {t("export_to_excel")}
    </button>
  );
};

export default DownloadExcel;
