import Card from "@/components/Card";
import Header from "@/components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import StatBar from "@/components/StatBar";
import DateRangeBlock from "@/components/DateRangeBlock";

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
  const goBack = () => navigate(-1);

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
        <DateRangeBlock />

        <div className="table-responsive grid-view">
          <StatBar arr={routesArr} />
          <Outlet />
        </div>
      </div>
    </Card>
  );
};

export default StatisticsApc;
