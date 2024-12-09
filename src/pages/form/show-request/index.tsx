import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import dayjs from "dayjs";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { CancelReason, numberWithCommas } from "@/utils/helpers";
import { ModalTypes, RequestStatus } from "@/utils/types";
import { useForm } from "react-hook-form";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";
import { editFormRequests, getFormRequest } from "@/hooks/forms";
import AntModal from "@/components/AntModal";
import MainSelect from "@/components/BaseInputs/MainSelect";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";

const ShowFormRequests = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [modal, $modal] = useState<ModalTypes>();
  const { mutate, isPending: attaching } = editFormRequests();
  const handleModal = (type: ModalTypes) => () => $modal(type);
  const {
    data: order,
    refetch: orderRefetch,
    isLoading,
  } = getFormRequest({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const navigate = useNavigate();
  const { watch, register, handleSubmit, getValues } = useForm();
  const handleBack = () => navigate("/requests-form");

  const closeModal = () => $modal(undefined);

  const handleBrigada =
    ({ status }: { status: RequestStatus }) =>
    () => {
      const { fixedReason, cancel_reason } = getValues();
      mutate(
        {
          id: Number(id),
          status,
          ...(status === RequestStatus.closed_denied && {
            deny_reason:
              fixedReason < 4 ? t(CancelReason[fixedReason]) : cancel_reason,
          }),
          request_products: order?.request_orpr,
        },
        {
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e) => errorToast(e.message),
        }
      );
      closeModal();
    };

  const renderBtns = useMemo(() => {
    if (isNew)
      return (
        <div className="float-end mb10">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger mr-2"
          >
            {t("deny")}
          </button>
          <button
            onClick={handleBrigada({ status: RequestStatus.received })}
            className="btn btn-success"
            id="recieve_request"
          >
            {t("receive")}
          </button>
        </div>
      );
    else
      return (
        <div className="float-end mb10">
          {order?.status! < RequestStatus.finished && (
            <button
              onClick={handleBrigada({ status: RequestStatus.finished })}
              className="btn btn-success"
            >
              {t("finish")}
            </button>
          )}
        </div>
      );
  }, [order?.status]);

  const renderModals = useMemo(() => {
    if (!!order?.status.toString() && order?.status < RequestStatus.finished)
      return (
        <AntModal
          closable
          onCancel={closeModal}
          open={!!modal}
          footer={null}
          classNames={{ content: "!p-0" }}
        >
          <form
            onSubmit={handleSubmit(
              handleBrigada({ status: RequestStatus.closed_denied })
            )}
          >
            <Header title="deny_reason" />
            <div className="p-3">
              <BaseInput label="select_reason">
                <MainSelect
                  register={register("fixedReason", {
                    required: t("required_field"),
                  })}
                >
                  <option value={undefined} />

                  {Object.keys(CancelReason).map((item) => (
                    <option key={item} value={item}>
                      {t(CancelReason[+item])}
                    </option>
                  ))}
                </MainSelect>
              </BaseInput>

              {watch("fixedReason") == 4 && (
                <BaseInput label="comments">
                  <MainTextArea register={register("cancel_reason")} />
                </BaseInput>
              )}

              <button className="btn btn-success w-full" type="submit">
                {t("send")}
              </button>
            </div>
          </form>
        </AntModal>
      );
  }, [order?.status, modal, watch("fixedReason"), register]);

  const renderPrice = useMemo(() => {
    return order?.request_orpr?.reduce(
      (acc, item) => {
        acc.totalAmount += item.amount || 0;
        return acc;
      },
      { totalAmount: 0 }
    );
  }, [order?.request_orpr]);

  if (attaching || isLoading) return <Loading />;

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`${t("order")} №${id}`}
          subTitle={`${t("status")}: ${
            order?.status.toString() && t(RequestStatus[order?.status])
          }`}
        >
          <button onClick={handleBack} className="btn btn-primary">
            {t("back")}
          </button>
        </Header>
        <div className="content">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-striped table-bordered detail-view">
                <tbody>
                  <tr>
                    <th>{t("client")}</th>
                    <td className="w-1/2"> {order?.user?.full_name}</td>
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
                    <th>{t("branch")}</th>
                    <td>{order?.fillial?.parentfillial?.name}</td>
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
                  {!!order?.deny_reason && (
                    <tr>
                      <th>{t("deny_reason")}:</th>
                      <td>{order?.deny_reason}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <table className="table table-striped table-bordered detail-view">
                <thead>
                  <tr>
                    <th>{t("form")}</th>
                    <th>{t("size")}</th>
                    <th>{t("quantity")}</th>
                    <th>{t("price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.request_orpr?.map((item) => (
                    <tr key={item.id}>
                      <td>{item?.orpr_product?.prod_cat?.name}</td>
                      <td>{item.orpr_product?.name}</td>
                      <td>{item?.amount}</td>
                      <td>
                        {numberWithCommas(
                          item?.orpr_product?.prod_cat?.price || 0
                        ) || "-----"}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td className="font-bold">{t("totall")}</td>
                    <td className="font-bold">-----</td>
                    <td className="font-bold">{renderPrice?.totalAmount}</td>
                    <td className="font-bold">
                      {numberWithCommas(order?.price || 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          {renderBtns}
        </div>
      </Card>
      {renderModals}
    </>
  );
};

export default ShowFormRequests;
