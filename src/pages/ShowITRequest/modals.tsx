import { FC, useMemo, useRef, KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import cl from "classnames";
import {
  BrigadaType,
  FileType,
  MarketingSubDepRu,
  ModalTypes,
  RequestStatus,
} from "@/utils/types";
import { CancelReason, detectFileType } from "@/utils/helpers";
import { errorToast, successToast } from "@/utils/toast";
import useOrder from "@/hooks/useOrder";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import useQueryString from "custom/useQueryString";
import { useRemoveParams } from "custom/useCustomNavigate";
import useBrigadas from "@/hooks/useBrigadas";

import marketingReassignMutation from "@/hooks/mutation/marketingReassign";
import useCategories from "@/hooks/useCategories";
import useCars from "@/hooks/useCars";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import BaseInput from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import Modal from "@/components/Modal";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import BranchSelect from "@/components/BranchSelect";
import useUpdateQueryStr from "@/hooks/custom/useUpdateQueryStr";
import orderMsgMutation from "@/hooks/mutation/orderMsg";
import MainInput from "@/components/BaseInputs/MainInput";
import dayjs from "dayjs";

const ITModals = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const modal = Number(useQueryString("modal"));
  const [deadline, $deadline] = useState<Date>();
  const photo = useQueryString("photo");
  const sphere_status = Number(useQueryString("sphere_status"));
  const dep = Number(useQueryString("dep"));
  const removeParams = useRemoveParams();
  const { mutate: reassign, isPending: reassigning } =
    marketingReassignMutation();
  const { mutate: attach, isPending: attaching } = attachBrigadaMutation();
  const { register, getValues, watch, handleSubmit, reset } = useForm();
  const branchJson = useUpdateQueryStr("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const closeModal = () => removeParams(["changeModal"]);

  const { data: categories, isLoading: categoriesLoading } = useCategories({
    sub_id: Number(watch("direction")),
    enabled: !!watch("direction"),
    category_status: 1,
  });

  const { data: brigades, isFetching: brigadaLoading } = useBrigadas({
    enabled: false,
    ...(!!dep && { department: dep }),
    ...(!!sphere_status && { sphere_status }),
  });

  const {
    refetch: orderRefetch,
    isFetching: orderFetching,
    data: order,
  } = useOrder({
    id: Number(id),
  });
  const handleDeadline = (event: Date) => $deadline(event);

  const handleReassign = () => {
    reassign(
      {
        id: Number(id),
        category_id: getValues("category_id"),
      },
      {
        onSuccess: () => {
          orderRefetch();
          successToast("assigned");
          removeParams(["modal"]);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };
  const { mutate: msgMutation, isPending: msgLoading } = orderMsgMutation();
  const handleMessage = () => {
    const { left_comment, uploaded_photo } = getValues();
    msgMutation(
      {
        request_id: Number(id),
        message: left_comment,
        photo: uploaded_photo[0],
      },
      {
        onSuccess: () => {
          orderRefetch();
          closeModal();
          successToast("success");
          reset({});
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleMessage();
    }
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
            onError: (e) => errorToast(e.message),
          }
        );
    };

  const handleBrigada =
    ({
      status,
      item,
      time,
      car_id,
    }: {
      status?: RequestStatus;
      item?: BrigadaType;
      time?: string;
      car_id?: number;
    }) =>
    () => {
      const { fixedReason, cancel_reason, pause_reason } = getValues();
      attach(
        {
          request_id: Number(id),
          status,
          ...(!!time && { finishing_time: time }),
          ...(!!car_id && { car_id }),
          ...(!!pause_reason && { pause_reason }),
          ...(!!item && { brigada_id: Number(item?.id) }),
          ...(status === RequestStatus.rejected_wating_confirmation && {
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
      removeParams(["modal"]);
    };

  const renderModal = () => {
    switch (modal) {
      case ModalTypes.assign:
        return (
          <div className={"w-[420px]"}>
            <Header title="select_handler">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className={"overflow-y-auto max-h-80 h-full mt-2"}>
              {brigadaLoading ? (
                <Loading />
              ) : (
                brigades?.items
                  .filter((item) => !!item.user!?.length && !!item.status)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className={
                        "flex justify-between border-b border-b-black py-4 pr-1 pl-4 items-center"
                      }
                    >
                      <h6 className="text-lg mb-0">{item?.name}</h6>
                      <button
                        id="attach_to_bridaga"
                        onClick={handleBrigada({
                          status: RequestStatus.confirmed,
                          item,
                        })}
                        className="btn btn-success btn-fill btn-sm"
                      >
                        {t("assign")}
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        );
      case ModalTypes.cancelRequest:
        return (
          <form
            onSubmit={handleSubmit(
              handleBrigada({
                status: RequestStatus.rejected_wating_confirmation,
              })
            )}
            className={"w-[420px]"}
          >
            <Header title="deny_reason">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
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
      case ModalTypes.pause:
        return (
          <form
            onSubmit={handleSubmit(
              handleBrigada({ status: RequestStatus.paused })
            )}
            className={"w-[420px]"}
          >
            <Header title="pause_reason">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className="p-3">
              <BaseInput label="comments">
                <MainTextArea register={register("pause_reason")} autoFocus />
              </BaseInput>

              <button className="btn btn-success" type="submit">
                {t("send")}
              </button>
            </div>
          </form>
        );

      case ModalTypes.showPhoto:
        return (
          <div className={"relative"}>
            <button
              onClick={() => removeParams(["modal", "photo"])}
              className={cl(
                "absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center border border-white"
              )}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <Link to={photo || ""} target="_blank" rel="noopener noreferrer">
              {photo && detectFileType(photo) === FileType.photo ? (
                <img
                  src={photo}
                  className={"max-h-[80vh] max-w-[80vw] block h-full"}
                  alt="uploaded-file"
                />
              ) : (
                <video
                  src={photo || ""}
                  className={"max-h-[80vh] max-w-[80vw] block h-full"}
                  controls
                />
              )}
            </Link>
          </div>
        );

      case ModalTypes.reassign:
        return (
          <div className="min-w-[380px] p-4">
            <BaseInput label="select_direction">
              <MainSelect
                values={MarketingSubDepRu}
                register={register("direction")}
              />
            </BaseInput>

            <BaseInput label="select_category">
              <MainSelect
                values={categories?.items || []}
                register={register("category_id", {
                  required: t("required_field"),
                })}
              />
            </BaseInput>

            <button
              onClick={handleReassign}
              className="btn btn-success btn-fill btn-sm float-end"
            >
              {t("redirect")}
            </button>
          </div>
        );
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
            <BaseInput label="select_category">
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

            <BaseInput label="upload_photo">
              <MainInput type="file" register={register("uploaded_photo")} />
            </BaseInput>

            <button
              className="btn btn-success btn-fill w-full"
              onClick={handleMessage}
            >
              {t("apply")}
            </button>
          </>
        );

      case ModalTypes.assingDeadline:
        return (
          <>
            <div>
              <BaseInput label="select_deadline">
                <MainDatePicker
                  showTimeSelect
                  selected={
                    !!deadline || order?.finishing_time
                      ? dayjs(deadline || order?.finishing_time).toDate()
                      : undefined
                  }
                  onChange={handleDeadline}
                />
              </BaseInput>

              <button
                onClick={handleBrigada({
                  time: deadline?.toISOString(),
                })}
                className="btn btn-success btn-fill w-full"
              >
                {t("apply")}
              </button>
            </div>
          </>
        );

      default:
        return;
    }
  };

  if (
    orderFetching ||
    (categoriesLoading && !!watch("direction")) ||
    attaching ||
    reassigning
  )
    return <Loading absolute />;

  return (
    <Modal
      onClose={() => removeParams(["modal", !!photo ? "photo" : ""])}
      isOpen={!!modal && modal !== ModalTypes.closed}
      className={cl("!h-[400px] w-min p-1 overflow-y-auto")}
    >
      {renderModal()}
    </Modal>
  );
};

export default ITModals;
