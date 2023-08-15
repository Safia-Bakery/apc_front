import Header from "../Header";
import Modal from "../Modal";
import styles from "./index.module.scss";
import BaseInput from "../BaseInputs";
import MainTextArea from "../BaseInputs/MainTextArea";
import { useForm } from "react-hook-form";
import MainInput from "../BaseInputs/MainInput";
import useTools from "src/hooks/useTools";
import IearchSelect from "../IerchySelect";
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
import useToken from "src/hooks/useToken";

const AddProductModal = () => {
  const { id } = useParams();
  const removeRoute = useRemoveParams();
  const navigate = useNavigateParams();
  const modal = useQueryString("add_product_modal");
  const productJson = useQueryString("product");
  const itemModal = useQueryString("itemModal");
  const product = JSON.parse(productJson!) as { id: number; name: string };

  const { data: me } = useToken({ enabled: false });
  //@ts-ignore
  // const brigadir = me!.permissions.isbrigadir; //todo

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
    // if (!!modal && brigadir) iearchRefetch(); //todo
    if (!!modal) iearchRefetch();
  }, [modal]);

  return (
    <Modal
      className={styles.modal}
      isOpen={!!modal}
      // isOpen={!!modal && brigadir}  //todo
      onClose={handleModal}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Header title="Добавить расходной товар">
          <button onClick={handleModal} className="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </Header>
        <div className={styles.block}>
          <div className={styles.modalBody}>
            <div className="form-group field-apcitems-product_id position-relative">
              <label className="control-label">Товар</label>
              <div className="form-control" onClick={handleProducts}>
                {!product?.name ? "Выберите продукт" : product.name}
              </div>
              {/* {!!itemModal && itemModal !== "false" && brigadir && (  //todo*/}
              {!!itemModal && itemModal !== "false" && <IearchSelect />}
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
