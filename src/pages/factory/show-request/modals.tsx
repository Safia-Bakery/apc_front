import cl from "classnames";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import {
  BaseReturnBoolean,
  BrigadaType,
  Departments,
  FileType,
  ModalTypes,
  RequestStatus,
  Sphere,
} from "@/utils/types";
import Header from "@/components/Header";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import { CancelReason, detectFileType } from "@/utils/helpers";
import MainSelect from "@/components/BaseInputs/MainSelect";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import useOrder from "@/hooks/useOrder";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import useQueryString from "custom/useQueryString";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import useBrigadas from "@/hooks/useBrigadas";
import Loading from "@/components/Loader";
import useCategories from "@/hooks/useCategories";
import MainInput from "@/components/BaseInputs/MainInput";
import AsyncAccordion from "@/components/AsyncAccordion";
import {
  apcFactoryRequestMutation,
  getApcFactoryManagers,
  getApcFactoryRequest,
} from "@/hooks/factory";
import { useEffect } from "react";

interface Params {
  status?: RequestStatus;
  brigada_id?: number;
  time?: string;
  car_id?: number;
  categ?: boolean;
}

const ApcModals = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const modal = Number(useQueryString("modal"));
  const photo = useQueryString("photo");
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attaching } = apcFactoryRequestMutation();
  const { register, getValues, watch, handleSubmit, reset } = useForm();

  const closeModal = () => removeParams(["modal"]);

  const { data: categories, isLoading: categoriesLoading } = useCategories({
    enabled: modal === ModalTypes.changeCateg,
    department: Departments.APC,
    sphere_status: Sphere.fabric,
    category_status: 1,
  });

  const { data: brigades, isFetching: brigadaLoading } = useBrigadas({
    enabled: false,
    department: Departments.APC,
    sphere_status: Sphere.fabric,
  });

  const {
    refetch: orderRefetch,
    isFetching: orderFetching,
    data: order,
  } = getApcFactoryRequest({
    id: Number(id),
  });

  const handleUpdate =
    ({ status, brigada_id, categ }: Params) =>
    () => {
      const { fixedReason, cancel_reason, category_id } = getValues();
      attach(
        {
          id: Number(id),
          status: !!status ? status : order?.status,
          brigada_id: !!brigada_id ? Number(brigada_id) : order?.brigada?.id,
          category_id: categ ? category_id : order?.category?.id,
          ...(status === RequestStatus.closed_denied && {
            deny_reason:
              fixedReason < 4 ? t(CancelReason[fixedReason]) : cancel_reason,
          }),
        },
        {
          onSuccess: () => {
            orderRefetch();
            successToast("updated");
          },
          onError: (e) => errorToast(e.message),
        }
      );
      closeModal();
    };

  const renderModal = () => {
    if (modal === ModalTypes.assign)
      return (
        <div className={"w-[420px]"}>
          <Header title="select_handler">
            <button onClick={closeModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </Header>
          <div className={"overflow-y-auto max-h-80 h-full mt-2"}>
            {brigadaLoading ? (
              <Loading is_static />
            ) : (
              brigades?.items.map((item, idx) => (
                <div
                  key={idx}
                  className={
                    "flex justify-between border-b border-b-black py-4 pr-1 pl-4 items-center"
                  }
                >
                  <h6 className="text-lg mb-0">{item?.name}</h6>
                  <button
                    id="attach_to_bridaga"
                    onClick={handleUpdate({
                      status: RequestStatus.received,
                      brigada_id: item.id,
                    })}
                    className="btn btn-success btn-sm"
                  >
                    {t("assign")}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      );
    if (modal === ModalTypes.cancelRequest)
      return (
        <form
          onSubmit={handleSubmit(
            handleUpdate({
              status: RequestStatus.closed_denied,
            })
          )}
          className={"w-[420px]"}
        >
          <Header title="deny_reason">
            <button onClick={closeModal} className="close">
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

    if (modal === ModalTypes.changeCateg)
      return (
        <>
          <Header title="change">
            <button onClick={closeModal} className="close">
              <span>&times;</span>
            </button>
          </Header>
          <BaseInput label="select_category">
            <MainSelect
              values={categories?.items}
              register={register("category_id")}
            />
          </BaseInput>
          <div className="min-w-96">
            <button
              className="btn btn-success w-full"
              onClick={handleUpdate({ categ: true })}
            >
              {t("apply")}
            </button>
          </div>
        </>
      );

    if (modal === ModalTypes.showPhoto)
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

    // if (modal === ModalTypes.changeCateg) return <AsyncAccordion />;
  };

  useEffect(() => {
    if (modal === ModalTypes.changeCateg)
      reset({
        category_id: order?.category?.id,
      });
  }, [modal, order?.category]);

  if (
    (categoriesLoading && modal === ModalTypes.changeCateg) ||
    orderFetching ||
    attaching
  )
    return <Loading />;

  return (
    <Modal
      onClose={() => removeParams(["modal", !!photo ? "photo" : ""])}
      isOpen={!!modal && modal !== ModalTypes.closed}
      className={cl("!h-[400px] w-min min-w-56 p-1 overflow-y-auto")}
    >
      {renderModal()}
    </Modal>
  );
};

export default ApcModals;
