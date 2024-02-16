import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import { RequestStatus } from "@/utils/types";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const column = [
  { name: "№" },
  { name: "action" },
  { name: "employee" },
  { name: "date" },
  { name: "minute" },
];

const commentColumn = [
  { name: "№" },
  { name: "commentt" },
  { name: "employee" },
  { name: "date" },
];

const Logs = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const handleNavigate = () => navigate(-1);

  const { data: order, isLoading } = useOrder({ id: Number(id) });

  const renderComments = useMemo(() => {
    if (order?.communication?.length)
      return (
        <Card>
          <div className="table-responsive grid-view content">
            <Header title={"comments"} />
            <table className="table table-hover">
              <thead>
                <tr>
                  {commentColumn.map(({ name }) => (
                    <th className={"bg-primary  text-white"} key={name}>
                      {t(name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order?.communication.map((item, idx) => (
                  <tr>
                    <td width={40}>{idx + 1}</td>
                    <td>{item.message}</td>
                    <td>{item.user.full_name}</td>
                    <td>{dayjs(item.created_at).format("DD.MM.YYYY HH:mm")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      );
  }, [order?.communication]);

  if (isLoading) return <Loading absolute />;

  return (
    <>
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
                  <th className={"bg-primary  text-white"} key={name}>
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
                <td>{"assignation"}</td>
                <td>{order?.user_manager}</td>
                <td>
                  {order?.update_time?.[RequestStatus.confirmed]
                    ? dayjs(
                        order?.update_time?.[RequestStatus.confirmed]
                      ).format("DD.MM.YYYY HH:mm")
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
                      )
                    : t("not_given")}
                </td>
              </tr>

              <tr className="bg-blue">
                <td width="40">3</td>
                <td>{t("finishing")}</td>
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
                    order?.update_time?.[RequestStatus.confirmed],
                    "minutes"
                  ) && order?.update_time?.[RequestStatus.done]
                    ? `${dayjs(order?.update_time?.[RequestStatus.done]).diff(
                        order?.update_time?.[RequestStatus.confirmed],
                        "minutes"
                      )} (${dayjs(
                        order?.update_time?.[RequestStatus.done]
                      ).diff(
                        order?.update_time?.[RequestStatus.confirmed],
                        "hours"
                      )} ${t("hours")})`
                    : t("not_given")}
                </td>
              </tr>
              <tr className="bg-blue">
                <td width="40">4</td>
                <td>{t("cancelation")}</td>
                <td>{order?.user_manager}</td>
                <td>
                  {order?.update_time?.[RequestStatus.rejected]
                    ? dayjs(
                        order?.update_time?.[RequestStatus.rejected]
                      ).format("DD.MM.YYYY HH:mm")
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
              {order?.update_time?.[RequestStatus.paused] && (
                <tr className="bg-blue">
                  <td width="40">5</td>
                  <td>{t("paused")}</td>
                  <td>{order?.user_manager}</td>
                  <td>
                    {order?.update_time?.[RequestStatus.paused]
                      ? dayjs(
                          order?.update_time?.[RequestStatus.paused]
                        ).format("DD.MM.YYYY HH:mm")
                      : t("not_given")}
                  </td>
                  <td>
                    {!!dayjs(
                      order?.update_time?.[RequestStatus.confirmed]
                    ).diff(
                      order?.update_time?.[RequestStatus.paused],
                      "minutes"
                    ) && order?.update_time?.[RequestStatus.paused]
                      ? dayjs(
                          order?.update_time?.[RequestStatus.confirmed]
                        ).diff(
                          order?.update_time?.[RequestStatus.paused],
                          "minutes"
                        )
                      : t("not_given")}
                  </td>
                </tr>
              )}
              {order?.update_time?.[RequestStatus.solved] && (
                <tr className="bg-blue">
                  <td width="40">6</td>
                  <td>{t("finished")}</td>
                  <td>{order?.user_manager}</td>
                  <td>
                    {order?.update_time?.[RequestStatus.solved]
                      ? dayjs(
                          order?.update_time?.[RequestStatus.solved]
                        ).format("DD.MM.YYYY HH:mm")
                      : t("not_given")}
                  </td>
                  <td>{t("not_given")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {renderComments}
    </>
  );
};

export default Logs;
