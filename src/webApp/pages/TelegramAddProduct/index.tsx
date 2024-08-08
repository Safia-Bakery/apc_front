import styles from "./index.module.scss";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import usedItemsMutation from "@/hooks/mutation/usedItems";
import { errorToast, successToast } from "@/utils/toast";
import useOrder from "@/hooks/useOrder";
import { useRemoveParams } from "custom/useCustomNavigate";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import Header from "@/components/Header";
import { Departments, RequestStatus } from "@/utils/types";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import deleteExpenditureMutation from "@/hooks/mutation/deleteExpenditure";
import UploadComponent, { FileItem } from "@/components/FileUpload";
import { reportImgSelector, uploadReport } from "reducers/selects";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import uploadFileMutation from "@/hooks/mutation/uploadFile";
import useSyncExpanditure from "@/hooks/sync/useSyncExpanditure";
import { TelegramApp } from "@/utils/tgHelpers";
import BaseInputs from "@/components/BaseInputs";
import { SelectWrapper } from "@/components/InputWrappers";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const column = [{ name: "name_in_table" }, { name: "quantity" }, { name: "" }];

const TelegramAddProduct = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const removeParam = useRemoveParams();
  const dispatch = useAppDispatch();
  const { mutate: attach } = attachBrigadaMutation();
  const { mutate: deleteExp } = deleteExpenditureMutation();
  const inputRef = useRef<any>(null);
  const upladedFiles = useAppSelector(reportImgSelector);
  const [count, $count] = useState(1);
  const [btn, $btn] = useState(false);

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

  const { register, handleSubmit, getValues, reset, control } = useForm();

  const onSubmit = () => {
    const { comment, product } = getValues();
    mutate(
      {
        amount: count,
        request_id: Number(id),
        tool_id: product.value,
        comment,
      },
      {
        onSuccess: () => {
          successToast("Продукт добавлен");
          removeParam(["product"]);
          reset();
          refetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const handleDelete = (id: number) => () => {
    deleteExp(id, {
      onSuccess: () => {
        successToast("Успешно удалено");
        refetch();
      },
      onError: (e) => errorToast(e.message),
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
          onSuccess: () => {
            successToast("Успешно закончен");
            $btn(true);
            TelegramApp.toMainScreen();
          },
          onError: (e) => errorToast(e.message),
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
          onError: (e) => errorToast(e.message),
        }
      );
  };

  const handleCount = (val: number) => $count(val);

  const handleIncrement = () => $count((prev) => prev + 1);
  const handleDecrement = () => $count((prev) => prev - 1);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("add_used_products")}</h2>
      </div>

      <div className={styles.block}>
        <div className={styles.modalBody}>
          <div className="flex justify-end">
            <button
              disabled={isFetching}
              className="btn btn-primary z-3 relative"
              onClick={() => syncWithIiko()}
            >
              {t("refresh")}
            </button>
          </div>
          <Controller
            name={"product"}
            control={control}
            render={({ field }) => (
              <BaseInputs label="select_product">
                <SelectWrapper
                  field={field}
                  register={register("product")}
                  department={Departments.APC}
                />
              </BaseInputs>
            )}
          />

          <div className="flex gap-2 my-4">
            <span className={styles.label}>{t("quantity")}</span>
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
              {t("add")}
            </button>
          </div>

          {!!order?.expanditure?.length && (
            <table className="table table-hover mt-4 table-bordered">
              <thead>
                <tr>
                  {column.map(({ name }) => {
                    return (
                      <th className={"bg-primary text-white"} key={name}>
                        {t(name)}
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
          <Header title={"add_photo_report"} />
          <div className="m-3">
            <UploadComponent
              tableHead={"bg-primary text-white"}
              onFilesSelected={handleFilesSelected}
              inputRef={inputRef}
            />
            <button
              onClick={handlerSubmitFile}
              type="button"
              className="btn btn-success float-end   my-3"
            >
              {t("save")}
            </button>
          </div>
        </div>
        <hr className={styles.hr} />

        <BaseInput className="mx-2">
          <MainTextArea register={register("comment")} />
        </BaseInput>

        <div className={styles.footer}>
          {!btn && (
            <button
              type="button"
              onClick={handleFinishOrder({ status: RequestStatus.finished })}
              className="btn btn-success w-full"
            >
              {t("fixed")}
            </button>
          )}
        </div>
      </div>

      {isFetching && <Loading />}
    </form>
  );
};

export default TelegramAddProduct;
