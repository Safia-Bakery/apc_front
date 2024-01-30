import Header from "../Header";
import Modal from "../Modal";
import styles from "./index.module.scss";
import BaseInput from "../BaseInputs";
import MainTextArea from "../BaseInputs/MainTextArea";
import { Controller, useForm } from "react-hook-form";
import MainInput from "../BaseInputs/MainInput";
import { useParams } from "react-router-dom";
import usedItemsMutation from "@/hooks/mutation/usedItems";
import { errorToast, successToast } from "@/utils/toast";
import useOrder from "@/hooks/useOrder";
import useQueryString from "custom/useQueryString";
import { useRemoveParams } from "custom/useCustomNavigate";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import { Departments, MainPermissions } from "@/utils/types";
import useSyncExpanditure from "@/hooks/sync/useSyncExpanditure";
import BaseInputs from "../BaseInputs";
import { SelectWrapper } from "../InputWrappers";
import cl from "classnames";
import Loading from "../Loader";
import { useEffect } from "react";

interface Props {
  addExp: MainPermissions;
}

const AddProductModal = ({ addExp }: Props) => {
  const { id } = useParams();
  const removeRoute = useRemoveParams();
  const modal = useQueryString("add_product_modal");
  const permissions = useAppSelector(permissionSelector);
  const { refetch: syncWithIiko, isFetching } = useSyncExpanditure({
    enabled: false,
  });

  const { mutate, isLoading } = usedItemsMutation();
  const { refetch: orderRefetch } = useOrder({
    id: Number(id),
    enabled: false,
  });

  const { register, handleSubmit, getValues, reset, control, watch, setValue } =
    useForm();

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
        onError: (e: any) => errorToast(e.message),
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
            type="button"
            className="btn btn-primary float-end mr-3 z-30 relative"
            onClick={() => syncWithIiko()}
          >
            {isFetching ? (
              <div className="w-6 ">
                <Loading />
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
                        department={Departments.apc}
                        field={field}
                        register={register("product")}
                      />
                    </BaseInputs>
                  )}
                />
              )}
            </div>

            {/* <BaseInput label="Количество">
              <MainInput type="number" register={register("count")} />
            </BaseInput> */}

            <BaseInput label="Количество">
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

            <BaseInput label="Примичание">
              <MainTextArea register={register("comment")} />
            </BaseInput>
          </div>

          <hr />

          <div className={styles.footer}>
            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-success btn-fill"
            >
              Добавить
            </button>
          </div>
        </div>
      </form>
      {isLoading && <Loading absolute />}
    </Modal>
  );
};

export default AddProductModal;
