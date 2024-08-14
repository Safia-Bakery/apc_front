import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import { errorToast, successToast } from "@/utils/toast";
import { baseURL } from "@/main";
import { detectFileType } from "@/utils/helpers";
import { FileType, ModalTypes, RequestStatus } from "@/utils/types";
import { useForm } from "react-hook-form";
import ShowRequestModals from "@/components/ShowRequestModals";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import cl from "classnames";
import Loading from "@/components/Loader";
import useQueryString from "@/hooks/custom/useQueryString";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";

const ShowFormRequests = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigateParams = useNavigateParams();
  const modal = Number(useQueryString("modal"));
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attaching } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () =>
    navigateParams({ modal: type });
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
    else navigateParams({ modal: ModalTypes.showPhoto, photo: file });
  };

  const handleBack = () => navigate("/requests-form");

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
            className="btn btn-danger mr-2"
          >
            {t("deny")}
          </button>
          <button
            onClick={handleBrigada({ status: RequestStatus.received })}
            className="btn btn-success"
            id="recieve_request"
          >
            {t("receive")}
          </button>
        </div>
      );
    else
      return (
        <div className="float-end mb10">
          {order?.status! < RequestStatus.finished && (
            <button
              // onClick={handleChangeModal(ModalTypes.changeCateg)}
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
    window.scrollTo(0, 0);
  }, []);

  if (attaching || isLoading) return <Loading />;

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`${t("order")} №${id}`}
          subTitle={`${t("status")}: ${
            order?.status.toString() && t(RequestStatus[order?.status])
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
                    <td className="w-1/2"> {order?.user?.full_name}</td>
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
                    <th>{t("department")}</th>
                    <td>{order?.fillial?.parentfillial?.name}</td>
                  </tr>

                  <tr>
                    <th>{t("event_description")}</th>
                    <td>{order?.description}</td>
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
                    <td className="w-1/2">
                      {!order?.category?.urgent ? "Нет" : "Да"}
                    </td>
                  </tr>

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

export default ShowFormRequests;
