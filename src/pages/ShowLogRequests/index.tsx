import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { baseURL } from "@/store/baseUrl";
import {
  LogyticsStatusObj,
  detectFileType,
  isValidHttpUrl,
} from "@/utils/helpers";
import {
  Departments,
  FileType,
  ModalTypes,
  RequestStatus,
} from "@/utils/types";
import { useForm } from "react-hook-form";
import ShowRequestModals from "@/components/ShowRequestModals";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import cl from "classnames";
import Loading from "@/components/Loader";
import useQueryString from "@/hooks/custom/useQueryString";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";

const ShowLogRequests = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigateParams = useNavigateParams();
  const modal = Number(useQueryString("modal"));
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attaching } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const { getValues } = useForm();
  const {
    data: order,
    refetch: orderRefetch,
    isLoading,
  } = useOrder({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const navigate = useNavigate();

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      navigateParams({ modal: ModalTypes.showPhoto, photo: file });
    }
  };

  const handleBack = () => navigate("/requests-logystics");

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
          onError: (e) => errorToast(e.message),
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
            className="btn btn-danger   mr-2"
          >
            {t("deny")}
          </button>
          <button
            onClick={handleBrigada({ status: RequestStatus.received })}
            className="btn btn-success  "
            id="recieve_request"
          >
            {t("receive_to_work")}
          </button>
        </div>
      );
    else
      return (
        <div className="float-end mb10">
          {order?.status! < 2 && (
            <button
              onClick={handleModal(ModalTypes.cars)}
              className="btn btn-warning   mr-2"
            >
              {t("send_to_way")}
            </button>
          )}
          {order?.status! < 3 && (
            <button
              onClick={handleBrigada({ status: RequestStatus.finished })}
              className="btn btn-success  "
            >
              {t("finish")}
            </button>
          )}
        </div>
      );
  }, [order?.status]);

  const renderModals = useMemo(() => {
    if (
      !!order?.status.toString() &&
      (order?.status < RequestStatus.finished || modal === ModalTypes.showPhoto)
    )
      return <ShowRequestModals />;
  }, [order?.status, modal]);

  useEffect(() => {
    orderRefetch();
    window.scrollTo(0, 0);
  }, []);

  if (attaching || isLoading) return <Loading />;

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`${t("order")} №${id}`}
          subTitle={`${t("status")}: ${
            order?.status.toString() && t(LogyticsStatusObj[order?.status])
          }`}
        >
          <button
            className="btn btn-warning mr-2"
            onClick={() => navigate(`/request/logs/${id}`)}
          >
            {t("logs")}
          </button>
          <button onClick={handleBack} className="btn btn-primary">
            {t("back")}
          </button>
        </Header>
        <div className="content">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-striped table-bordered detail-view">
                <tbody>
                  <tr>
                    <th>{t("client")}</th>
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
                    <td>{t(Departments[order?.category?.department!])}</td>
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
                    <th>{t("file")}</th>
                    <td className="flex flex-col !border-none">
                      {order?.file?.map((item, index) => {
                        if (item.status === 0)
                          return (
                            <div
                              className={cl(
                                "text-link cursor-pointer max-w-[150px] w-full text-truncate"
                              )}
                              onClick={handleShowPhoto(
                                `${baseURL}/${item.url}`
                              )}
                              key={item.url + index}
                            >
                              {t("file")} - {index + 1}
                            </div>
                          );
                      })}
                    </td>
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
                  {order?.location?.to_loc && (
                    <tr>
                      <th>{t("to_where")}</th>
                      <td>
                        {isValidHttpUrl(order?.location?.to_loc) ? (
                          <Link to={order?.location?.to_loc} target="_blank">
                            {order?.location?.to_loc}
                          </Link>
                        ) : (
                          order?.location?.to_loc
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
                    <th>{t("urgent")}</th>
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
                    <th>{t("receipt_date")}:</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("changed_date")}:</th>
                    <td>
                      {order?.started_at
                        ? dayjs(order?.started_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("completion_date")}:</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("delivery_date")}:</th>
                    <td>
                      {order?.arrival_date
                        ? dayjs(order?.arrival_date).format(dateTimeFormat)
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

      {renderModals}
    </>
  );
};

export default ShowLogRequests;
