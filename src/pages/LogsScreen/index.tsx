import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import { RequestStatus } from "@/utils/types";
import Loading from "@/components/Loader";

const column = [
  { name: "№" },
  { name: "Действие" },
  { name: "Сотрудник" },
  { name: "Дата" },
  { name: "Минут" },
];

const Logs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleNavigate = () => navigate(-1);

  const { data: order, isLoading } = useOrder({ id: Number(id) });

  if (isLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title={"Логи"}>
        <button onClick={handleNavigate} className="btn btn-primary btn-fill">
          Назад
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <table className="table table-hover">
          <thead>
            <tr>
              {column.map(({ name }) => (
                <th className={"bg-primary  text-white"} key={name}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="bg-blue">
              <td width="40">1</td>
              <td>Поступление заявки</td>
              <td>{order?.is_bot ? "Телеграм-бот" : "Веб-сайт"}</td>
              <td>
                {order?.update_time?.[RequestStatus.new]
                  ? dayjs(order?.update_time?.[RequestStatus.new]).format(
                      "DD.MM.YYYY HH:mm"
                    )
                  : "Не задано"}
              </td>
              <td>-------</td>
            </tr>
            <tr className="bg-blue">
              <td width="40">2</td>
              <td>Назначение</td>
              <td>{order?.user_manager}</td>
              <td>
                {order?.update_time?.[RequestStatus.confirmed]
                  ? dayjs(order?.update_time?.[RequestStatus.confirmed]).format(
                      "DD.MM.YYYY HH:mm"
                    )
                  : "Не задано"}
              </td>
              <td>
                {!!dayjs(order?.update_time?.[RequestStatus.confirmed]).diff(
                  order?.update_time?.[RequestStatus.new],
                  "minutes"
                )
                  ? dayjs(order?.update_time?.[RequestStatus.confirmed]).diff(
                      order?.update_time?.[RequestStatus.new],
                      "minutes"
                    )
                  : "Не задано"}
              </td>
            </tr>

            <tr className="bg-blue">
              <td width="40">3</td>
              <td>Завершение</td>
              <td>{order?.brigada?.name}</td>
              <td>
                {order?.update_time?.[RequestStatus.done]
                  ? dayjs(order?.update_time?.[RequestStatus.done]).format(
                      "DD.MM.YYYY HH:mm"
                    )
                  : "Не задано"}
              </td>
              <td>
                {!!dayjs(order?.update_time?.[RequestStatus.done]).diff(
                  order?.update_time?.[RequestStatus.confirmed],
                  "minutes"
                ) && order?.update_time?.[RequestStatus.done]
                  ? `${dayjs(order?.update_time?.[RequestStatus.done]).diff(
                      order?.update_time?.[RequestStatus.confirmed],
                      "minutes"
                    )} (${dayjs(order?.update_time?.[RequestStatus.done]).diff(
                      order?.update_time?.[RequestStatus.confirmed],
                      "hours"
                    )} часов)`
                  : "Не задано"}
              </td>
            </tr>
            <tr className="bg-blue">
              <td width="40">4</td>
              <td>Отмена</td>
              <td>{order?.user_manager}</td>
              <td>
                {order?.update_time?.[RequestStatus.rejected]
                  ? dayjs(order?.update_time?.[RequestStatus.rejected]).format(
                      "DD.MM.YYYY HH:mm"
                    )
                  : "Не задано"}
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
                  : "Не задано"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Logs;
