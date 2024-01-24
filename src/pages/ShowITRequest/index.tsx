import { FC, useEffect, useMemo, useRef, KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import AddedProductsIT from "@/components/AddedProductsIT";
import Modal from "@/components/Modal";
import BranchSelect from "@/components/BranchSelect";
import BaseInput from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import useCategories from "@/hooks/useCategories";
import styles from "./index.module.scss";
import useUpdateQueryStr from "@/hooks/custom/useUpdateQueryStr";
import orderMsgMutation from "@/hooks/mutation/orderMsg";
import TableViewBtn from "@/components/TableViewBtn";
import MainTextArea from "@/components/BaseInputs/MainTextArea";

interface Props {
  edit: MainPermissions;
  attaching: MainPermissions;
}

const ShowITRequest: FC<Props> = ({ edit, attaching }) => {
  const { id, sphere } = useParams();
  const navigate = useNavigate();
  const modal = useQueryString("modal");
  const changeModal = Number(useQueryString("changeModal"));
  const addExp = Number(useQueryString("addExp")) as MainPermissions;
  const permissions = useAppSelector(permissionSelector);
  const dispatch = useAppDispatch();
  const navigateParams = useNavigateParams();
  const branchJson = useUpdateQueryStr("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const { data: categories, isLoading: categoryLoading } = useCategories({
    enabled: changeModal === ModalTypes.changeCateg,
    department: Departments.it,
  });
  const removeParams = useRemoveParams();
  const { mutate: attach, isLoading: attachLoading } = attachBrigadaMutation();
  const { refetch: brigadasRefetch, isFetching: brigadaFetching } = useBrigadas(
    {
      department: Departments.it,
      ...(!!sphere && { sphere }),
    }
  );
  const {
    data: order,
    refetch: orderRefetch,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrder({ id: Number(id) });

  const handleModal = (modal: ModalTypes) => () => navigateParams({ modal });

  const handleChangeModal = (changeModal: ModalTypes) => () =>
    navigateParams({ changeModal });

  const { getValues, register, reset } = useForm();

  const isNew = order?.status === RequestStatus.new;
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);
  const { mutate: synIIco, isLoading } = syncExpenditure();

  const { mutate: msgMutation, isLoading: msgLoading } = orderMsgMutation();

  const { mutate, isLoading: uploadLoading } = uploadFileMutation();

  const handleBack = () => navigate(`/requests-it/${sphere}`);

  const handleFilesSelected = (data: FileItem[]) =>
    dispatch(uploadReport(data));

  const handleMessage = () => {
    msgMutation(
      {
        request_id: Number(id),
        message: getValues("left_comment"),
      },
      {
        onSuccess: () => {
          orderRefetch();
          removeParams(["changeModal"]);
          successToast("success");
          reset({});
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  const handleChange =
    ({ filial, categ }: { filial?: boolean; categ?: boolean }) =>
    () => {
      const { category: category_id } = getValues();
      if (!!branch || category_id)
        attach(
          {
            request_id: Number(id),
            ...(!!branch?.id && filial && { fillial_id: branch.id }),
            ...(categ && { category_id }),
          },
          {
            onSuccess: (data: any) => {
              if (data.status === 200) {
                orderRefetch();
                successToast("assigned");
                removeParams(["branch", "changeModal"]);
              }
            },
            onError: (e: any) => errorToast(e.message),
          }
        );
    };

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else navigateParams({ modal: ModalTypes.showPhoto, photo: file });
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
              if (data.status === 200) {
                orderRefetch();
                successToast("assigned");
              }
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

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleMessage();
    }
  };

  const renderRequestModals = useMemo(() => {
    return <ShowRequestModals />;
  }, [modal]);

  const renderChangeModals = useMemo(() => {
    switch (changeModal) {
      case ModalTypes.changeBranch:
        return (
          <>
            <BaseInput label="Выберите филиал">
              <BranchSelect enabled />
            </BaseInput>

            <button
              className="btn btn-success btn-fill w-full"
              onClick={handleChange({ filial: true })}
            >
              Применить
            </button>
          </>
        );
      case ModalTypes.changeCateg:
        return (
          <>
            <BaseInput label="Выберите группу проблем">
              <MainSelect
                values={categories?.items}
                register={register("category")}
              />
            </BaseInput>

            <button
              className="btn btn-success btn-fill w-full"
              onClick={handleChange({ categ: true })}
            >
              Применить
            </button>
          </>
        );
      case ModalTypes.leaveMessage:
        return (
          <>
            <BaseInput label="Оставить комментария">
              <MainTextArea
                autoFocus
                onKeyDown={handleKeyDown}
                register={register("left_comment")}
              />
            </BaseInput>

            <button
              className="btn btn-success btn-fill w-full"
              onClick={handleMessage}
            >
              Применить
            </button>
          </>
        );
      default:
        break;
    }
  }, [categoryLoading, changeModal, categories, branch]);

  const renderSubmit = useMemo(() => {
    if (permissions?.[edit])
      return (
        <div className="flex justify-between mb10">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger btn-fill"
          >
            Отменить
          </button>
          <div>
            {order?.status! > RequestStatus.new && (
              <>
                <button
                  onClick={handleBrigada({
                    status: RequestStatus.sendToRepair,
                  })}
                  className="btn btn-warning btn-fill mr-2"
                >
                  Забрать для ремонта
                </button>
                <button
                  id={"fixed"}
                  onClick={handleBrigada({
                    status: RequestStatus.done,
                  })}
                  className="btn btn-success btn-fill"
                >
                  Починил {isLoading && <Loading />}
                </button>
              </>
            )}
          </div>
        </div>
      );
  }, [permissions, order?.status, isLoading]);

  const renderAssignment = useMemo(() => {
    if (permissions?.[attaching] && order?.status! <= RequestStatus.confirmed) {
      if (order?.brigada?.name) {
        return (
          <>
            <span>{order?.brigada?.name}</span>
            <button
              onClick={handleModal(ModalTypes.assign)}
              className={cl(
                "btn btn-primary btn-fill float-end",
                styles.changeBtn
              )}
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

  const closeModal = () => removeParams(["changeModal"]);

  useEffect(() => {
    if (!!order?.status.toString() && order?.status <= RequestStatus.confirmed)
      brigadasRefetch();
  }, [order?.status]);

  if (
    isLoading ||
    uploadLoading ||
    attachLoading ||
    orderLoading ||
    msgLoading ||
    brigadaFetching ||
    orderFetching
  )
    return <Loading absolute />;
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
            onClick={() => navigate(`/request/logs/${id}`)}
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
                    <td className={styles.tableRow}>
                      <div className="flex items-center justify-between">
                        <span>{order?.category?.name}</span>

                        <button
                          className={cl(
                            "btn btn-primary btn-fill",
                            styles.changeBtn
                          )}
                          onClick={handleChangeModal(ModalTypes.changeCateg)}
                        >
                          Переназначить
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Филиал</th>
                    <td className={styles.tableRow}>
                      <div className="flex items-center justify-between">
                        <span>{order?.fillial?.parentfillial?.name}</span>

                        <button
                          onClick={handleChangeModal(ModalTypes.changeBranch)}
                          className={cl(
                            "btn btn-primary btn-fill",
                            styles.changeBtn
                          )}
                        >
                          Переназначить
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Продукт</th>
                    <td>{order?.product}</td>
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
                    <th id="photo_report">Фотоотчёт</th>
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
                    <th>Дата поступления</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")
                        : "Не задано"}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата изменения</th>
                    <td>
                      {order?.started_at
                        ? dayjs(order?.started_at).format("DD.MM.YYYY HH:mm")
                        : "Не задано"}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата выполнения</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format("DD.MM.YYYY HH:mm")
                        : "Не задано"}
                    </td>
                  </tr>
                  <tr>
                    <th className="font-bold">Ответственный</th>
                    <td className={styles.tableRow}>{renderAssignment}</td>
                  </tr>
                  <tr>
                    <th className="font-bold">Оставить комментария</th>
                    <td className={styles.tableRow}>
                      <div className="flex items-center justify-between">
                        {/* <span>{order?.fillial?.parentfillial?.name}</span> */}
                        <div className="flex flex-col">
                          {!!order?.communication?.length &&
                            order?.communication.map((item) => (
                              <div className="mt-2 flex gap-1" key={item.id}>
                                <span className="font-bold flex">
                                  {item.user.full_name}:
                                </span>
                                <span className="">{item.message}</span>
                              </div>
                            ))}
                        </div>
                        <TableViewBtn
                          onClick={handleChangeModal(ModalTypes.leaveMessage)}
                        />
                      </div>
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
          <div className="p-2">{renderSubmit}</div>
        </div>
      </Card>

      {renderfileUploader}

      {!!order?.request_orpr?.length && <AddedProductsIT />}
      {renderRequestModals}
      <Modal isOpen={!!changeModal} onClose={closeModal}>
        <Header title="Изменить">
          <button onClick={closeModal} className="close">
            <span>&times;</span>
          </button>
        </Header>
        <div className="p-2">{renderChangeModals}</div>
      </Modal>
    </>
  );
};

export default ShowITRequest;
