import { FC, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddItems from "@/components/AddProduct";
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
import { useForm } from "react-hook-form";
import {
  Departments,
  FileType,
  MainPermissions,
  ModalTypes,
  RequestStatus,
  Sphere,
} from "@/utils/types";
import UploadComponent, { FileItem } from "@/components/FileUpload";
import ShowRequestModals from "@/components/ShowRequestModals";
import { reportImgSelector, uploadReport } from "reducers/selects";
import useQueryString from "custom/useQueryString";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import uploadFileMutation from "@/hooks/mutation/uploadFile";
import useBrigadas from "@/hooks/useBrigadas";
import syncExpenditure from "@/hooks/mutation/syncExpenditure";
import Loading from "@/components/Loader";
import cl from "classnames";
import { permissionSelector } from "reducers/sidebar";
import { useTranslation } from "react-i18next";

interface Props {
  edit?: MainPermissions;
  attaching?: MainPermissions;
  addExp?: MainPermissions;
}

const ShowRequestApc: FC<Props> = ({ edit, attaching, addExp }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const modal = Number(useQueryString("modal"));
  const sphere_status = Number(useQueryString("sphere_status"));
  const permissions = useAppSelector(permissionSelector);
  const dispatch = useAppDispatch();
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attachLoading } = attachBrigadaMutation();
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

  const { data: brigadas } = useBrigadas({
    enabled: order?.status! <= 1,
    sphere_status,
    department: Departments.apc,
  });
  const isNew = order?.status === RequestStatus.new;
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);
  const { mutate: synIIco, isPending } = syncExpenditure();

  const { mutate, isPending: uploadLoading } = uploadFileMutation();

  const handleBack = () => navigate(`/requests-apc-${Sphere[sphere_status!]}`);

  const handleFilesSelected = (data: FileItem[]) =>
    dispatch(uploadReport(data));

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      navigateParams({ modal: ModalTypes.showPhoto, photo: file });
    }
  };

  const handleBrigada =
    ({ status }: { status: RequestStatus }) =>
    () => {
      if (status === RequestStatus.done) {
        synIIco(
          {
            request_id: Number(id),
          },
          {
            onSuccess: (data: any) => {
              if (data.status == 200) {
                successToast("Успешно синхронизировано");
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
              }
            },
            onError: (e: any) => errorToast(e.message),
          }
        );
      } else
        attach(
          {
            request_id: Number(id),
            status,
            deny_reason: getValues("cancel_reason"),
          },
          {
            onSuccess: (data: any) => {
              orderRefetch();
              successToast("assigned");
            },
            onError: (e: any) => errorToast(e.message),
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
          onError: (e: any) => errorToast(e.message),
        }
      );
  };

  const renderBtns = useMemo(() => {
    if (
      edit &&
      attaching &&
      permissions?.[edit] &&
      isNew &&
      permissions?.[attaching]
    )
      return (
        <div className="float-end mb10">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger btn-fill"
          >
            {t("deny")}
          </button>
        </div>
      );
  }, [permissions, order?.status]);

  const renderSubmit = useMemo(() => {
    if (edit && !!order?.brigada?.name && permissions?.[edit])
      return (
        <div className="flex justify-between gap-2">
          {order?.status! < RequestStatus.done && (
            <button
              onClick={handleModal(ModalTypes.cancelRequest)}
              className="btn btn-danger btn-fill"
            >
              {t("calcel")}
            </button>
          )}
          <div className="flex gap-2">
            {order?.status! < RequestStatus.sendToRepair && (
              <button
                onClick={handleBrigada({
                  status: RequestStatus.sendToRepair,
                })}
                className="btn btn-warning btn-fill "
              >
                {t("pick_to_repair")}
              </button>
            )}
            {order?.status! < RequestStatus.done && (
              <button
                id="fixed"
                onClick={handleBrigada({
                  status: RequestStatus.done,
                })}
                className="btn btn-success btn-fill"
              >
                {t("fixed")} {isPending && <Loading />}
              </button>
            )}
          </div>
        </div>
      );
  }, [permissions, order?.status, isPending]);

  const renderAssignment = useMemo(() => {
    if (attaching && permissions?.[attaching] && order?.status! <= 1) {
      if (order?.brigada?.name) {
        return (
          <div className="flex items-center justify-between">
            <span>{order?.brigada?.name}</span>
            <button
              onClick={handleModal(ModalTypes.assign)}
              className="btn btn-primary btn-fill float-end"
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
    if (addExp && permissions?.[addExp] && !isNew && order?.status !== 4)
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

  const renderModal = useMemo(() => {
    if (
      !!order?.status.toString() &&
      (order?.status < RequestStatus.done || modal === ModalTypes.showPhoto)
    )
      return <ShowRequestModals />;
  }, [order?.status, modal, brigadas]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (
    isPending ||
    uploadLoading ||
    attachLoading ||
    orderLoading ||
    orderFetching
  )
    return <Loading absolute />;

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`${t("order")} №${id}`}
          subTitle={`${t("status")}: ${t(
            handleStatus({
              status: order?.status,
              dep: Departments.apc,
            })
          )}`}
        >
          <button
            className="btn btn-warning btn-fill"
            onClick={() => navigate(`/request/logs/${id}`)}
          >
            {t("logs")}
          </button>
          {!!sphere_status && (
            <button
              onClick={handleBack}
              className="btn btn-primary btn-fill ml-2"
            >
              {t("back")}
            </button>
          )}
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
                    <th>{t("group_problem")}</th>
                    <td>{order?.category?.name}</td>
                  </tr>
                  <tr>
                    <th>{t("department")}</th>
                    <td>{order?.fillial?.parentfillial?.name}</td>
                  </tr>
                  <tr>
                    <th>{t("productt")}</th>
                    <td>{order?.product}</td>
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
                    <th className="font-bold">{t("responsible")}</th>
                    <td>{renderAssignment}</td>
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

      {renderfileUploader}

      {!isNew && order?.status !== RequestStatus.rejected && (
        <AddItems addExp={addExp}>
          <div className="p-2">{renderSubmit}</div>
        </AddItems>
      )}
      {renderModal}
    </>
  );
};

export default ShowRequestApc;
