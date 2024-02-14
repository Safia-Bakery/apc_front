import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { errorToast, successToast } from "@/utils/toast";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import requestMutation from "@/hooks/mutation/orderMutation";
import UploadComponent, { FileItem } from "@/components/FileUpload";
import styles from "./index.module.scss";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import useQueryString from "custom/useQueryString";
import BranchSelect from "@/components/BranchSelect";
import Loading from "@/components/Loader";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import dayjs from "dayjs";
import { CCTVCategoryId } from "@/utils/keys";
import { useTranslation } from "react-i18next";

const CreateCCTVRequest = () => {
  const { t } = useTranslation();
  const [files, $files] = useState<FileItem[]>();
  const { mutate, isPending } = requestMutation();
  const branchJson = useQueryString("branch");
  const [start, $start] = useState<Date>();
  const [end, $end] = useState<Date>();
  const branch = branchJson && JSON.parse(branchJson);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const navigate = useNavigate();
  const goBack = () => navigate("/requests-cctv");

  const handleDateStart = (event: Date) => $start(event);
  const handleDateEnd = (event: Date) => $end(event);

  const handleFilesSelected = (data: FileItem[]) => $files(data);

  const onSubmit = () => {
    const { description } = getValues();
    if (!end || !start) return alert("Выберите дату!");
    else
      mutate(
        {
          category_id: CCTVCategoryId,
          description,
          fillial_id: branch?.id,
          vidfrom: start.toISOString(),
          vidto: end.toISOString(),
          files,
        },
        {
          onSuccess: () => {
            successToast("Заказ успешно создано");
            goBack();
          },
          onError: (e: any) => errorToast(e.message),
        }
      );
  };

  useEffect(() => {
    reset({
      fillial_id: branch?.id,
    });
  }, [branch?.id]);

  if (isPending) return <Loading absolute />;

  return (
    <Card>
      <Header title={"create_order"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form
        className={cl("content", styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseInputs
          className="relative"
          label={t("branch")}
          error={errors.fillial_id}
        >
          <BranchSelect origin={1} enabled />
        </BaseInputs>

        <BaseInputs
          label="Укажите дата и время начало событий"
          className="relative"
        >
          <MainDatePicker
            className="z-10"
            showTimeSelect
            selected={!!start ? dayjs(start || undefined).toDate() : undefined}
            onChange={handleDateStart}
          />
        </BaseInputs>
        <BaseInputs
          label="Укажите дата и время конец событий"
          className="relative"
        >
          <MainDatePicker
            className="z-10"
            showTimeSelect
            selected={!!end ? dayjs(end || undefined).toDate() : undefined}
            onChange={handleDateEnd}
          />
        </BaseInputs>

        <BaseInputs label="Описание события в детялях">
          <MainTextArea
            register={register("description")}
            placeholder="Комментарии"
          />
        </BaseInputs>

        <BaseInputs
          className={`mb-4 ${styles.uploadImage}`}
          label="При желании отправить фото"
        >
          <UploadComponent onFilesSelected={handleFilesSelected} />
        </BaseInputs>
        <div>
          <button
            type="submit"
            className={`btn btn-info btn-fill float-end ${styles.btn}`}
          >
            {t("create")}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CreateCCTVRequest;
