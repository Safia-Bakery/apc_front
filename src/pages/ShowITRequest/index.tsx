import { FC, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
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
  ModalTypes,
  RequestStatus,
  Sphere,
} from "@/utils/types";
import UploadComponent, { FileItem } from "@/components/FileUpload";
import { reportImgSelector, uploadReport } from "reducers/selects";
import useQueryString from "custom/useQueryString";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import uploadFileMutation from "@/hooks/mutation/uploadFile";
import useBrigadas from "@/hooks/useBrigadas";
import Loading from "@/components/Loader";
import cl from "classnames";
import { permissionSelector } from "reducers/sidebar";
import AddedProductsIT from "@/components/AddedProductsIT";
import styles from "./index.module.scss";
import TableViewBtn from "@/components/TableViewBtn";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";
import ITModals from "./modals";

interface Props {
  edit: MainPermissions;
  attaching: MainPermissions;
}

const ShowITRequest: FC<Props> = ({ attaching }) => {
  const { t } = useTranslation();
  const { id, sphere } = useParams();
  const navigate = useNavigate();
  const addExp = Number(useQueryString("addExp")) as MainPermissions;
  const permissions = useAppSelector(permissionSelector);
  const dispatch = useAppDispatch();
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attachLoading } = attachBrigadaMutation();

  const {
    data: order,
    refetch: orderRefetch,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrder({ id: Number(id) });

  const { isFetching: brigadaFetching } = useBrigadas({
    enabled: !!order?.status.toString() && order?.status < RequestStatus.done,
    department: Departments.it,
    ...(!!sphere && { sphere }),
  });

  const handleModal = (modal: ModalTypes) => () => navigateParams({ modal });

  const isNew = order?.status === RequestStatus.new;
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);

  const { mutate, isPending: uploadLoading } = uploadFileMutation();

  const handleBack = () => navigate(`/requests-it/${sphere}`);

  const handleFilesSelected = (data: FileItem[]) =>
    dispatch(uploadReport(data));

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
      removeParams(["modal"]);
    };

  const handlerSubmitFile = () => {
    if (upladedFiles?.length)
      mutate(
        {
          request_id: Number(id),
          files: upladedFiles,
        },
        {
          onSuccess: () => {
            orderRefetch();
            dispatch(uploadReport([]));
            inputRef.current.value = null;
            successToast("Сохранено");
          },
          onError: (e) => errorToast(e.message),
        }
      );
  };

  const renderModals = useMemo(() => {
    return <ITModals />;
  }, []);

  const renderBtns = useMemo(() => {
    if (
      !!order?.status.toString() &&
      order.status !== RequestStatus.done &&
      order.status !== RequestStatus.rejected
    )
      return (
        <div className="flex justify-between mb10 gap-2">
          {order.status !== RequestStatus.done &&
          order.status !== RequestStatus.rejected_wating_confirmation ? (
            <button
              onClick={handleModal(ModalTypes.cancelRequest)}
              className="btn btn-danger btn-fill"
            >
              {t("calcel")}
            </button>
          ) : (
            <div />
          )}
          <div>
            {order?.status! > RequestStatus.new && (
              <div className="flex gap-2">
                {order?.status! === RequestStatus.solved ||
                order?.status! === RequestStatus.rejected_wating_confirmation ||
                order?.status! === RequestStatus.paused ? (
                  <button
                    onClick={handleBrigada({
                      status: RequestStatus.reopened,
                    })}
                    className="btn btn-warning btn-fill"
                  >
                    {t("resume")}
                  </button>
                ) : (
                  <button
                    onClick={handleModal(ModalTypes.pause)}
                    className="btn btn-warning btn-fill"
                  >
                    {t("pause")}
                  </button>
                )}
                {order.status !== RequestStatus.solved &&
                  order.status !== RequestStatus.rejected_wating_confirmation &&
                  order.status !== RequestStatus.paused && (
                    <button
                      id={"fixed"}
                      onClick={handleBrigada({
                        status: RequestStatus.solved,
                      })}
                      className="btn btn-success btn-fill"
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
    if (permissions?.[attaching] && order?.status! <= RequestStatus.confirmed) {
      if (order?.brigada?.name) {
        return (
          <div className="flex items-center justify-between">
            <span>{order?.brigada?.name}</span>
            <button
              onClick={handleModal(ModalTypes.assign)}
              className={cl(
                "btn btn-primary btn-fill float-end",
                styles.changeBtn
              )}
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
          className="btn btn-success btn-fill float-end"
        >
          {t("assign")}
        </button>
      );
    }
    return <span>{order?.brigada?.name}</span>;
  }, [permissions, order?.status, order?.brigada?.name]);

  const renderfileUploader = useMemo(() => {
    if (permissions?.[addExp] && !isNew && order?.status !== 4)
      return (
        <Card className="overflow-hidden">
          <Header title={"add_photo_report"} />
          <div className="m-3">
            <UploadComponent
              onFilesSelected={handleFilesSelected}
              inputRef={inputRef}
            />
            {!!upladedFiles?.length && (
              <button
                onClick={handlerSubmitFile}
                type="button"
                id={"save_report"}
                className="btn btn-success float-end btn-fill my-3"
              >
                {t("save")}
              </button>
            )}
          </div>
        </Card>
      );
  }, [upladedFiles, permissions, order?.status, order?.file]);

  if (
    uploadLoading ||
    attachLoading ||
    orderLoading ||
    brigadaFetching ||
    orderFetching
  )
    return <Loading />;
  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`${t("request")} №${id}`}
          subTitle={`${t("status")}: ${t(
            handleStatus({ status: order?.status })
          )}`}
        >
          <div className="flex gap-2">
            <button
              className="btn btn-warning btn-fill "
              onClick={() => navigate(`/request/logs/${id}`)}
            >
              {t("logs")}
            </button>
            <button onClick={handleBack} className="btn btn-primary btn-fill">
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

                        {order?.status! !== RequestStatus.done && (
                          <button
                            className={cl(
                              "btn btn-primary btn-fill",
                              styles.changeBtn
                            )}
                            onClick={handleModal(ModalTypes.changeCateg)}
                          >
                            {t("change")}
                          </button>
                        )}
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

                        {order?.status! !== RequestStatus.done && (
                          <button
                            onClick={handleModal(ModalTypes.changeBranch)}
                            className={cl(
                              "btn btn-primary btn-fill",
                              styles.changeBtn
                            )}
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

                        {order?.status! !== RequestStatus.done && (
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
                    <th>{t("changed_date")}</th>
                    <td>
                      {order?.updated_at
                        ? dayjs(order?.updated_at).format(dateTimeFormat)
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
                      {order?.update_time[
                        RequestStatus.rejected_wating_confirmation
                      ]
                        ? dayjs(
                            order?.update_time[
                              RequestStatus.rejected_wating_confirmation
                            ]
                          ).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("reopen")}</th>
                    <td>
                      {order?.update_time[RequestStatus.reopened]
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
                                    <img
                                      src="/assets/icons/attached.svg"
                                      alt="file"
                                    />
                                  </span>
                                )}
                                <span>{item.message}</span>
                              </div>
                            ))}
                        </div>
                        {order?.status! !== RequestStatus.done && (
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
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <div className="p-2">{renderBtns}</div>
        </div>
      </Card>

      {renderfileUploader}

      {!!order?.request_orpr?.length && <AddedProductsIT />}
      {renderModals}
    </>
  );
};

export default ShowITRequest;
