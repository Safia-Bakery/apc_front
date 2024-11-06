import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import MainInput from "@/components/BaseInputs/MainInput";
import BaseInputs from "@/components/BaseInputs";
import updateToolsMutation from "@/hooks/mutation/updateTools";
import useTools from "@/hooks/useTools";
import { useTranslation } from "react-i18next";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import MainSelect from "@/components/BaseInputs/MainSelect";
import AddCategory from "./addCategory";
import { baseURL } from "@/store/baseUrl";
import MainDropZone from "@/components/MainDropZone";
import { Flex, Image } from "antd";

const SelectDates = [
  { id: 24, name: "one_day" },
  { id: 48, name: "two_days" },
];

const EditInventoryProd = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [uploadedImg, $uploadedImg] = useState<string[]>([]);

  const { data, refetch } = useTools({ id });
  const tool = data?.items?.[0];

  const { mutate } = updateToolsMutation();
  const { register, handleSubmit, getValues, reset } = useForm();

  const onSubmit = () => {
    const { min_amount, max_amount, deadline, status } = getValues();

    mutate(
      {
        id: Number(id),
        min_amount,
        max_amount,
        ftime: deadline,
        status: Number(status),
        image: !!uploadedImg.length ? uploadedImg.at(-1) : null,
      },
      {
        onSuccess: () => {
          refetch();
          goBack();
          successToast("successfully updated");
          $uploadedImg([]);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (tool?.image) $uploadedImg([tool?.image]);
    reset({
      min_amount: tool?.min_amount,
      max_amount: tool?.max_amount,
      deadline: tool?.ftime,
      status: !!tool?.status,
    });
  }, [tool]);

  const renderImage = useMemo(() => {
    if (!!uploadedImg.length)
      return uploadedImg.map((item) => (
        <div className="relative w-min" key={item}>
          <Image
            src={`${baseURL}/${item}`}
            alt="category-files"
            height={100}
            width={100}
          />

          <button
            onClick={() =>
              $uploadedImg((prev) => prev.filter((child) => child !== item))
            }
            className="absolute top-1 right-1 z-10 bg-white rounded-full p-1"
          >
            <img src="/icons/delete.svg" alt="delete" />
          </button>
        </div>
      ));
  }, [uploadedImg, id]);

  return (
    <Card>
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
          <MainDropZone onChange={$uploadedImg} />
        </BaseInputs>
        <Flex gap={20}>{renderImage}</Flex>
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
