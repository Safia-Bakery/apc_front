import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import roleMutation from "@/hooks/mutation/roleMutation";
import { errorToast, successToast } from "@/utils/toast";
import useRoles from "@/hooks/useRoles";
import useRolePermission from "@/hooks/useRolePermission";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import faqsMutation from "@/hooks/mutation/faqs";
import useFAQ from "@/hooks/useFAQ";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";

const EditAddFAQQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { mutate: postFaq } = faqsMutation();

  const { data, refetch } = useFAQ({
    id: Number(id),
    enabled: !!id,
  });

  const faq = data?.items?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { answer, status, question } = getValues();
    postFaq(
      { id: Number(id), answer, question, status },
      {
        onSuccess: () => {
          successToast(!id ? "role created" : "role updated");
          goBack();
          if (!!id) refetch();
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (id && faq) {
      reset({
        answer: faq?.answer,
        question: faq?.question,
        status: !!faq.status ? true : false,
      });
    }
  }, [faq, id]);

  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить №${id}`}>
        <button className="btn btn-success btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="Вопрос" error={errors.question}>
          <MainInput
            register={register("question", { required: "Обязательное поле" })}
          />
        </BaseInputs>
        <BaseInputs label="Ответ" error={errors.answer}>
          <MainTextArea
            placeholder="Ответ"
            register={register("answer", { required: "Обязательное поле" })}
          />
        </BaseInputs>

        <BaseInputs label="статус">
          <MainCheckBox label="Активный" register={register("status")} />
        </BaseInputs>

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddFAQQuestions;
