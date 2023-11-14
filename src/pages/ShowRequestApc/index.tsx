import { FC, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddProduct from "src/components/AddProduct";
import Card from "src/components/Card";
import Header from "src/components/Header";
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
  Departments,
  FileType,
  MainPermissions,
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
import syncExpenditure from "src/hooks/mutation/syncExpenditure";
import Loading from "src/components/Loader";
import cl from "classnames";

const enum ModalTypes {
  closed = "closed",
  cancelRequest = "cancelRequest",
  assign = "assign",
  showPhoto = "showPhoto",
}

interface Props {
  edit: MainPermissions;
  attaching: MainPermissions;
  // synciiko: MainPermissions;
}

const ShowRequestApc: FC<Props> = ({ edit, attaching }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tokenKey = useQueryString("key");
  const { search, state } = useLocation();
  const sphere_status = Number(useQueryString("sphere_status"));
  const addExp = Number(useQueryString("addExp")) as MainPermissions;
  const permissions = useAppSelector(permissionSelector);
  const dispatch = useAppDispatch();
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const { mutate: attach, isLoading: attachLoading } = attachBrigadaMutation();
  const { refetch: brigadasRefetch } = useBrigadas({
    enabled: false,
    sphere_status: sphere_status,
  });
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const { getValues } = useForm();
  const {
    data: order,
    refetch: orderRefetch,
    isLoading: orderLoading,
  } = useOrder({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);
  const { mutate: synIIco, isLoading } = syncExpenditure();

  const { mutate, isLoading: uploadLoading } = uploadFileMutation();

  const handleBack = () => {
    // if (sphere_status === Sphere.fabric)
    //   navigate(`/requests-apc-fabric${search}`);
    // if (sphere_status === Sphere.retail)
    navigate(state?.prevPath);
  };

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
                    onSuccess: (data: any) => {
                      if (data.status === 200) {
                        orderRefetch();
                        successToast("assigned");
                      }
                    },
                  }
                );
              }
            },
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
            dispatch(uploadReport([]));
            inputRef.current.value = null;
            successToast("Сохранено");
          },
        }
      );
  };

  const renderBtns = useMemo(() => {
    if (permissions?.[edit] && isNew && permissions?.[attaching])
      return (
        <div className="float-end mb10">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger btn-fill"
          >
            Отклонить
          </button>
          {/* <button
            onClick={handleBrigada({ status: RequestStatus.confirmed })}
            className="btn btn-success btn-fill"
          >
            Принять
          </button> */}
        </div>
      );
  }, [permissions, order?.status]);

  const renderSubmit = useMemo(() => {
    if (!!order?.brigada?.name && permissions?.[edit])
      return (
        <div className="flex justify-between mb10">
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
                id={"fixed"}
                onClick={handleBrigada({
                  status: RequestStatus.done,
                })}
                className="btn btn-success btn-fill"
              >
                Починил {isLoading && <Loading />}
              </button>
            )}
          </div>
        </div>
      );
  }, [permissions, order?.status, isLoading]);

  const renderAssignment = useMemo(() => {
    if (permissions?.[attaching] && order?.status! <= 1) {
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
          id="assign"
          onClick={handleModal(ModalTypes.assign)}
          className="btn btn-success btn-fill float-end"
        >
          Назначить
        </button>
      );
    }
    return <span>{order?.brigada?.name}</span>;
  }, [permissions, order?.status, order?.brigada?.name]);

  const renderfileUploader = useMemo(() => {
    if (permissions?.[addExp] && !isNew && order?.status !== 4)
      return (
        <Card className="overflow-hidden">
          <Header title={"Добавить фотоотчёт"} />
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
                Сохранить
              </button>
            )}
          </div>
        </Card>
      );
  }, [upladedFiles, permissions, order?.status, order?.file]);

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

  if (isLoading || uploadLoading || attachLoading || orderLoading)
    return <Loading />;

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`Заказ №${id}`}
          subTitle={`Статус: ${handleStatus({
            status: order?.status,
            dep: Departments.apc,
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
                    <th id="photo_report">Фотоотчёт</th>
                    <td className="flex flex-col">
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
                  <tr className="font-weight-bold">
                    <th>Ответственный</th>
                    <td>{renderAssignment}</td>
                  </tr>
                  {order?.deny_reason && (
                    <tr className="font-weight-bold">
                      <th>Причина отмены</th>
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
        <AddProduct>
          <div className="p-2">{renderSubmit}</div>
        </AddProduct>
      )}
      <ShowRequestModals />
    </>
  );
};

export default ShowRequestApc;
