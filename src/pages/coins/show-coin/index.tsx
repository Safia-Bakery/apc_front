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
import BaseInput from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";
import { editCoinRequest, getCoin } from "@/hooks/coins";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import { Modal } from "antd";

const ShowCoin = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { handleSubmit, watch } = useForm();
  const navigate = useNavigate();
  const { mutate: attach, isPending: attaching } = editCoinRequest();
  const [modal, $modal] = useState<ModalTypes>();

  const handleModal = (type: ModalTypes) => () => $modal(type);
  const { getValues, register } = useForm();

  const {
    data: order,
    refetch: orderRefetch,
    isLoading,
  } = getCoin({ id: Number(id) });

  const isNew = order?.status === RequestStatus.new;

  const handleBack = () => navigate(-1);
  const closeModal = () => $modal(undefined);

  const handleChange = ({ status }: { status: RequestStatus }) => {
    const { fixedReason, cancel_reason } = getValues();
    attach(
      {
        id: Number(id),
        status,
        ...(status === RequestStatus.closed_denied && {
          deny_reason:
            fixedReason < 4 ? t(CancelReason[fixedReason]) : cancel_reason,
        }),
      },
      {
        onSuccess: () => {
          orderRefetch();
          successToast("assigned");
          closeModal();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const renderChangeModals = useMemo(() => {
    if (modal === ModalTypes.cancelRequest)
      return (
        <form
          onSubmit={handleSubmit(() =>
            handleChange({ status: RequestStatus.closed_denied })
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
      );
  }, [modal]);

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
            onClick={() => handleChange({ status: RequestStatus.received })}
            className="btn btn-success"
            id="recieve_request"
          >
            {t("finish")}
          </button>
        </div>
      );
  }, [order?.status]);

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
                    <th>{t("department")}</th>
                    <td>{order?.fillial?.name}</td>
                  </tr>

                  <tr>
                    <th>{t("event_description")}</th>
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
                    <th>{t("changed")}</th>
                    <td>
                      {!!order?.user_manager
                        ? order?.user_manager
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("summ")}</th>
                    <td>{numberWithCommas(Number(order?.amount))}</td>
                  </tr>

                  <tr>
                    <th>{t("receipt_date")}</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("finished")}</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
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
          {renderBtns}
        </div>
      </Card>
      <Modal
        open={!!modal}
        closable
        onCancel={closeModal}
        footer={null}
        classNames={{ content: "!p-0" }}
      >
        {renderChangeModals}
      </Modal>
    </>
  );
};

export default ShowCoin;
