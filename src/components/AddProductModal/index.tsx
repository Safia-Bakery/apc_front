import Header from "../Header";
import Modal from "../Modal";
import styles from "./index.module.scss";
import BaseInput from "../BaseInputs";
import MainTextArea from "../BaseInputs/MainTextArea";
import { Controller, useForm } from "react-hook-form";
import MainInput from "../BaseInputs/MainInput";
import useTools from "@/hooks/useTools";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import usedItemsMutation from "@/hooks/mutation/usedItems";
import { successToast } from "@/utils/toast";
import useOrder from "@/hooks/useOrder";
import useQueryString from "custom/useQueryString";
import { useRemoveParams } from "custom/useCustomNavigate";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import { MainPermissions } from "@/utils/types";
import useSyncExpanditure from "@/hooks/sync/useSyncExpanditure";
import BaseInputs from "../BaseInputs";
import { SelectWrapper } from "../InputWrappers";

const AddProductModal = () => {
  const { id } = useParams();
  const removeRoute = useRemoveParams();
  const addExp = Number(useQueryString("addExp")) as MainPermissions;
  const modal = useQueryString("add_product_modal");
  const permissions = useAppSelector(permissionSelector);
  const { refetch: syncWithIiko, isFetching } = useSyncExpanditure({
    enabled: false,
  });

  const { mutate } = usedItemsMutation();
  const { refetch: orderRefetch } = useOrder({
    id: Number(id),
    enabled: false,
  });

  const { refetch: iearchRefetch } = useTools({
    enabled: false,
  });

  const { register, handleSubmit, getValues, reset, control } = useForm();

  const handleModal = () => {
    if (!!modal) removeRoute(["add_product_modal"]);
  };

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
        },
      }
    );
  };

  useEffect(() => {
    if (!!modal && !!permissions?.[addExp]) iearchRefetch();
  }, [modal, permissions?.[addExp]]);

  return (
    <Modal
      className={styles.modal}
      isOpen={!!modal && !!permissions?.[addExp]}
      onClose={handleModal}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Header title="Добавить расходной товар">
          <button onClick={handleModal} className="close ml-2">
            <span aria-hidden="true">&times;</span>
          </button>
        </Header>
        <div className={styles.block}>
          <button
            disabled={isFetching}
            className="btn btn-primary float-end mr-3 z-3 relative"
            onClick={() => syncWithIiko()}
          >
            {isFetching ? (
              <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Синхронизировать с iiko"
            )}
          </button>
          <div className={styles.modalBody}>
            <div className="form-group field-apcitems-product_id relative">
              {permissions?.[addExp] && (
                <Controller
                  name={"product"}
                  control={control}
                  render={({ field }) => (
                    <BaseInputs className="!mb-0 mt-4" label="Выберите продукт">
                      <SelectWrapper
                        field={field}
                        register={register("product")}
                      />
                    </BaseInputs>
                  )}
                />
              )}
            </div>

            <BaseInput label="Количество">
              <MainInput type="number" register={register("count")} />
            </BaseInput>

            <BaseInput label="Примичание">
              <MainTextArea register={register("comment")} />
            </BaseInput>
          </div>

          <hr />

          <div className={styles.footer}>
            <button type="submit" className="btn btn-success btn-fill">
              Добавить
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
