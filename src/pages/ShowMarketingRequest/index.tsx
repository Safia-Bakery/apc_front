import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";
import styles from "./index.module.scss";
import useOrder from "src/hooks/useOrder";
import dayjs from "dayjs";
import { useAppSelector } from "src/redux/utils/types";
import attachBrigadaMutation from "src/hooks/mutation/attachBrigadaMutation";
import { successToast } from "src/utils/toast";
import { baseURL } from "src/main";
import {
  detectFileType,
  handleDepartment,
  handleStatus,
} from "src/utils/helpers";
import { FileType, MainPermissions, RequestStatus } from "src/utils/types";
import { useForm } from "react-hook-form";
import ShowRequestModals from "src/components/ShowRequestModals";

import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";
import { permissionSelector } from "src/redux/reducers/auth";

const enum ModalTypes {
  closed = "closed",
  cancelRequest = "cancelRequest",
  assign = "assign",
  showPhoto = "showPhoto",
}

const ShowMarketingRequest = () => {
  const { id } = useParams();
  const permissions = useAppSelector(permissionSelector);
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const { getValues } = useForm();
  const { data: order, refetch: orderRefetch } = useOrder({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;

  const handleNavigate = (route: string) => () => navigate(route);

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      navigateParams({ modal: ModalTypes.showPhoto, photo: file });
    }
  };

  const handleBrigada =
    ({ status }: { status: RequestStatus }) =>
    () => {
      attach(
        {
          request_id: Number(id),
          status,
          comment: getValues("cancel_reason"),
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
    if (permissions?.[MainPermissions.edit_design_request] && isNew)
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
          >
            Принять
          </button>
        </div>
      );
    if (permissions?.[MainPermissions.edit_design_request])
      return (
        <div className="float-end mb10">
          {order?.status! < 3 && (
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Card className="overflow-hidden">
        <Header title={`Заказ №${id}`} subTitle={handleStatus(order?.status)}>
          <button
            className="btn btn-warning btn-fill mr-2"
            onClick={handleNavigate(`/logs/${id}`)}
          >
            Логи
          </button>
          {/* <button
            className="btn btn-primary btn-fill"
            onClick={() => navigate(-1)}
          >
            Назад
          </button> */}
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
                    <th>Клиент</th>
                    <td>{order?.user?.full_name}</td>
                  </tr>
                  <tr>
                    <th>Номер телефона</th>
                    <td>
                      <a href={`tel:+${order?.user.phone_number}`}>
                        +{order?.user.phone_number}
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
                    <th>Продукт</th>
                    <td>{order?.product}</td>
                  </tr>
                  <tr>
                    <th>file</th>
                    <td className="d-flex flex-column">
                      {order?.file?.map((item, index) => {
                        if (item.status === 0)
                          return (
                            <div
                              className={styles.imgUrl}
                              onClick={handleShowPhoto(
                                `${baseURL}/${item.url}`
                              )}
                              key={item.url + index}
                            >
                              {item.url}
                            </div>
                          );
                      })}
                    </td>
                  </tr>
                  <tr>
                    <th>Примичание</th>
                    <td>{order?.description}</td>
                  </tr>
                  <tr>
                    <th>Статус</th>
                    <td>{handleStatus(order?.status)}</td>
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
                    <th>Дата выполнения</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format("DD.MM.YYYY HH:mm")
                        : "В процессе"}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата</th>
                    <td>
                      {dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата изменение</th>
                    <td>
                      {order?.started_at
                        ? dayjs(order?.started_at).format("DD.MM.YYYY HH:mm")
                        : "Не задано"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          {true && renderBtns}
        </div>
      </Card>

      <ShowRequestModals />
    </>
  );
};

export default ShowMarketingRequest;
