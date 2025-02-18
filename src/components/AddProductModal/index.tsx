import Header from "../Header";
import styles from "./index.module.scss";
import BaseInput from "../BaseInputs";
import MainTextArea from "../BaseInputs/MainTextArea";
import { Controller, useForm } from "react-hook-form";
import MainInput from "../BaseInputs/MainInput";
import { useParams } from "react-router-dom";
import usedItemsMutation from "@/hooks/mutation/usedItems";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import useOrder from "@/hooks/useOrder";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import { Departments } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import useSyncExpanditure from "@/hooks/sync/useSyncExpanditure";
import BaseInputs from "../BaseInputs";
import { SelectWrapper } from "../InputWrappers";
import cl from "classnames";
import Loading from "../Loader";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "antd";
import { getInvRequest } from "@/hooks/inventory";

interface Props {
  addExp: MainPermissions;
  handleModal: () => void;
  modal?: boolean;
}

const AddProductModal = ({ addExp, modal, handleModal }: Props) => {
  const { t } = useTranslation();
  const { id, dep } = useParams();
  const permissions = useAppSelector(permissionSelector);
  const { refetch: syncWithIiko, isFetching } = useSyncExpanditure({
    enabled: false,
  });

  const { refetch: invRefetch } = getInvRequest({
    id: Number(id),
    department: Number(dep),
    enabled: false,
  });

  const { mutate, isPending: isLoading } = usedItemsMutation();
  const { refetch: orderRefetch } = useOrder({
    id: Number(id),
    enabled: false,
  });

  const { register, handleSubmit, getValues, reset, control, watch, setValue } =
    useForm();

  const onSubmit = () => {
    const { count, comment, product } = getValues();

    mutate(
      {
        amount: count,
        request_id: Number(id),
        tool_id: product.value,
        comment,
      },
      {
        onSuccess: () => {
          successToast("submitted");
          reset();
          handleModal();
          orderRefetch();
          if (!!dep) invRefetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const handleIncrement = () => setValue("count", +watch("count") + 1);

  const handleDecrement = () => {
    if (+watch("count") > 1) setValue("count", +watch("count") - 1);
  };

  useEffect(() => {
    reset({ count: 1 });
  }, []);

  return (
    <Modal
      className={styles.modal}
      open={!!modal && !!permissions?.has(addExp)}
      onCancel={handleModal}
      closable
      footer={false}
      classNames={{ content: "!p-0" }}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Header title={t("add_used_products")} />
        <div className={styles.block}>
          {/* <button
            disabled={isFetching}
            type="button"
            className="btn btn-primary float-end mr-3 z-30 relative"
            onClick={() => syncWithIiko()}
          >
            {isFetching ? (
              <div className="w-6 ">
                <Loading is_static />
              </div>
            ) : (
              t("sync_with_iico")
            )}
          </button> */}
          <div className={styles.modalBody}>
            <div className="form-group field-apcitems-product_id relative">
              {permissions?.has(addExp) && (
                <Controller
                  name={"product"}
                  control={control}
                  render={({ field }) => (
                    <BaseInputs className="!mb-0 mt-4" label="select_product">
                      <SelectWrapper
                        department={Departments.APC}
                        field={field}
                        register={register("product")}
                      />
                    </BaseInputs>
                  )}
                />
              )}
            </div>

            <BaseInput label="quantity">
              <div className="flex gap-4 w-full">
                <button
                  type="button"
                  className={cl(styles.increment, "btn bg-danger text-white")}
                  onClick={handleDecrement}
                >
                  -
                </button>
                <div className="w-16">
                  <MainInput
                    type="number"
                    register={register("count")}
                    className="!mb-0"
                  />
                </div>
                <button
                  className={cl(styles.increment, "btn bg-green-400")}
                  type="button"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
            </BaseInput>

            <BaseInput label="comment">
              <MainTextArea register={register("comment")} />
            </BaseInput>
          </div>

          <hr />

          <div className={styles.footer}>
            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-success  "
            >
              {t("add")}
            </button>
          </div>
        </div>
      </form>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default AddProductModal;
