import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";

import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import { useAppSelector } from "@/store/utils/types";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import { errorToast, successToast } from "@/utils/toast";
import { baseURL } from "@/main";
import {
  detectFileType,
  handleDepartment,
  handleStatus,
} from "@/utils/helpers";
import {
  Departments,
  FileType,
  MainPermissions,
  MarketingSubDep,
  ModalTypes,
  RequestStatus,
} from "@/utils/types";
import { useForm } from "react-hook-form";
import ShowRequestModals from "@/components/ShowRequestModals";

import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import cl from "classnames";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";

const ShowMarketingRequest = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const permissions = useAppSelector(permissionSelector);
  const modal = Number(useQueryString("modal"));

  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attaching } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const { getValues } = useForm();
  const {
    data: order,
    refetch: orderRefetch,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrder({ id: Number(id) });

  const isNew = order?.status === RequestStatus.new;
  const edit = Number(useQueryString("edit")) as MainPermissions;
  const sub_id = Number(useQueryString("sub_id"));
  const navigate = useNavigate();

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      navigateParams({ modal: ModalTypes.showPhoto, photo: file });
    }
  };

  const handleBack = () => navigate(`/marketing-${MarketingSubDep[sub_id]}`);

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
    if (permissions?.[edit] && isNew)
      return (
        <div className="float-end mb10">
          <button
            onClick={handleModal(ModalTypes.reassign)}
            className="btn btn-primary  "
          >
            {t("redirect")}
          </button>
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger   mx-2"
          >
            {t("deny")}
          </button>
          <button
            onClick={handleBrigada({ status: RequestStatus.confirmed })}
            className="btn btn-success  "
            id="recieve_request"
          >
            {t("receive")}
          </button>
        </div>
      );

    if (permissions?.[edit])
      return (
        <div className="float-end mb10">
          {order?.status! < RequestStatus.sendToRepair && (
            <button
              onClick={handleBrigada({
                status: RequestStatus.sendToRepair,
              })}
              className="btn btn-warning   mr-2"
            >
              {t("send_to_orderer")}
            </button>
          )}
          {order?.status! < RequestStatus.done && (
            <button
              onClick={handleBrigada({ status: RequestStatus.done })}
              className="btn btn-success  "
            >
              {t("finish")}
            </button>
          )}
        </div>
      );
  }, [permissions, order?.status]);

  const renderModal = useMemo(() => {
    if (
      !!order?.status.toString() &&
      (order?.status < RequestStatus.done || modal === ModalTypes.showPhoto)
    )
      return <ShowRequestModals />;
  }, [order?.status, modal]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (attaching || orderLoading || orderFetching) return <Loading />;

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`${t("order")} №${id}`}
          subTitle={`${t("status")}: ${t(
            handleStatus({
              status: order?.status,
              dep: Departments.marketing,
            })
          )}`}
        >
          <div className="flex gap-2">
            <button
              className="btn btn-warning   "
              onClick={() => navigate(`/request/logs/${id}`)}
            >
              {t("logs")}
            </button>
            {MarketingSubDep[sub_id] && (
              <button onClick={handleBack} className="btn btn-primary  ">
                {t("back")}
              </button>
            )}
          </div>
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
                        }) || ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("group_problem")}</th>
                    <td>
                      {!order?.category?.name}{" "}
                      {order?.is_redirected && (
                        <span className="font-bold"> ({t("has_changed")})</span>
                      )}
                    </td>
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
                    <th>{t("deadline")}</th>
                    <td>
                      {!!order?.category?.ftime
                        ? order?.category.ftime
                        : t("not_given")}
                    </td>
                  </tr>
                  {order?.comments?.[0]?.rating && (
                    <tr>
                      <th className="font-bold">{t("rate_comment")}</th>
                      <td>{order?.comments?.[0]?.rating}</td>
                    </tr>
                  )}
                  {order?.comments?.[0]?.comment && (
                    <tr>
                      <th className="font-bold">{t("commentt")}</th>
                      <td>{order?.comments?.[0]?.comment}</td>
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

      {renderModal}
    </>
  );
};

export default ShowMarketingRequest;
