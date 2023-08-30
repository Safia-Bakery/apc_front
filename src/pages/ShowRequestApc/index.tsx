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
import {
  detectFileType,
  handleDepartment,
  handleStatus,
} from "src/utils/helpers";
import { useForm } from "react-hook-form";
import {
  FileType,
  MainPermissions,
  Order,
  RequestStatus,
} from "src/utils/types";
import UploadComponent, { FileItem } from "src/components/FileUpload";
import ShowRequestModals from "src/components/ShowRequestModals";
import { reportImgSelector, uploadReport } from "src/redux/reducers/selects";
import useQueryString from "src/hooks/useQueryString";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";
import uploadFileMutation from "src/hooks/mutation/uploadFile";
import { loginHandler, permissionSelector } from "src/redux/reducers/auth";
import useBrigadas from "src/hooks/useBrigadas";

const enum ModalTypes {
  closed = "closed",
  cancelRequest = "cancelRequest",
  assign = "assign",
  showPhoto = "showPhoto",
}

const ShowRequestApc = () => {
  const { id } = useParams();
  const tokenKey = useQueryString("key");
  const permissions = useAppSelector(permissionSelector);
  const dispatch = useAppDispatch();
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach } = attachBrigadaMutation();
  const { refetch: brigadasRefetch } = useBrigadas({ enabled: false });
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const { getValues } = useForm();
  const { data: order, refetch: orderRefetch } = useOrder({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);

  const { mutate } = uploadFileMutation();

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
            successToast("Сохранено");
            inputRef.current.value = null;
            dispatch(uploadReport(null));
          },
        }
      );
  };

  const renderBtns = useMemo(() => {
    if (permissions?.[MainPermissions.edit_request_apc] && isNew)
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
    if (
      !!order?.brigada?.name &&
      permissions?.[MainPermissions.edit_request_apc]
    )
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
  }, [permissions, order?.status]);

  const renderAssignment = useMemo(() => {
    if (permissions?.[MainPermissions.request_ettach] && order?.status! <= 1) {
      if (order?.brigada?.name) {
        return (
          <>
            <span>{order?.brigada?.name}</span>
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
    return <span>{order?.brigada?.name}</span>;
  }, [permissions, order?.status, order?.brigada?.name]);

  useEffect(() => {
    if (tokenKey) dispatch(loginHandler(tokenKey));
  }, [tokenKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (order?.status! <= 1) {
      brigadasRefetch();
    }
  }, [order?.status]);

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`Заказ №${id}`}
          subTitle={`Статус: ${handleStatus(order?.status)}`}
        />
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
                    <th>Забрал для</th>
                    <td>---------</td>
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
                      {dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата изменения:</th>
                    <td>
                      {dayjs(order?.started_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата выполнения:</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format("DD.MM.YYYY HH:mm")
                        : "В процессе"}
                    </td>
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

      {permissions?.[MainPermissions.request_add_expanditure] &&
        order?.status !== 0 && (
          <Card className="overflow-hidden">
            <Header title={"Добавить фотоотчёт"} />
            <div className="m-3">
              <UploadComponent
                onFilesSelected={handleFilesSelected}
                inputRef={inputRef}
              />
              <button
                onClick={handlerSubmitFile}
                type="button"
                className="btn btn-success float-end btn-fill my-3"
              >
                Сохранить
              </button>
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
