import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddProduct from "src/components/AddProduct";
import Card from "src/components/Card";
import Header from "src/components/Header";
import styles from "./index.module.scss";
import useOrder from "src/hooks/useOrder";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import attachBrigadaMutation from "src/hooks/mutation/attachBrigadaMutation";
import { successToast } from "src/utils/toast";
import { baseURL } from "src/main";
import { detectFileType, handleStatus } from "src/utils/helpers";
import { useForm } from "react-hook-form";
import { FileType, Order, RequestStatus } from "src/utils/types";
import { permissioms as role } from "src/utils/helpers";
import UploadComponent, { FileItem } from "src/components/FileUpload";
import ShowRequestModals from "src/components/ShowRequestModals";
import { reportImgSelector, uploadReport } from "src/redux/reducers/selects";
import useToken from "src/hooks/useToken";
import useQueryString from "src/hooks/useQueryString";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";

const enum ModalTypes {
  closed = "closed",
  cancelRequest = "cancelRequest",
  assign = "assign",
  showPhoto = "showPhoto",
}

const ShowRequestApc = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const modal = useQueryString("modal");
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const { getValues } = useForm();

  const { data: user } = useToken({ enabled: false });
  //@ts-ignore
  const me = user?.permissions === "*" ? role : user?.permissions;
  const brigadaJson = useQueryString("brigada");
  const brigada = JSON.parse(brigadaJson!) as Order["brigada"];
  const { data: order, refetch: orderRefetch } = useOrder({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const isFinished = order?.status === RequestStatus.done;
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);

  const handleNavigate = (route: string) => () => navigate(route);

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
      if (brigada?.id)
        attach(
          {
            request_id: Number(id),
            brigada_id: Number(brigada?.id),
            status,
            comment: getValues("cancel_reason"),
          },
          {
            onSuccess: (data: any) => {
              if (data.status === 200) {
                orderRefetch();
                successToast("assigned");
                // $brigada(undefined);
              }
            },
          }
        );
      removeParams(["modal"]);
    };

  const renderBtns = useMemo(() => {
    if (me?.ismanager && isNew && !!brigada?.name)
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
    if (!!order?.brigada?.name && me?.isbrigader)
      return (
        <div className="d-flex justify-content-between mb10">
          {order?.status! < 3 && (
            <button
              onClick={handleModal(ModalTypes.cancelRequest)}
              className="btn btn-danger btn-fill"
            >
              Отменить
            </button>
          )}
          <div>
            {order?.status! < 2 && (
              <button
                onClick={handleBrigada({
                  status: RequestStatus.sendToRepair,
                })}
                className="btn btn-warning btn-fill mr-2"
              >
                Забрать для ремонта
              </button>
            )}
            {order?.status! < 3 && (
              <button
                onClick={handleBrigada({ status: RequestStatus.done })}
                className="btn btn-success btn-fill"
              >
                Починил
              </button>
            )}
          </div>
        </div>
      );
  }, [me, order?.status, brigada?.name]);

  const renderAssignment = useMemo(() => {
    if (me?.ismanager && isNew) {
      if (brigada?.name) {
        return (
          <>
            <span>{brigada?.name}</span>
            <button
              onClick={handleModal(ModalTypes.assign)}
              className="btn btn-primary btn-fill float-end"
            >
              Переназначить
            </button>
          </>
        );
      }
      return (
        <button
          onClick={handleModal(ModalTypes.assign)}
          className="btn btn-success btn-fill float-end"
        >
          Назначить
        </button>
      );
    }
    return <span>{brigada?.name ? brigada?.name : order?.brigada?.name}</span>;
  }, [me, brigada?.name, order?.status]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!upladedFiles && inputRef.current?.value) {
      inputRef.current.value = null;
    }
  }, [upladedFiles]);

  return (
    <>
      <Card>
        <Header title={`Заказ №${id}`}>
          <button
            className="btn btn-warning btn-fill mr-2"
            onClick={handleNavigate("/logs")}
          >
            Логи
          </button>
          <button
            className="btn btn-primary btn-fill"
            onClick={handleNavigate("/requests-apc")}
          >
            Назад
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
                    <th>Тип</th>
                    <td>APC</td>
                  </tr>
                  <tr>
                    <th>Группа проблем</th>
                    <td>{order?.category?.name}</td>
                  </tr>
                  <tr>
                    <th>Отдел</th>
                    <td>{order?.fillial?.name}</td>
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
                    <th>Фотоотчёт</th>
                    <td className="d-flex flex-column">
                      {order?.file?.map((item, index) => {
                        if (item.status === 1)
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
                    <td>{!order?.urgent ? "Нет" : "Да"}</td>
                  </tr>
                  <tr>
                    <th>Забрал для</th>
                    <td>---------</td>
                  </tr>
                  <tr>
                    <th>Дата выполнения</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format("DD-MM-YYYY HH:mm")
                        : "В процессе"}
                    </td>
                  </tr>
                  <tr>
                    <th>Изменил</th>
                    <td>{order?.brigada?.name}</td>
                  </tr>
                  <tr>
                    <th>Дата изменение</th>
                    <td>
                      {dayjs(order?.created_at).format("DD-MM-YYYY HH:mm")}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата</th>
                    <td>{dayjs(new Date()).format("DD-MM-YYYY HH:mm")}</td>
                  </tr>
                  <tr>
                    <th>Автор</th>
                    <td>{order?.fillial?.name}</td>
                  </tr>
                  <tr className="font-weight-bold">
                    <th>Ответственный</th>
                    <td>{renderAssignment}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          {isNew && renderBtns}
        </div>
      </Card>

      {me?.isbrigader && order?.status !== 0 && (
        <Card>
          <Header title={"Добавить фотоотчёт"} />
          <div className="m-3">
            <UploadComponent
              onFilesSelected={handleFilesSelected}
              inputRef={inputRef}
            />
          </div>
        </Card>
      )}

      {!isNew && (
        <AddProduct>
          <div className="p-2">{renderBtns}</div>
        </AddProduct>
      )}
      <ShowRequestModals />
    </>
  );
};

export default ShowRequestApc;
