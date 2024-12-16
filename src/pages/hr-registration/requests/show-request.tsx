import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import dayjs from "dayjs";
import successToast from "@/utils/successToast";
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
import { Checkbox, Flex, Popconfirm } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import MainInput from "@/components/BaseInputs/MainInput";
import warnToast from "@/utils/warnToast";
import errorToast from "@/utils/errorToast";
import { editAddAppointment, getAppointment } from "@/hooks/hr-registration";

const ShowHrRequest = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [modal, $modal] = useState<ModalTypes>();
  const { mutate, isPending: attaching } = editAddAppointment();
  const handleModal = (type: ModalTypes) => () => $modal(type);

  const {
    data: order,
    refetch: orderRefetch,
    isLoading,
  } = getAppointment({ id: Number(id) });
  const isNew = order?.status === RequestStatus.new;
  const navigate = useNavigate();
  const { watch, register, handleSubmit, getValues } = useForm();
  const handleBack = () => navigate("/hr-requests");

  const closeModal = () => $modal(undefined);

  const handleRequest = ({ status }: { status: RequestStatus }) => {
    const { fixedReason, cancel_reason } = getValues();
    mutate(
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
        },
        onError: (e) => errorToast(e.message),
      }
    );
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
            onClick={() => handleRequest({ status: RequestStatus.received })}
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
              onClick={() => handleRequest({ status: RequestStatus.finished })}
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
            onSubmit={handleSubmit(() =>
              handleRequest({ status: RequestStatus.closed_denied })
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
  }, [order?.status, modal, watch("fixedReason")]);

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
                    <th>{t("creator")}</th>
                    <td className="w-1/2"> {order?.user?.full_name}</td>
                  </tr>
                  {/* <tr>
                    <th>{t("phone_number")}</th>
                    <td>
                      <a href={`tel:+${order?.user?.phone_number}`}>
                        +{order?.user?.phone_number}
                      </a>
                    </td>
                  </tr> */}

                  <tr>
                    <th>{t("branch")}</th>
                    <td>{order?.branch?.name}</td>
                  </tr>

                  <tr>
                    <th>{t("employee")}</th>
                    <td>{order?.employee_name}</td>
                  </tr>

                  <tr>
                    <th>{t("position")}</th>
                    <td>{order?.position?.name}</td>
                  </tr>

                  <tr>
                    <th>{t("description")}</th>
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
                    <th>{t("receipt_date")}:</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("meeting_time")}:</th>
                    <td>
                      {order?.time_slot
                        ? dayjs(order?.time_slot).format(dateTimeFormat)
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
      {renderModals}
    </>
  );
};

export default ShowHrRequest;
