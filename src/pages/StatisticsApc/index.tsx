import Card from "@/components/Card";
import styles from "./index.module.scss";
import Header from "@/components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useNavigateParams } from "custom/useCustomNavigate";
import dayjs from "dayjs";
import useQueryString from "custom/useQueryString";
import { useForm } from "react-hook-form";
import cl from "classnames";
import { useEffect } from "react";
import StatBar from "@/components/StatBar";

const routesArr = [
  {
    name: "По категориям",
    url: "category",
  },
  {
    name: "По филиалам",
    url: "fillial",
  },
  {
    name: "По бригадам",
    url: "brigada",
  },
  {
    name: "Бригады по категориям",
    url: "brigade_categ",
  },
  {
    name: "По расходам",
    url: "consumptions",
  },
];

const StatisticsApc = () => {
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
      <Header title={"Статистика"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>

        <button className="btn btn-success btn-fill ml-2" id="export_to_excell">
          Экспорт в Excel
        </button>
      </Header>

      <div className="content">
        <div className={styles.dateBlock}>
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
            className={cl("btn btn-primary btn-fill", styles.btn)}
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

export default StatisticsApc;
