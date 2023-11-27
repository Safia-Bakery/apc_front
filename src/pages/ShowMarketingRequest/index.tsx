import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";

import useOrder from "src/hooks/useOrder";
import dayjs from "dayjs";
import { useAppSelector } from "src/store/utils/types";
import attachBrigadaMutation from "src/hooks/mutation/attachBrigadaMutation";
import { successToast } from "src/utils/toast";
import { baseURL } from "src/main";
import {
  detectFileType,
  handleDepartment,
  handleStatus,
} from "src/utils/helpers";
import {
  Departments,
  FileType,
  MainPermissions,
  RequestStatus,
} from "src/utils/types";
import { useForm } from "react-hook-form";
import ShowRequestModals from "src/components/ShowRequestModals";

import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/custom/useCustomNavigate";
import { permissionSelector } from "src/store/reducers/sidebar";
import useQueryString from "src/hooks/custom/useQueryString";
import cl from "classnames";

const enum ModalTypes {
  closed = "closed",
  cancelRequest = "cancelRequest",
  assign = "assign",
  showPhoto = "showPhoto",
}

const ShowMarketingRequest = () => {
  const { id } = useParams();
  const permissions = useAppSelector(permissionSelector);

  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const { getValues } = useForm();
  const { data: order, refetch: orderRefetch } = useOrder({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const edit = Number(useQueryString("edit")) as MainPermissions;
  const navigate = useNavigate();
  const { search, state } = useLocation();

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      navigateParams({ modal: ModalTypes.showPhoto, photo: file });
    }
  };

  const handleBack = () => navigate(state?.prevPath);

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
            if (data.status === 200) {
              orderRefetch();
              successToast("assigned");
            }
          },
        }
      );
      removeParams(["modal"]);
    };

  const renderBtns = useMemo(() => {
    if (permissions?.[edit] && isNew)
      return (
        <div className="float-end mb10">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger btn-fill mr-2"
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
          {order?.status! < 2 && (
            <button
              onClick={handleBrigada({
                status: RequestStatus.sendToRepair,
              })}
              className="btn btn-warning btn-fill mr-2"
            >
              Отправить заказчику
            </button>
          )}
          {order?.status! < 3 && (
            <button
              onClick={handleBrigada({ status: RequestStatus.done })}
              className="btn btn-success btn-fill"
              id="finish_request"
            >
              Завершить
            </button>
          )}
        </div>
      );
  }, [permissions, order?.status]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <button
            className="btn btn-warning btn-fill mr-2"
            onClick={() => navigate("logs")}
          >
            Логи
          </button>
          <button onClick={handleBack} className="btn btn-primary btn-fill">
            Назад
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
                    <th>Клиент</th>
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
                    <td className="flex flex-col">
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
                    <th>Срочно</th>
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

      <ShowRequestModals />
    </>
  );
};

export default ShowMarketingRequest;
