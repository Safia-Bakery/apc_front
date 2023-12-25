import styles from "./index.module.scss";
import { useForm } from "react-hook-form";
import useTools from "@/hooks/useTools";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import usedItemsMutation from "@/hooks/mutation/usedItems";
import { successToast } from "@/utils/toast";
import useOrder from "@/hooks/useOrder";
import useQueryString from "custom/useQueryString";
import { useRemoveParams } from "custom/useCustomNavigate";
import ToolsSelect from "@/components/ToolsSelect";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import Header from "@/components/Header";
import { RequestStatus } from "@/utils/types";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import deleteExpenditureMutation from "@/hooks/mutation/deleteExpenditure";
import UploadComponent, { FileItem } from "@/components/FileUpload";
import { reportImgSelector, uploadReport } from "reducers/selects";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import uploadFileMutation from "@/hooks/mutation/uploadFile";
import useSyncExpanditure from "@/hooks/sync/useSyncExpanditure";
import { TelegramApp } from "@/utils/tgHelpers";

const column = [{ name: "Наименование" }, { name: "Количество" }, { name: "" }];

const TelegramAddProduct = () => {
  const { id } = useParams();
  const removeRoute = useRemoveParams();
  const productJson = useQueryString("product");
  const dispatch = useAppDispatch();
  const product = JSON.parse(productJson!) as { id: number; name: string };
  const { mutate: attach } = attachBrigadaMutation();
  const { mutate: deleteExp } = deleteExpenditureMutation();
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);
  const [count, $count] = useState(1);

  const { refetch: syncWithIiko, isFetching } = useSyncExpanditure({
    enabled: false,
  });

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

  const onSubmit = () => {
    const { comment } = getValues();
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
              TelegramApp.toMainScreen();
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

  const handleCount = (val: number) => $count(val);

  const handleIncrement = () => $count((prev) => prev + 1);
  const handleDecrement = () => $count((prev) => prev - 1);

  useEffect(() => {
    iearchRefetch();
  }, []);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Добавить расходной товар</h2>
      </div>

      <div className={styles.block}>
        <div className={styles.modalBody}>
          <div className="flex justify-content-end">
            <button
              className="btn btn-primary z-3 relative"
              onClick={() => syncWithIiko()}
            >
              {isFetching ? (
                <div className="spinner-border text-warning" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Обновить"
              )}
            </button>
          </div>
          <BaseInput label="Выберите продукт">
            <ToolsSelect />
          </BaseInput>

          {/* <BaseInput label="Количество"> */}
          <div className="flex gap-2 my-4">
            <span className={styles.label}>Количество</span>
            <button
              type="button"
              className={styles.increment}
              disabled={count <= 1}
              onClick={handleDecrement}
            >
              -
            </button>
            <input
              type="number"
              className={styles.count}
              value={count}
              onChange={(e) => handleCount(+e.target.value)}
            />
            <button
              className={styles.increment}
              type="button"
              onClick={handleIncrement}
            >
              +
            </button>

            <button type="submit" className="btn btn-primary mb-0 float-end">
              Добавить
            </button>
          </div>

          {!!order?.expanditure?.length && (
            <table className="table table-hover mt-4 table-bordered">
              <thead>
                <tr>
                  {column.map(({ name }) => {
                    return (
                      <th className={"bg-primary text-white"} key={name}>
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
                    <td>x{item?.amount}</td>
                    <td width={50}>
                      <div
                        className="flex justify-content-center pointer"
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

        <hr className={styles.hr} />

        <div className={styles.uploadPhoto}>
          <Header title={"Добавить фотоотчёт"} />
          <div className="m-3">
            <UploadComponent
              tableHead={"bg-primary text-white"}
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
        <hr className={styles.hr} />

        <BaseInput className="mx-2">
          <MainTextArea register={register("comment")} />
        </BaseInput>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={handleFinishOrder({ status: RequestStatus.done })}
            className="btn btn-success btn-fill w-full"
          >
            Починил
          </button>
        </div>
      </div>
    </form>
  );
};

export default TelegramAddProduct;
