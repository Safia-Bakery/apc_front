import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import { errorToast, successToast } from "@/utils/toast";
import {
  handleDepartment,
  handleStatus,
  isValidHttpUrl,
} from "@/utils/helpers";
import { Departments, ModalTypes, RequestStatus } from "@/utils/types";
import { useForm } from "react-hook-form";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import { useTranslation } from "react-i18next";

const ShowRequestStaff = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const { getValues } = useForm();
  const { data: order, refetch: orderRefetch } = useOrder({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const navigate = useNavigate();

  const handleBack = () => navigate("/requests-staff");

  const handleBrigada =
    ({ status }: { status: RequestStatus }) =>
    () => {
      attach(
        {
          request_id: Number(id),
          status,
          deny_reason: getValues("cancel_reason"),
        },
        {
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e: any) => errorToast(e.message),
        }
      );
      removeParams(["modal"]);
    };

  const renderBtns = useMemo(() => {
    if (isNew)
      return (
        <div className="float-end mb10">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger btn-fill mr-2"
          >
            {t("deny")}
          </button>
          <button
            onClick={handleBrigada({ status: RequestStatus.confirmed })}
            className="btn btn-success btn-fill"
            id="recieve_request"
          >
            {t("receive")}
          </button>
        </div>
      );
    if (order?.status && order?.status < RequestStatus.done)
      return (
        <div className="float-end mb10">
          <button
            onClick={handleBrigada({ status: RequestStatus.done })}
            className="btn btn-success btn-fill"
          >
            {t("finish")}
          </button>
        </div>
      );
  }, [order?.status]);

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`${t("order")} №${id}`}
          subTitle={`${t("status")}: ${t(
            handleStatus({
              status: order?.status,
              dep: Departments.staff,
            })
          )}`}
        >
          <button
            className="btn btn-warning btn-fill mr-2"
            onClick={() => navigate(`/request/logs/${id}`)}
          >
            {t("logs")}
          </button>
          <button onClick={handleBack} className="btn btn-primary btn-fill">
            {t("back")}
          </button>
        </Header>
        <div className="content">
          <div className="row">
            <div className="col-md-6">
              <table
                id="w0"
                className="table table-striped table-bordered detail-view"
              >
                <tbody>
                  <tr>
                    <th className="w-1/3">{t("client")}</th>
                    <td>{order?.user?.full_name}</td>
                  </tr>
                  <tr>
                    <th>{t("phone_number")}</th>
                    <td>
                      <a href={`tel:+${order?.user?.phone_number}`}>
                        +{order?.user?.phone_number}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>{t("type")}</th>
                    <td>
                      {t(
                        handleDepartment({
                          ...(!!order?.category?.sub_id
                            ? { sub: order?.category?.sub_id }
                            : { dep: order?.category?.department }),
                        })
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("group_problem")}</th>
                    <td>{order?.category?.name}</td>
                  </tr>
                  <tr>
                    <th>{t("department")}</th>
                    <td>{order?.fillial?.parentfillial?.name}</td>
                  </tr>
                  <tr>
                    <th>{t("comment")}</th>
                    <td>{order?.description}</td>
                  </tr>
                  {order?.location?.from_loc && (
                    <tr>
                      <th>{t("from_where")}</th>
                      <td>
                        {isValidHttpUrl(order?.location?.from_loc) ? (
                          <Link to={order?.location?.from_loc} target="_blank">
                            {order?.location?.from_loc}
                          </Link>
                        ) : (
                          order?.location?.from_loc
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <table
                id="w1"
                className="table table-striped table-bordered detail-view"
              >
                <tbody>
                  <tr>
                    <th className="w-1/3">{t("urgent")}</th>
                    <td>{!order?.category?.urgent ? "Нет" : "Да"}</td>
                  </tr>
                  <tr>
                    <th>{t("changed")}</th>
                    <td>
                      {!!order?.user_manager
                        ? order?.user_manager
                        : t("not_given")}
                    </td>
                  </tr>

                  <tr>
                    <th>{t("receip_date")}:</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("changed_date")}:</th>
                    <td>
                      {order?.started_at
                        ? dayjs(order?.started_at).format("DD.MM.YYYY HH:mm")
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("completion_date")}:</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format("DD.MM.YYYY HH:mm")
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("delivery_date")}:</th>
                    <td>
                      {order?.arrival_date
                        ? dayjs(order?.arrival_date).format("DD.MM.YYYY HH:mm")
                        : t("not_given")}
                    </td>
                  </tr>
                  {!!order?.cars?.name && (
                    <tr>
                      <th>{t("assigned_truck")}</th>
                      <td>{order?.cars?.name}</td>
                    </tr>
                  )}
                  {order?.deny_reason && (
                    <tr>
                      <th className="font-bold">{t("deny_reason")}</th>
                      <td>{order?.deny_reason}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          {renderBtns}
        </div>
      </Card>
    </>
  );
};

export default ShowRequestStaff;
