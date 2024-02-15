import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import { RequestStatus } from "@/utils/types";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№" },
  { name: "action" },
  { name: "employee" },
  { name: "date" },
  { name: "duration" },
];

const LogysticsLogs = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const handleNavigate = () => navigate(-1);

  const { data: order, isLoading } = useOrder({ id: Number(id) });

  if (isLoading) return <Loading absolute />;
  return (
    <Card>
      <Header title={"logs"}>
        <button onClick={handleNavigate} className="btn btn-primary btn-fill">
          {t("back")}
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <table className="table table-hover">
          <thead>
            <tr>
              {column.map(({ name }) => (
                <th className={"bg-primary text-white"} key={name}>
                  {t(name)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="bg-blue">
              <td width="40">1</td>
              <td>{t("receipt_request")}</td>
              <td>{order?.is_bot ? t("tg_bot") : t("web_site")}</td>
              <td>
                {order?.update_time?.[RequestStatus.new]
                  ? dayjs(order?.update_time?.[RequestStatus.new]).format(
                      "DD.MM.YYYY HH:mm"
                    )
                  : t("not_given")}
              </td>
              <td>-------</td>
            </tr>
            <tr className="bg-blue">
              <td width="40">2</td>
              <td>{t("received_for_work")}</td>
              <td>{order?.user_manager}</td>
              <td>
                {order?.update_time?.[RequestStatus.confirmed]
                  ? dayjs(order?.update_time?.[RequestStatus.confirmed]).format(
                      "DD.MM.YYYY HH:mm"
                    )
                  : t("not_given")}
              </td>
              <td>
                {!!dayjs(order?.update_time?.[RequestStatus.confirmed]).diff(
                  order?.update_time?.[RequestStatus.new],
                  "minutes"
                )
                  ? dayjs(order?.update_time?.[RequestStatus.confirmed]).diff(
                      order?.update_time?.[RequestStatus.new],
                      "minutes"
                    ) + " минута"
                  : t("not_given")}
              </td>
            </tr>

            <tr className="bg-blue">
              <td width="40">3</td>
              <td>Отправлен в путь</td>
              <td>{order?.user_manager}</td>
              <td>
                {order?.update_time?.[RequestStatus.sendToRepair]
                  ? dayjs(
                      order?.update_time?.[RequestStatus.sendToRepair]
                    ).format("DD.MM.YYYY HH:mm")
                  : t("not_given")}
              </td>
              <td>
                {!!dayjs(order?.update_time?.[RequestStatus.sendToRepair]).diff(
                  order?.update_time?.[RequestStatus.confirmed],
                  "hours"
                )
                  ? dayjs(
                      order?.update_time?.[RequestStatus.sendToRepair]
                    ).diff(
                      order?.update_time?.[RequestStatus.confirmed],
                      "hours"
                    ) + t("hours")
                  : t("not_given")}
              </td>
            </tr>
            <tr className="bg-blue">
              <td width="40">4</td>
              <td>Завершение</td>
              <td>{order?.brigada?.name}</td>
              <td>
                {order?.update_time?.[RequestStatus.done]
                  ? dayjs(order?.update_time?.[RequestStatus.done]).format(
                      "DD.MM.YYYY HH:mm"
                    )
                  : t("not_given")}
              </td>
              <td>
                {!!dayjs(order?.update_time?.[RequestStatus.done]).diff(
                  order?.update_time?.[RequestStatus.sendToRepair],
                  "hours"
                )
                  ? dayjs(order?.update_time?.[RequestStatus.done]).diff(
                      order?.update_time?.[RequestStatus.sendToRepair],
                      "hours"
                    ) + ` ${t("hours")}`
                  : t("not_given")}
              </td>
            </tr>
            <tr className="bg-blue">
              <td width="40">5</td>
              <td>Отмена</td>
              <td>{order?.user_manager}</td>
              <td>
                {order?.update_time?.[RequestStatus.rejected]
                  ? dayjs(order?.update_time?.[RequestStatus.rejected]).format(
                      "DD.MM.YYYY HH:mm"
                    )
                  : t("not_given")}
              </td>
              <td>
                {!!dayjs(order?.update_time?.[RequestStatus.confirmed]).diff(
                  order?.update_time?.[RequestStatus.rejected],
                  "minutes"
                ) && order?.update_time?.[RequestStatus.rejected]
                  ? dayjs(order?.update_time?.[RequestStatus.confirmed]).diff(
                      order?.update_time?.[RequestStatus.rejected],
                      "minutes"
                    )
                  : t("not_given")}
              </td>
            </tr>
            <tr className="bg-blue">
              <td width="40">6</td>
              <td>Время поставки</td>
              <td>{order?.user_manager}</td>
              <td>
                {order?.arrival_date
                  ? dayjs(order?.arrival_date).format("DD.MM.YYYY HH:mm")
                  : t("not_given")}
              </td>
              <td>Не задано</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LogysticsLogs;
