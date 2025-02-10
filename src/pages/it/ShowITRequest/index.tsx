import { FC, useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import dayjs from "dayjs";
import { useAppSelector } from "@/store/utils/types";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { baseURL } from "@/store/baseUrl";
import { detectFileType } from "@/utils/helpers";
import {
  BaseReturnBoolean,
  Departments,
  FileType,
  ModalTypes,
  RequestStatus,
} from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import Loading from "@/components/Loader";
import cl from "classnames";
import { permissionSelector } from "reducers/sidebar";
import AddedProductsIT from "@/components/AddedProductsIT";
import styles from "./index.module.scss";
import TableViewBtn from "@/components/TableViewBtn";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";
import ITModals from "./modals";
import { getItrequest, itRequestMutation } from "@/hooks/it";
import EditCategory from "./edit-category";

const unchangable: BaseReturnBoolean = {
  [RequestStatus.finished]: true,
  [RequestStatus.closed_denied]: true,
};

const unchangableObj: BaseReturnBoolean = {
  [RequestStatus.solved]: true,
  [RequestStatus.denied]: true,
  [RequestStatus.paused]: true,
};

interface Props {
  edit: MainPermissions;
  attaching: MainPermissions;
}

const ShowITRequest: FC<Props> = ({ attaching }) => {
  const { t } = useTranslation();
  const { id, sphere } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const permissions = useAppSelector(permissionSelector);
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attachLoading } = itRequestMutation();

  const closeModal = () => removeParams(["modal"]);

  const {
    data: order,
    refetch: orderRefetch,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = getItrequest({ id: Number(id) });

  const handleModal = (modal: ModalTypes) => () => navigateParams({ modal });

  const handleBack = useCallback(() => {
    navigate(`/requests-it/${sphere}${!!state?.search ? state?.search : ""}`);
  }, [state?.search]);

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else navigateParams({ modal: ModalTypes.showPhoto, photo: file });
  };

  const handleBrigada =
    ({ status }: { status?: RequestStatus }) =>
    () => {
      attach(
        {
          request_id: Number(id),
          status,
        },
        {
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e) => errorToast(e.message),
        }
      );
      closeModal();
    };

  const renderModals = useMemo(() => {
    return <ITModals />;
  }, []);

  const renderBtns = useMemo(() => {
    if (!!order?.status.toString() && !unchangable[order.status])
      return (
        <div className="flex justify-between mb-2 gap-2">
          {!unchangable[order!?.status] &&
          order.status !== RequestStatus.denied ? (
            <button
              onClick={handleModal(ModalTypes.cancelRequest)}
              className="btn btn-danger"
            >
              {t("calcel")}
            </button>
          ) : (
            <div />
          )}
          <div>
            {order?.status! > RequestStatus.new && (
              <div className="flex gap-2">
                {unchangableObj[order?.status!] ? (
                  <button
                    onClick={handleBrigada({
                      status: RequestStatus.resumed,
                    })}
                    className="btn btn-warning"
                  >
                    {t("resume")}
                  </button>
                ) : (
                  <button
                    onClick={handleModal(ModalTypes.pause)}
                    className="btn btn-warning"
                  >
                    {t("pause")}
                  </button>
                )}
                {!unchangableObj[order.status] && (
                  <button
                    id={"fixed"}
                    onClick={handleBrigada({
                      status: RequestStatus.solved,
                    })}
                    className="btn btn-success"
                  >
                    {t("to_solve")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      );
  }, [permissions, order?.status]);

  const renderAssignment = useMemo(() => {
    if (permissions?.has(attaching) && !unchangable[order!?.status]) {
      if (order?.brigada?.name) {
        return (
          <div className="flex items-center justify-between">
            <span>{order?.brigada?.name}</span>
            <button
              onClick={handleModal(ModalTypes.assign)}
              className={cl("btn btn-primary float-end", styles.changeBtn)}
            >
              {t("reassign")}
            </button>
          </div>
        );
      }
      return (
        <button
          id="assign"
          onClick={handleModal(ModalTypes.assign)}
          className="btn btn-success float-end"
        >
          {t("assign")}
        </button>
      );
    }
    return <span>{order?.brigada?.name}</span>;
  }, [permissions, order?.status, order?.brigada?.name]);

  if (attachLoading || orderLoading || orderFetching) return <Loading />;
  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`${t("request")} №${id}`}
          subTitle={`${t("status")}: ${
            order?.status.toString() && t(RequestStatus[order?.status])
          }`}
        >
          <div className="flex gap-2">
            <button
              className="btn btn-warning"
              onClick={() => navigate(`/request-it/logs/${id}`)}
            >
              {t("logs")}
            </button>
            <button onClick={handleBack} className="btn btn-primary">
              {t("back")}
            </button>
          </div>
        </Header>
        <div className="content">
          <div className="row ">
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
                      <a href={`tel:+${order?.user.phone_number}`}>
                        +{order?.user.phone_number}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>{t("type")}</th>
                    <td>{t(Departments[order?.category?.department!])}</td>
                  </tr>
                  <tr>
                    <th>{t("category")}</th>
                    <td className={styles.tableRow}>
                      <div className="flex items-center justify-between">
                        <span>
                          {order?.category?.name}{" "}
                          {order?.is_redirected && (
                            <span className="font-bold">
                              ({t("has_changed")})
                            </span>
                          )}
                        </span>

                        {!unchangable[order!?.status] &&
                          permissions?.has(
                            MainPermissions.it_request_change_categ
                          ) && <EditCategory />}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th>{t("execution_time")}</th>
                    <td>
                      {order?.category.ftime} {t("hours")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("branch")}</th>
                    <td className={styles.tableRow}>
                      <div className="flex items-center justify-between">
                        <span>{order?.fillial?.parentfillial?.name}</span>

                        {!unchangable[order!?.status] && (
                          <button
                            onClick={handleModal(ModalTypes.changeBranch)}
                            className={cl("btn btn-primary", styles.changeBtn)}
                          >
                            {t("change")}
                          </button>
                        )}
                      </div>
                    </td>
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
                    <th id="photo_report">{t("photo_report")}</th>
                    <td className="flex flex-col !border-none">
                      {order?.file?.map((item, index) => {
                        if (item.status === 1)
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
                    <th>{t("text_order")}</th>
                    <td>{order?.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <table className="table table-striped table-bordered detail-view">
                <tbody>
                  <tr>
                    <th className="w-1/3">{t("urgent")}</th>
                    <td>{!order?.category?.urgent ? t("no") : t("yes")}</td>
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
                    <th>{t("deadline")}</th>
                    <td className="font-bold">
                      <div className="flex w-full justify-between">
                        <span>
                          {dayjs(order?.finishing_time).format(dateTimeFormat)}
                        </span>

                        {!unchangable[order!?.status] &&
                          permissions?.has(
                            MainPermissions.it_request_change_categ
                          ) && (
                            <TableViewBtn
                              onClick={handleModal(ModalTypes.assingDeadline)}
                            />
                          )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th>{t("receipt_date")}</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("last_changed_date")}</th>
                    {/* <td>
                      {order?.updated_at
                        ? dayjs(order?.updated_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td> */}
                    <td>
                      {!!order?.log?.length
                        ? dayjs(order?.log.at(-1)?.created_at).format(
                            dateTimeFormat
                          )
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("date_of_pause")}</th>
                    <td>
                      {order?.update_time[RequestStatus.paused]
                        ? dayjs(
                            order?.update_time[RequestStatus.paused]
                          ).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("date_of_solving")}</th>
                    <td>
                      {order?.update_time[RequestStatus.solved]
                        ? dayjs(
                            order?.update_time[RequestStatus.solved]
                          ).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>

                  <tr>
                    <th>{t("date_of_canceling")}</th>
                    <td>
                      {order?.update_time[RequestStatus.denied]
                        ? dayjs(
                            order?.update_time[RequestStatus.denied]
                          ).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("reopen")}</th>
                    <td>
                      {order?.update_time[RequestStatus.resumed]
                        ? t("yes")
                        : t("no")}
                    </td>
                  </tr>
                  <tr>
                    <th className="font-bold">{t("responsible")}</th>
                    <td className={styles.tableRow}>{renderAssignment}</td>
                  </tr>
                  <tr>
                    <th className="font-bold">{t("leave_comment")}</th>
                    <td className={styles.tableRow}>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col flex-1">
                          {!!order?.communication?.length &&
                            order?.communication.map((item) => (
                              <div className="mt-2 flex gap-1" key={item.id}>
                                <span className="font-bold flex">
                                  {item.user.full_name}:
                                </span>
                                {!!item.photo && (
                                  <span
                                    onClick={handleShowPhoto(
                                      `${baseURL}/${item.photo}`
                                    )}
                                    className="cursor-pointer"
                                  >
                                    <img src="/icons/attached.svg" alt="file" />
                                  </span>
                                )}
                                <span>{item.message}</span>
                              </div>
                            ))}
                        </div>
                        {!unchangable[order!?.status] && (
                          <TableViewBtn
                            onClick={handleModal(ModalTypes.leaveMessage)}
                          />
                        )}
                      </div>
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
                      <th className="font-bold">{t("deny_reasonn")}</th>
                      <td>{order?.deny_reason}</td>
                    </tr>
                  )}
                  {order?.pause_reason && (
                    <tr>
                      <th className="font-bold">{t("pause_reason")}</th>
                      <td>{order?.pause_reason}</td>
                    </tr>
                  )}
                  {order?.phone_number && (
                    <tr>
                      <th className="font-bold">{t("phone_number")}</th>
                      <td>{order?.phone_number}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <div className="p-2">{renderBtns}</div>
        </div>
      </Card>

      {!!order?.request_orpr?.length && <AddedProductsIT />}
      {renderModals}
    </>
  );
};

export default ShowITRequest;
