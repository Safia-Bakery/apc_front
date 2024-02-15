import { FC, useMemo, useRef, KeyboardEvent } from "react";
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
import { useTranslation } from "react-i18next";

interface Props {
  edit: MainPermissions;
  attaching: MainPermissions;
}

const ShowITRequest: FC<Props> = ({ edit, attaching }) => {
  const { t } = useTranslation();
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
    category_status: 1,
  });
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attachLoading } = attachBrigadaMutation();

  const {
    data: order,
    refetch: orderRefetch,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrder({ id: Number(id) });

  const { isFetching: brigadaFetching } = useBrigadas({
    enabled: !!order?.status.toString() && order?.status < RequestStatus.done,
    department: Departments.it,
    ...(!!sphere && { sphere }),
  });

  const handleModal = (modal: ModalTypes) => () => navigateParams({ modal });

  const handleChangeModal = (changeModal: ModalTypes) => () =>
    navigateParams({ changeModal });

  const { getValues, register, reset } = useForm();

  const isNew = order?.status === RequestStatus.new;
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);
  const { mutate: synIIco, isPending } = syncExpenditure();

  const { mutate: msgMutation, isPending: msgLoading } = orderMsgMutation();

  const { mutate, isPending: uploadLoading } = uploadFileMutation();

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
          closeModal();
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
            onSuccess: () => {
              orderRefetch();
              successToast("assigned");
              removeParams(["branch", "changeModal"]);
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
                    onSuccess: () => {
                      orderRefetch();
                      successToast("assigned");
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
              orderRefetch();
              successToast("assigned");
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
            <BaseInput label="select_branch">
              <BranchSelect enabled />
            </BaseInput>

            <button
              className="btn btn-success btn-fill w-full"
              onClick={handleChange({ filial: true })}
            >
              {t("apply")}
            </button>
          </>
        );
      case ModalTypes.changeCateg:
        return (
          <>
            <BaseInput label="select_group_problem">
              <MainSelect
                values={categories?.items}
                register={register("category")}
              />
            </BaseInput>

            <button
              className="btn btn-success btn-fill w-full"
              onClick={handleChange({ categ: true })}
            >
              {t("apply")}
            </button>
          </>
        );
      case ModalTypes.leaveMessage:
        return (
          <>
            <BaseInput label="leave_comment">
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
              {t("apply")}
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
        <div className="flex justify-between mb10 gap-2">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger btn-fill"
          >
            {t("cancel")}
          </button>
          <div>
            {order?.status! > RequestStatus.new && (
              <div className="flex gap-2">
                <button
                  onClick={handleBrigada({
                    status: RequestStatus.sendToRepair,
                  })}
                  className="btn btn-warning btn-fill"
                >
                  {t("pick_to_repair")}
                </button>
                <button
                  id={"fixed"}
                  onClick={handleBrigada({
                    status: RequestStatus.done,
                  })}
                  className="btn btn-success btn-fill"
                >
                  {t("fixed")} {isPending && <Loading />}
                </button>
              </div>
            )}
          </div>
        </div>
      );
  }, [permissions, order?.status, isPending]);

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
              {t("reassign")}
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
          {t("assign")}
        </button>
      );
    }
    return <span>{order?.brigada?.name}</span>;
  }, [permissions, order?.status, order?.brigada?.name]);

  const renderfileUploader = useMemo(() => {
    if (permissions?.[addExp] && !isNew && order?.status !== 4)
      return (
        <Card className="overflow-hidden">
          <Header title={"add_photo_report"} />
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
                {t("save")}
              </button>
            )}
          </div>
        </Card>
      );
  }, [upladedFiles, permissions, order?.status, order?.file]);

  const closeModal = () => removeParams(["changeModal"]);

  if (
    isPending ||
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
          title={`${t("order")} №${id}`}
          subTitle={`${t("status")}: ${t(
            handleStatus({
              status: order?.status,
              dep: Departments.it,
            })
          )}`}
        >
          <div className="flex gap-2">
            <button
              className="btn btn-warning btn-fill "
              onClick={() => navigate(`/request/logs/${id}`)}
            >
              {t("logs")}
            </button>
            <button onClick={handleBack} className="btn btn-primary btn-fill">
              {t("back")}
            </button>
          </div>
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
                    <td>
                      {t(
                        handleDepartment({
                          ...(!!order?.category?.sub_id
                            ? { sub: order?.category?.sub_id }
                            : { dep: order?.category?.department }),
                        })
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("group_problem")}</th>
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
                          {t("change")}
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>{t("branch")}</th>
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
                          {t("change")}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* <tr>
                    <th>Продукт</th>
                    <td>{order?.product}</td>
                  </tr> */}
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
                  <tr>
                    <th>{t("text_order")}</th>
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
                    <th>{t("receip_date")}</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("changed_date")}</th>
                    <td>
                      {order?.started_at
                        ? dayjs(order?.started_at).format("DD.MM.YYYY HH:mm")
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("completion_date")}</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format("DD.MM.YYYY HH:mm")
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th className="font-bold">{t("responsible")}</th>
                    <td className={styles.tableRow}>{renderAssignment}</td>
                  </tr>
                  <tr>
                    <th className="font-bold">{t("comments")}</th>
                    <td className={styles.tableRow}>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {!!order?.communication?.length &&
                            order?.communication.map((item) => (
                              <div className="mt-2 flex gap-1" key={item.id}>
                                <span className="font-bold flex">
                                  {item.user.full_name}:
                                </span>
                                <span>{item.message}</span>
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
          <div className="p-2">{renderSubmit}</div>
        </div>
      </Card>

      {renderfileUploader}

      {!!order?.request_orpr?.length && <AddedProductsIT />}
      {renderRequestModals}
      <Modal isOpen={!!changeModal} onClose={closeModal} className="!max-w-sm">
        <Header title="change">
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
