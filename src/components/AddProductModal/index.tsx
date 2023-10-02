import Header from "../Header";
import Modal from "../Modal";
import styles from "./index.module.scss";
import BaseInput from "../BaseInputs";
import MainTextArea from "../BaseInputs/MainTextArea";
import { useForm } from "react-hook-form";
import MainInput from "../BaseInputs/MainInput";
import useTools from "src/hooks/useTools";
import ToolsSelect from "../ToolsSelect";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import usedItemsMutation from "src/hooks/mutation/usedItems";
import { successToast } from "src/utils/toast";
import useOrder from "src/hooks/useOrder";
import useQueryString from "src/hooks/useQueryString";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";
import { permissionSelector } from "src/redux/reducers/auth";
import { useAppSelector } from "src/redux/utils/types";
import { MainPermissions } from "src/utils/types";
import useSyncExpanditure from "src/hooks/sync/useSyncExpanditure";

const AddProductModal = () => {
  const { id } = useParams();
  const removeRoute = useRemoveParams();
  const navigate = useNavigateParams();
  const addExp = Number(useQueryString("addExp")) as MainPermissions;
  const modal = useQueryString("add_product_modal");
  const productJson = useQueryString("product");
  const itemModal = useQueryString("itemModal");
  const product = JSON.parse(productJson!) as { id: number; name: string };
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

  const { register, handleSubmit, getValues, reset } = useForm();

  const handleProducts = () => {
    navigate({ itemModal: true });
  };

  const handleModal = () => {
    if (!!modal) removeRoute(["add_product_modal", "product", "itemModal"]);
  };

  const onSubmit = () => {
    const { count, comment } = getValues();
    mutate(
      {
        amount: count,
        request_id: Number(id),
        tool_id: product.id,
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
            className="btn btn-primary float-end mr-3 z-3 position-relative"
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
            <div className="form-group field-apcitems-product_id position-relative">
              <label className="control-label">Товар</label>
              <div
                className="form-control"
                onClick={handleProducts}
                id="choose_product"
              >
                {!product?.name ? "Выберите продукт" : product.name}
              </div>

              {!!itemModal &&
                itemModal !== "false" &&
                permissions?.[addExp] && <ToolsSelect />}
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
