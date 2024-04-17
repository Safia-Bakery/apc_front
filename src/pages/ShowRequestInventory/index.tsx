import { useCallback, useMemo } from "react";
import cl from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import Card from "@/components/Card";
import Header from "@/components/Header";
import useOrder from "@/hooks/useOrder";
import { useAppSelector } from "@/store/utils/types";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import { errorToast, successToast } from "@/utils/toast";
import { baseURL } from "@/main";
import { detectFileType } from "@/utils/helpers";
import {
  Departments,
  FileType,
  MainPermissions,
  ModalTypes,
  RequestStatus,
} from "@/utils/types";
import ShowRequestModals from "@/components/ShowRequestModals";
import { useNavigateParams } from "custom/useCustomNavigate";
import { permissionSelector } from "reducers/sidebar";
import AddedInventoryProducts from "@/components/AddedInventoryProducts";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";

const ShowRequestInventory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const permissions = useAppSelector(permissionSelector);

  const navigateParams = useNavigateParams();
  const { mutate: attach, isPending: attaching } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const {
    data: order,
    refetch: orderRefetch,
    isLoading,
    isFetching,
  } = useOrder({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const navigate = useNavigate();

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else navigateParams({ modal: ModalTypes.showPhoto, photo: file });
  };

  const handleBack = () => navigate("/requests-inventory");

  const handleReceive = () => {
    attach(
      {
        request_id: Number(id),
        status: RequestStatus.received,
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

  const handleFinish = useCallback(() => {
    if (!order?.expanditure?.find((item) => !!item.status))
      alert(t("select_productt"));
    else
      attach(
        { request_id: Number(id), status: RequestStatus.finished },
        {
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e) => errorToast(e.message),
        }
      );
  }, [order?.expanditure, order?.status]);

  const renderBtns = useMemo(() => {
    if (
      permissions?.[MainPermissions.edit_requests_inventory] &&
      !!order?.status.toString() &&
      order?.status < RequestStatus.finished
    )
      return (
        <div className="float-end mb10">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger   mx-2"
          >
            {t("deny")}
          </button>
          {isNew ? (
            <button
              onClick={handleReceive}
              className="btn btn-success  "
              id="recieve_request"
            >
              {t("receive")}
            </button>
          ) : (
            <button onClick={handleFinish} className="btn btn-success  ">
              {t("finish")}
            </button>
          )}
        </div>
      );
  }, [permissions, order?.status, handleFinish]);

  const renderModals = useMemo(() => {
    if (!!order?.status.toString() && order?.status < RequestStatus.finished)
      return <ShowRequestModals />;
  }, [order?.status]);

  if (isLoading || isFetching || attaching) return <Loading />;

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
            className="btn btn-warning   mr-2"
            onClick={() => navigate(`/request/logs/${id}`)}
          >
            {t("logs")}
          </button>
          <button onClick={handleBack} className="btn btn-primary  ">
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
                    <th>{t("deadline")}</th>
                    <td>
                      {order?.finishing_time
                        ? dayjs(order?.finishing_time).format(dateTimeFormat)
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

          <AddedInventoryProducts />
          {renderBtns}
        </div>
      </Card>
      {attaching && <Loading />}
      {renderModals}
    </>
  );
};

export default ShowRequestInventory;
