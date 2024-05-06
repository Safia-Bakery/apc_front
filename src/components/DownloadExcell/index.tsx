import { useForm } from "react-hook-form";
import cl from "classnames";
import { useState } from "react";
import useQueryString from "@/hooks/custom/useQueryString";
import ITExcellMutation from "@/hooks/mutation/ITExcell";
import { useTranslation } from "react-i18next";
import Loading from "../Loader";
import useBackExcel from "@/hooks/custom/useBackExcel";

const DownloadExcell = () => {
  const { t } = useTranslation();
  const [active, $active] = useState(false);
  const request_status = Number(useQueryString("request_status"));
  const { register, getValues } = useForm();

  const { mutate, isPending } = ITExcellMutation();

  const handleActive = () => {
    if (active) {
      const { start_date, finish_date } = getValues();
      mutate(
        {
          start_date,
          finish_date,
          ...(!!request_status && { status: request_status }),
        },
        {
          onSuccess: (data) => {
            if (data.file_name) useBackExcel(data.file_name);
          },
        }
      );
    } else $active((prev) => !prev);
  };

  return (
    <form className="flex gap-2">
      <div
        className={cl("flex gap-2 opacity-0 transition-opacity", {
          ["opacity-100"]: active,
        })}
      >
        <input
          type="date"
          className="form-control"
          {...register("start_date")}
        />
        <input
          type="date"
          className="form-control"
          {...register("finish_date")}
        />
      </div>
      <button
        className="btn btn-primary mr-2"
        type="button"
        onClick={handleActive}
      >
        {t("export_to_excel")}
      </button>

      {isPending && <Loading />}
    </form>
  );
};

export default DownloadExcell;
