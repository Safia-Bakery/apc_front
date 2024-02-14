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
          onSuccess: (data: any) => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e: any) => errorToast(e.message),
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
            className="btn btn-primary btn-fill"
          >
            Перенаправлять
          </button>
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger btn-fill mx-2"
          >
            Отклонить
          </button>
          <button
            onClick={handleBrigada({ status: RequestStatus.confirmed })}
            className="btn btn-success btn-fill"
            id="recieve_request"
          >
            Принять
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
              className="btn btn-warning btn-fill mr-2"
            >
              Отправить заказчику
            </button>
          )}
          {order?.status! < RequestStatus.done && (
            <button
              onClick={handleBrigada({ status: RequestStatus.done })}
              className="btn btn-success btn-fill"
            >
              Завершить
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

  if (attaching || orderLoading || orderFetching) return <Loading absolute />;

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`Заказ №${id}`}
          subTitle={`Статус: ${handleStatus({
            status: order?.status,
            dep: Departments.marketing,
          })}`}
        >
          <div className="flex gap-2">
            <button
              className="btn btn-warning btn-fill "
              onClick={() => navigate(`/request/logs/${id}`)}
            >
              Логи
            </button>
            {MarketingSubDep[sub_id] && (
              <button onClick={handleBack} className="btn btn-primary btn-fill">
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
                    <th className="w-1/3">Клиент</th>
                    <td>{order?.user?.full_name}</td>
                  </tr>
                  <tr>
                    <th>Номер телефона</th>
                    <td>
                      <a href={`tel:+${order?.user?.phone_number}`}>
                        +{order?.user?.phone_number}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>Тип</th>
                    <td>
                      {handleDepartment({
                        ...(!!order?.category?.sub_id
                          ? { sub: order?.category?.sub_id }
                          : { dep: order?.category?.department }),
                      })}
                    </td>
                  </tr>
                  <tr>
                    <th>Группа проблем</th>
                    <td>{order?.category?.name}</td>
                  </tr>
                  <tr>
                    <th>Отдел</th>
                    <td>{order?.fillial?.parentfillial?.name}</td>
                  </tr>
                  <tr>
                    <th>Файл</th>
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
                              файл - {index + 1}
                            </div>
                          );
                      })}
                    </td>
                  </tr>
                  <tr>
                    <th>Примичание</th>
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
                    <th className="w-1/3">Срочно</th>
                    <td>{!order?.category?.urgent ? "Нет" : "Да"}</td>
                  </tr>
                  <tr>
                    <th>Изменил</th>
                    <td>
                      {!!order?.user_manager
                        ? order?.user_manager
                        : "Не задано"}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата поступления:</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")
                        : "Не задано"}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата изменения:</th>
                    <td>
                      {order?.started_at
                        ? dayjs(order?.started_at).format("DD.MM.YYYY HH:mm")
                        : "Не задано"}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата выполнения:</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format("DD.MM.YYYY HH:mm")
                        : "Не задано"}
                    </td>
                  </tr>
                  <tr>
                    <th>Дедлайн:</th>
                    <td>
                      {!!order?.category?.ftime
                        ? order?.category.ftime
                        : "Не задано"}
                    </td>
                  </tr>
                  {order?.comments?.[0]?.rating && (
                    <tr>
                      <th className="font-bold">Рейтинг(отзыв)</th>
                      <td>{order?.comments?.[0]?.rating}</td>
                    </tr>
                  )}
                  {order?.comments?.[0]?.comment && (
                    <tr>
                      <th className="font-bold">Коммент</th>
                      <td>{order?.comments?.[0]?.comment}</td>
                    </tr>
                  )}
                  {order?.deny_reason && (
                    <tr>
                      <th className="font-bold">Причина отмены</th>
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
