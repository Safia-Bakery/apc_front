import { lazy, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
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
import { useNavigateParams } from "custom/useCustomNavigate";
import Loading from "@/components/Loader";
import cl from "classnames";
import { permissionSelector } from "reducers/sidebar";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";
import useCategories from "@/hooks/useCategories";

import Suspend from "@/components/Suspend";
import { getApcFactoryManagers, getApcFactoryRequest } from "@/hooks/factory";
import useBrigadas from "@/hooks/useBrigadas";

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

const ShowRequestApcFabric = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const modal = Number(useQueryString("modal"));
  const permissions = useAppSelector(permissionSelector);
  const navigateParams = useNavigateParams();
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
  } = getApcFactoryRequest({ id: Number(id) });

  const { data: categories, isLoading: categoryLoading } = useCategories({
    enabled: !!order?.category?.id && order?.status === RequestStatus.new,
    department: Departments.APC,
    sphere_status: Sphere.fabric,
    parent_id: Number(order?.category?.id),
    category_status: 1,
  });

  useBrigadas({
    enabled:
      order?.status! <= RequestStatus.received && modal === ModalTypes.assign,
    sphere_status: Sphere.fabric,
    department: Departments.APC,
  });

  const handleBack = () => navigate("/requests-apc-fabric");

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else navigateParams({ modal: ModalTypes.showPhoto, photo: file });
  };

  const handleBrigada = ({ status }: { status: RequestStatus }) => {
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
  };

  const handleRequestClose = () => {
    handleBrigada({
      status: RequestStatus.solved,
    });
  };

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
      modal: !!categories?.items?.length
        ? ModalTypes.changeCateg
        : ModalTypes.assign,
    });
  }, [categories?.items, order?.category]);

  const renderAssignment = useMemo(() => {
    if (
      permissions?.[MainPermissions.fabric_req_attach_master] &&
      order?.status! <= 1
    ) {
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
        <button onClick={handleAssign} className="btn btn-success float-end">
          {t("assign")}
        </button>
      );
    }
    return <span>{order?.brigada?.name}</span>;
  }, [permissions, order?.status, order?.brigada?.name, handleAssign]);

  // const renderfileUploader = useMemo(() => {
  //   if (
  //     // permissions?.[addExp] &&
  //     !isNew &&
  //     order?.status !== RequestStatus.closed_denied
  //   )
  //     return <RequestPhotoReport />;
  // }, [permissions, order?.status, order?.file]);

  const renderModal = useMemo(() => {
    return (
      <Suspend>
        <ApcModals />
      </Suspend>
    );
  }, [modal]);

  if (
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
          {/* <button
            className="btn btn-warning"
            onClick={() => navigate(`/request/logs/${id}`)}
          >
            {t("logs")}
          </button> */}

          <button onClick={handleBack} className="btn btn-primary ml-2">
            {t("back")}
          </button>
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
                    <td>
                      <div className="flex items-center justify-between">
                        <span>{order?.category?.name}</span>

                        {!unchangable[order!?.status] && (
                          <button
                            className={cl("btn btn-primary")}
                            onClick={() => handleModal(ModalTypes.changeCateg)}
                          >
                            {t("change")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>{t("department")}</th>
                    <td>{order?.division?.name}</td>
                  </tr>
                  <tr>
                    <th>{t("manager")}</th>
                    <td>
                      {order?.division?.manager?.id
                        ? order?.division?.manager?.name
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("file")}</th>
                    <td className="flex flex-col !border-none">
                      {order?.file?.map((item, index) => {
                        return (
                          <div
                            className={cl(
                              "text-link cursor-pointer max-w-[150px] w-full text-truncate"
                            )}
                            onClick={handleShowPhoto(`${baseURL}/${item?.url}`)}
                            key={item.url}
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
                  {/* {!!order?.price && (
                    <tr>
                      <th>{t("expense")}</th>
                      <td>{order?.price}</td>
                    </tr>
                  )} */}
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
                  {/* <tr>
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
                  </tr> */}
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

      {/* {renderfileUploader} */}

      {/* {!isNew && order?.status !== RequestStatus.closed_denied && (
        <AddItems addExp={addExp}>
        </AddItems>
      )} */}
      {renderModal}
    </>
  );
};

export default ShowRequestApcFabric;
