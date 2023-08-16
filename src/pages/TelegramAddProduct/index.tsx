import styles from "./index.module.scss";
import { useForm } from "react-hook-form";
import useTools from "src/hooks/useTools";
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
import IearchSelect from "src/components/IerchySelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainTextArea from "src/components/BaseInputs/MainTextArea";
import Header from "src/components/Header";
import { RequestStatus } from "src/utils/types";
import attachBrigadaMutation from "src/hooks/mutation/attachBrigadaMutation";
import cl from "classnames";

const TelegramAddProduct = () => {
  const { id } = useParams();
  const removeRoute = useRemoveParams();
  const navigate = useNavigateParams();
  const productJson = useQueryString("product");
  const itemModal = useQueryString("itemModal");
  const product = JSON.parse(productJson!) as { id: number; name: string };
  const { mutate: attach } = attachBrigadaMutation();

  const { mutate } = usedItemsMutation();
  const { data: order } = useOrder({
    id: Number(id),
  });

  const { refetch: iearchRefetch } = useTools({
    enabled: false,
  });

  const { register, handleSubmit, getValues, reset } = useForm();

  const handleProducts = () => {
    navigate({ itemModal: true });
  };

  const onSubmit = () => {
    const { count, comment } = getValues();
    mutate(
      {
        amount: count,
        request_id: Number(id),
        tool_id: product?.id,
        comment,
      },
      {
        onSuccess: () => {
          successToast("Продукт добавлен");
          removeRoute(["product"]);
          reset();
        },
      }
    );
  };

  const handleFinishOrder =
    ({ status }: { status: RequestStatus }) =>
    () => {
      attach(
        {
          request_id: Number(id),
          brigada_id: Number(order?.brigada?.id),
          status,
        },
        {
          onSuccess: (data: any) => {
            if (data.status === 200) {
              successToast("Успешно закончен");
              //@ts-ignore
              Telegram.WebApp.close();
            }
          },
        }
      );
    };

  useEffect(() => {
    // if (!!modal && brigadir) iearchRefetch(); //todo
    iearchRefetch();
  }, []);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Header title="Добавить расходной товар" />

      <div className={styles.block}>
        <div className={styles.modalBody}>
          <div className="form-group field-apcitems-product_id position-relative">
            <label className="control-label">Товар</label>
            <div
              className={cl("form-control", styles.input)}
              onClick={handleProducts}
            >
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
          <button
            onClick={handleFinishOrder({ status: RequestStatus.done })}
            className="btn btn-success btn-fill"
          >
            Починил
          </button>
          <button type="submit" className="btn btn-info btn-primary">
            Добавить
          </button>
        </div>
      </div>
    </form>
    // </Modal>
  );
};

export default TelegramAddProduct;
