import Card from "@/components/Card";
import Header from "@/components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import StatBar from "@/components/StatBar";
import DateRangeBlock from "@/components/DateRangeBlock";
import useQueryString from "@/hooks/custom/useQueryString";
import { useTranslation } from "react-i18next";

type RoutesArrType = {
  name: string;
  url: string;
};

interface Props {
  routesArr: RoutesArrType[];
  title: string;
}

const BaseStatsBlock = ({ routesArr, title }: Props) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const sub_title = useQueryString("sub_title");
  const { t } = useTranslation();

  return (
    <Card>
      <Header title={sub_title || t(title)}>
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>

        <button className="btn btn-success ml-2" id="export_to_excell">
          {t("export_to_excel")}
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

export default BaseStatsBlock;
