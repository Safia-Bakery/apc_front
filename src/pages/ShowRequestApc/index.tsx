import { FC, lazy, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddItems from "@/components/AddProduct";
import Card from "@/components/Card";
import Header from "@/components/Header";
import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import { useAppSelector } from "@/store/utils/types";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { baseURL } from "@/store/baseUrl";
import { detectFileType } from "@/utils/helpers";
import { useForm } from "react-hook-form";
import {
  BaseReturnBoolean,
  Departments,
  FileType,
  ModalTypes,
  RequestStatus,
  Sphere,
} from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import useQueryString from "custom/useQueryString";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import useBrigadas from "@/hooks/useBrigadas";
import syncExpenditure from "@/hooks/mutation/syncExpenditure";
import Loading from "@/components/Loader";
import cl from "classnames";
import { permissionSelector } from "reducers/sidebar";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";
import useCategories from "@/hooks/useCategories";
import RequestPhotoReport from "@/components/RequestPhotoReport";
import Suspend from "@/components/Suspend";

const ApcModals = lazy(() => import("./modals"));

const unchangable: BaseReturnBoolean = {
  [RequestStatus.finished]: true,
  [RequestStatus.closed_denied]: true,
};

const unchangableObj: BaseReturnBoolean = {
  [RequestStatus.solved]: true,
  [RequestStatus.closed_denied]: true,
  [RequestStatus.paused]: true,
};

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
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attachLoading } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => {
    navigateParams({ modal: type });
  };
  const { getValues } = useForm();
  const {
    data: order,
    refetch: orderRefetch,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrder({ id: Number(id) });

  const { data: categories, isLoading: categoryLoading } = useCategories({
    enabled:
      !!order?.category?.id &&
      order?.status === RequestStatus.new &&
      sphere_status === Sphere.fabric,
    department: Departments.APC,
    sphere_status: Sphere.fabric,
    parent_id: Number(order?.category?.id),
    category_status: 1,
  });

  const { data: brigadas } = useBrigadas({
    enabled: order?.status! <= RequestStatus.received,
    sphere_status,
    department: Departments.APC,
  });
  const isNew = order?.status === RequestStatus.new;

  const { mutate: synIIco, isPending } = syncExpenditure();

  const handleBack = () => navigate(`/requests-apc-${Sphere[sphere_status!]}`);

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else navigateParams({ modal: ModalTypes.showPhoto, photo: file });
  };

  const handleBrigada = ({ status }: { status: RequestStatus }) => {
    if (status === RequestStatus.finished) {
      synIIco(
        {
          request_id: Number(id),
        },
        {
          onSuccess: () => {
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
                onError: (e) => errorToast(e.message),
              }
            );
          },
          onError: (e) => errorToast(e.message),
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
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e: any) => errorToast(e.message),
        }
      );
    removeParams(["modal"]);
  };

  // const renderBtns = useMemo(() => {
  //   if (
  //     edit &&
  //     attaching &&
  //     permissions?.[edit] &&
  //     isNew &&
  //     permissions?.[attaching]
  //   )
  //     return (
  //       <div className="float-end mb10">
  //         <button
  //           onClick={() => handleModal(ModalTypes.cancelRequest)}
  //           className="btn btn-danger"
  //         >
  //           {t("deny")}
  //         </button>
  //       </div>
  //     );
  // }, [permissions, order?.status]);

  const handleRequestClose = () => {
    order?.brigada?.is_outsource
      ? handleModal(ModalTypes.expense)
      : handleBrigada({
          status: RequestStatus.solved,
        });
  };

  // const renderSubmit = useMemo(() => {
  //   if (edit && !!order?.brigada?.name && permissions?.[edit])
  //     return (
  //       <div className="flex justify-between gap-2">
  //         {order?.status! < RequestStatus.finished && (
  //           <button
  //             onClick={() => handleModal(ModalTypes.cancelRequest)}
  //             className="btn btn-danger  "
  //           >
  //             {t("calcel")}
  //           </button>
  //         )}
  //         <div className="flex gap-2">
  //           {order?.status! < RequestStatus.sent_to_fix && (
  //             <button
  //               onClick={() =>
  //                 handleBrigada({
  //                   status: RequestStatus.sent_to_fix,
  //                 })
  //               }
  //               className="btn btn-warning"
  //             >
  //               {t("pick_to_repair")}
  //             </button>
  //           )}
  //           {order?.status! < RequestStatus.finished && (
  //             <button
  //               id="fixed"
  //               onClick={handleRequestClose}
  //               className="btn btn-success"
  //             >
  //               {t("fixed")} {isPending && <Loading is_static />}
  //             </button>
  //           )}
  //         </div>
  //       </div>
  //     );
  // }, [permissions, order?.status, isPending]);

  const renderBtns = useMemo(() => {
    if (!!order?.status.toString() && !unchangable[order.status])
      return (
        <div className="flex justify-between mb10 gap-2">
          {!unchangable[order!?.status] &&
          order.status !== RequestStatus.closed_denied ? (
            <button
              onClick={() => handleModal(ModalTypes.cancelRequest)}
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
                    onClick={() =>
                      handleBrigada({
                        status: RequestStatus.resumed,
                      })
                    }
                    className="btn btn-warning"
                  >
                    {t("resume")}
                  </button>
                ) : (
                  <button
                    onClick={() => handleModal(ModalTypes.pause)}
                    className="btn btn-warning"
                  >
                    {t("pause")}
                  </button>
                )}
                {!unchangableObj[order.status] && (
                  <button
                    id={"fixed"}
                    onClick={
                      handleRequestClose
                      // handleBrigada({
                      //   status: RequestStatus.solved,
                      // })
                    }
                    className="btn btn-success"
                  >
                    {t("to_solve")}
                  </button>
                )}

                {order?.status! < RequestStatus.sent_to_fix && (
                  <button
                    onClick={() =>
                      handleBrigada({
                        status: RequestStatus.sent_to_fix,
                      })
                    }
                    className="btn btn-warning"
                  >
                    {t("pick_to_repair")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      );
  }, [permissions, order?.status]);

  const handleAssign = useCallback(() => {
    navigateParams({
      modal:
        sphere_status === Sphere.fabric && !!categories?.items?.length
          ? ModalTypes.changeCateg
          : ModalTypes.assign,
    });
  }, [categories?.items, sphere_status, order?.category]);

  const renderAssignment = useMemo(() => {
    if (attaching && permissions?.[attaching] && order?.status! <= 1) {
      if (order?.brigada?.name) {
        return (
          <div className="flex items-center justify-between">
            <span>{order?.brigada?.name}</span>
            <button
              onClick={() => handleModal(ModalTypes.assign)}
              className="btn btn-primary float-end"
            >
              {t("reassign")}
            </button>
          </div>
        );
      }
      return (
        <button
          id="assign"
          onClick={handleAssign}
          className="btn btn-success float-end"
        >
          {t("assign")}
        </button>
      );
    }
    return <span>{order?.brigada?.name}</span>;
  }, [permissions, order?.status, order?.brigada?.name, handleAssign]);

  const renderfileUploader = useMemo(() => {
    if (
      addExp &&
      permissions?.[addExp] &&
      !isNew &&
      order?.status !== RequestStatus.closed_denied
    )
      return <RequestPhotoReport />;
  }, [permissions, order?.status, order?.file]);

  const renderModal = useMemo(() => {
    return (
      <Suspend>
        <ApcModals />
      </Suspend>
    );
  }, [modal]);

  if (
    isPending ||
    attachLoading ||
    orderLoading ||
    orderFetching ||
    (categoryLoading && order?.status === RequestStatus.new)
  )
    return <Loading />;

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
            className="btn btn-warning  "
            onClick={() => navigate(`/request/logs/${id}`)}
          >
            {t("logs")}
          </button>
          {!!sphere_status && (
            <button onClick={handleBack} className="btn btn-primary ml-2">
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
                  {!!order?.price && (
                    <tr>
                      <th>{t("expense")}</th>
                      <td>{order?.price}</td>
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
          {renderBtns}
        </div>
      </Card>

      {renderfileUploader}

      {!isNew && order?.status !== RequestStatus.closed_denied && (
        <AddItems addExp={addExp}>
          {/* <div className="p-2">{renderSubmit}</div> */}
        </AddItems>
      )}
      {renderModal}
    </>
  );
};

export default ShowRequestApc;
