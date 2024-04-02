import { useNavigateParams } from "custom/useCustomNavigate";
import dayjs from "dayjs";
import useQueryString from "custom/useQueryString";
import { useForm } from "react-hook-form";
import cl from "classnames";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { yearMonthDate } from "@/utils/keys";

const DateRangeBlock = () => {
  const { t } = useTranslation();
  const start =
    useQueryString("start") || dayjs().startOf("month").format(yearMonthDate);
  const end = useQueryString("end") || dayjs().format(yearMonthDate);
  const navigateParams = useNavigateParams();
  const { register, getValues, reset, setValue } = useForm();

  const handleDate = () => {
    const { end, start } = getValues();
    navigateParams({
      end: dayjs(end).format(yearMonthDate),
      start: dayjs(start).format(yearMonthDate),
    });
  };

  useEffect(() => {
    if (end || start)
      reset({
        end,
        start,
      });
    else {
      setValue("end", undefined);
      setValue("start", undefined);
    }
  }, [end, start]);

  return (
    <form className="flex w-min gap-3 mb-4">
      <input
        type="date"
        className="form-group form-control"
        {...register("start")}
      />
      <input
        type="date"
        className="form-group form-control"
        {...register("end")}
      />
      <button
        className={cl("btn btn-primary   h-[40px]")}
        type="button"
        onClick={handleDate}
      >
        {t("show")}
      </button>
    </form>
  );
};

export default DateRangeBlock;
