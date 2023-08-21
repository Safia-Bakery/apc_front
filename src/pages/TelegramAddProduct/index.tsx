import styles from "./index.module.scss";
import { useForm } from "react-hook-form";
import useTools from "src/hooks/useTools";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
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
import deleteExpenditureMutation from "src/hooks/mutation/deleteExpenditure";
import Card from "src/components/Card";
import UploadComponent, { FileItem } from "src/components/FileUpload";
import { reportImgSelector, uploadReport } from "src/redux/reducers/selects";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import uploadFileMutation from "src/hooks/mutation/uploadFile";

const column = [{ name: "Наименование" }, { name: "Количество" }, { name: "" }];

const TelegramAddProduct = () => {
  const { id } = useParams();
  const removeRoute = useRemoveParams();
  const navigate = useNavigateParams();
  const productJson = useQueryString("product");
  const dispatch = useAppDispatch();
  const itemModal = useQueryString("itemModal");
  const product = JSON.parse(productJson!) as { id: number; name: string };
  const { mutate: attach } = attachBrigadaMutation();
  const { mutate: deleteExp } = deleteExpenditureMutation();
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);

  const { mutate: uploadFile } = uploadFileMutation();
  const handleFilesSelected = (data: FileItem[]) =>
    dispatch(uploadReport(data));

  const { mutate } = usedItemsMutation();
  const { data: order, refetch } = useOrder({
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
          refetch();
        },
      }
    );
  };

  const handleDelete = (id: number) => () => {
    deleteExp(id, {
      onSuccess: (data: any) => {
        if (data.success) {
          successToast("Успешно удалено");
          refetch();
        }
      },
    });
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
              Telegram.WebApp.MainButton.setText("Закрыть")
                .show()
                .onClick(function () {
                  //@ts-ignore
                  const data = JSON.stringify({ success: true });
                  //@ts-ignore
                  Telegram.WebApp.sendData(data);
                  //@ts-ignore
                  Telegram.WebApp.close();
                });
            }
          },
        }
      );
    };

  const handlerSubmitFile = () => {
    if (upladedFiles?.length)
      uploadFile(
        {
          request_id: Number(id),
          files: upladedFiles,
        },
        {
          onSuccess: () => {
            successToast("Сохранено");
            inputRef.current.value = null;
            dispatch(uploadReport(null));
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

          <div className={styles.uploadPhoto}>
            <Header title={"Добавить фотоотчёт"} />
            <div className="m-3">
              <UploadComponent
                onFilesSelected={handleFilesSelected}
                inputRef={inputRef}
              />
              <button
                onClick={handlerSubmitFile}
                type="button"
                className="btn btn-success float-end btn-fill my-3"
              >
                Сохранить
              </button>
            </div>
          </div>

          {!!order?.expanditure?.length && (
            <table className="table table-hover">
              <thead>
                <tr>
                  {column.map(({ name }) => {
                    return (
                      <th className={styles.tableHead} key={name}>
                        {name}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {order?.expanditure?.map((item) => (
                  <tr className="bg-blue" key={item.id}>
                    <td>{item?.tool?.name}</td>
                    <td>{item?.amount}</td>
                    <td width={50}>
                      <div
                        className="d-flex justify-content-center pointer"
                        onClick={handleDelete(item.id)}
                      >
                        <img src="/assets/icons/delete.svg" alt="delete" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <hr />

        <div className={styles.footer}>
          <button
            type="button"
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
  );
};

export default TelegramAddProduct;
