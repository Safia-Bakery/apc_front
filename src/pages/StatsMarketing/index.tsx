import Card from "src/components/Card";
import Header from "src/components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useNavigateParams } from "src/hooks/custom/useCustomNavigate";
import dayjs from "dayjs";
import useQueryString from "src/hooks/custom/useQueryString";
import { useForm } from "react-hook-form";
import cl from "classnames";
import { useEffect } from "react";
import StatBar from "src/components/StatBar";

const routesArr = [
  {
    name: "Отчет по направлениям",
    url: "department",
  },
  {
    name: "По категориям",
    url: "category",
  },
];

const StatsMarketing = () => {
  const navigate = useNavigate();
  const start =
    useQueryString("start") || dayjs().startOf("month").format("YYYY-MM-DD");
  const end = useQueryString("end") || dayjs().format("YYYY-MM-DD");
  const goBack = () => navigate(-1);
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
    <Card>
      <Header title={"Статистика Маркетинг"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>

        <button className="btn btn-success btn-fill ml-2" id="export_to_excell">
          Экспорт в Excel
        </button>
      </Header>

      <div className="content">
        <div className={"flex w-min gap-3 mb-4"}>
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
            onClick={handleDate}
          >
            Показать
          </button>
        </div>

        <div className="table-responsive grid-view">
          <StatBar arr={routesArr} />
          <Outlet />
        </div>
      </div>
    </Card>
  );
};

export default StatsMarketing;
