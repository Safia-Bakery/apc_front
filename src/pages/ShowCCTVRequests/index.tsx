import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import useOrder from "@/hooks/useOrder";
import dayjs from "dayjs";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import { errorToast, successToast } from "@/utils/toast";
import { baseURL } from "@/main";
import { detectFileType, handleStatus } from "@/utils/helpers";
import {
  Departments,
  FileType,
  ModalTypes,
  RequestStatus,
} from "@/utils/types";
import { useForm } from "react-hook-form";
import ShowRequestModals from "@/components/ShowRequestModals";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import cl from "classnames";
import Loading from "@/components/Loader";
import useQueryString from "@/hooks/custom/useQueryString";
import BaseInput from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import useCategories from "@/hooks/useCategories";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";

const ShowCCTVRequests = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigateParams = useNavigateParams();
  const modal = Number(useQueryString("modal"));
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attaching } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () =>
    navigateParams({ modal: type });
  const { getValues, register } = useForm();
  const {
    data: order,
    refetch: orderRefetch,
    isLoading,
  } = useOrder({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const navigate = useNavigate();
  const changeModal = Number(useQueryString("changeModal"));

  const { data: categories, isLoading: categoryLoading } = useCategories({
    enabled: changeModal === ModalTypes.changeCateg,
    department: Departments.cctv,
    category_status: 1,
  });

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      navigateParams({ modal: ModalTypes.showPhoto, photo: file });
    }
  };

  const handleBack = () => navigate("/requests-cctv");
  const handleChangeModal = (changeModal: ModalTypes) => () =>
    navigateParams({ changeModal });

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
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e: any) => errorToast(e.message),
        }
      );
      removeParams(["modal"]);
    };
  const closeModal = () => removeParams(["changeModal"]);

  const handleChange = () => {
    const { category: category_id } = getValues();
    attach(
      {
        request_id: Number(id),
        category_id,
        status: RequestStatus.done,
      },
      {
        onSuccess: () => {
          orderRefetch();
          successToast("assigned");
          closeModal();
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  const renderChangeModals = useMemo(() => {
    switch (changeModal) {
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
              onClick={handleChange}
            >
              Применить
            </button>
          </>
        );
    }
  }, [categoryLoading, changeModal, categories]);

  const renderBtns = useMemo(() => {
    if (isNew)
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
    else
      return (
        <div className="float-end mb10">
          {order?.status! < RequestStatus.done && (
            <button
              onClick={handleChangeModal(ModalTypes.changeCateg)}
              className="btn btn-success btn-fill"
            >
              Завершить
            </button>
          )}
        </div>
      );
  }, [order?.status]);

  const renderModals = useMemo(() => {
    if (
      !!order?.status.toString() &&
      (order?.status < RequestStatus.done || modal === ModalTypes.showPhoto)
    )
      return <ShowRequestModals />;
  }, [order?.status, modal]);

  const handleValidateDate = (date: string | undefined) => {
    if (date) {
      return dayjs(date).isValid()
        ? dayjs(date).format("DD.MM.YYYY HH:mm")
        : date;
    } else return t("not_given");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (attaching || isLoading) return <Loading absolute />;

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
            onClick={() => navigate(`/request/logs/${id}`)}
          >
            Логи
          </button>
          <button onClick={handleBack} className="btn btn-primary btn-fill">
            {t("back")}
          </button>
        </Header>
        <div className="content">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-striped table-bordered detail-view">
                <tbody>
                  <tr>
                    <th>Клиент</th>
                    <td className="w-1/2"> {order?.user?.full_name}</td>
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
                    <th>Описание события</th>
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
                    <td className="w-1/2">
                      {!order?.category?.urgent ? "Нет" : "Да"}
                    </td>
                  </tr>
                  <tr>
                    <th>Изменил</th>
                    <td>
                      {!!order?.user_manager
                        ? order?.user_manager
                        : t("not_given")}
                    </td>
                  </tr>

                  <tr>
                    <th>Дата поступления:</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата и время начало событий</th>
                    <td>{handleValidateDate(order?.update_time.vidfrom)}</td>
                  </tr>
                  <tr>
                    <th>Дата и время конец событий</th>
                    <td>{handleValidateDate(order?.update_time.vidto)}</td>
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
      {renderModals}
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

export default ShowCCTVRequests;
