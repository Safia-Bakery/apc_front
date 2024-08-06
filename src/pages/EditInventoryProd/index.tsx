import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { errorToast, successToast } from "@/utils/toast";
import MainInput from "@/components/BaseInputs/MainInput";
import BaseInputs from "@/components/BaseInputs";
import updateToolsMutation from "@/hooks/mutation/updateTools";
import useTools from "@/hooks/useTools";
import { useTranslation } from "react-i18next";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import MainSelect from "@/components/BaseInputs/MainSelect";
import AddCategory from "./addCategory";
import imageUpload from "@/hooks/mutation/imageUpload";
import Loading from "@/components/Loader";
import { imageConverter } from "@/utils/helpers";
import { baseURL } from "@/main";

const SelectDates = [
  { id: 24, name: "one_day" },
  { id: 48, name: "two_days" },
];

const EditInventoryProd = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [uploadedImg, $uploadedImg] = useState("");

  const { data, refetch } = useTools({ id });
  const tool = data?.items?.[0];

  const { mutate } = updateToolsMutation();
  const { mutate: imageUploadMutation, isPending: uploading } = imageUpload();
  const { register, handleSubmit, getValues, reset, watch } = useForm();

  const onSubmit = () => {
    const { min_amount, max_amount, deadline, status } = getValues();

    mutate(
      {
        id: Number(id),
        min_amount,
        max_amount,
        ftime: deadline,
        status: Number(status),
        image: uploadedImg,
      },
      {
        onSuccess: () => {
          refetch();
          goBack();
          successToast("successfully updated");
          $uploadedImg("");
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const hadleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    imageUploadMutation(
      { file: e.target?.files?.[0] },
      {
        onSuccess: (data: any) => {
          $uploadedImg(data.file_path);
        },
      }
    );
  };

  useEffect(() => {
    reset({
      min_amount: tool?.min_amount,
      max_amount: tool?.max_amount,
      deadline: tool?.ftime,
      status: !!tool?.status,
    });
  }, [tool]);

  const renderImage = useMemo(() => {
    if (!!uploadedImg)
      return (
        <img
          src={`${baseURL}/${uploadedImg}`}
          alt="category-files"
          height={150}
          width={150}
        />
      );

    if (tool?.image && !!id)
      return (
        <img
          src={`${baseURL}/${tool?.image}`}
          alt="category-files"
          height={150}
          width={150}
        />
      );
  }, [uploadedImg, tool?.image, id]);

  return (
    <Card>
      {uploading && <Loading />}
      <Header title={`${t("edit")} ${tool?.name}`}>
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="min">
          <MainInput register={register("min_amount")} />
        </BaseInputs>
        <BaseInputs label="max">
          <MainInput register={register("max_amount")} />
        </BaseInputs>
        <BaseInputs label="deadline_in_hours">
          <MainSelect values={SelectDates} register={register("deadline")} />
        </BaseInputs>
        <AddCategory />
        <BaseInputs label="upload_photo" className="relative">
          <MainInput onChange={hadleUploadImage} type="file" />
        </BaseInputs>

        {renderImage}
        <BaseInputs label="status">
          <MainCheckBox label={"active"} register={register("status")} />
        </BaseInputs>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-success mt-3">
            {t("save")}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default EditInventoryProd;
