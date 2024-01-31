import { useNavigateParams } from "custom/useCustomNavigate";
import dayjs from "dayjs";
import useQueryString from "custom/useQueryString";
import { useForm } from "react-hook-form";
import cl from "classnames";
import { useEffect } from "react";

const DateRangeBlock = () => {
  const start =
    useQueryString("start") || dayjs().startOf("month").format("YYYY-MM-DD");
  const end = useQueryString("end") || dayjs().format("YYYY-MM-DD");
  const navigateParams = useNavigateParams();
  const { register, getValues, reset, setValue } = useForm();

  const handleDate = () => {
    const { end, start } = getValues();
    navigateParams({
      end: dayjs(end).format("YYYY-MM-DD"),
      start: dayjs(start).format("YYYY-MM-DD"),
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
        className={cl("btn btn-primary btn-fill h-[40px]")}
        type="button"
        onClick={handleDate}
      >
        Показать
      </button>
    </form>
  );
};

export default DateRangeBlock;
