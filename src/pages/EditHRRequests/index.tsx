import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { successToast } from "@/utils/toast";
import useFAQRequests from "@/hooks/useFaqRequests";
import dayjs from "dayjs";
import hrRequestsMutation from "@/hooks/mutation/hrRequest";
import { RequestStatus } from "@/utils/types";
import { handleHRStatus, handleStatus } from "@/utils/helpers";
import Modal from "@/components/Modal";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import { useForm } from "react-hook-form";
import Loading from "@/components/Loader";

const EditHRRequests = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { mutate: postFaq } = hrRequestsMutation();
  const [answerModal, $answerModal] = useState(false);

  const { register, getValues } = useForm();

  const { data, refetch, isLoading } = useFAQRequests({
    id: Number(id),
    enabled: !!id,
  });

  const faq = data?.items?.[0];

  const onSubmit = (status: RequestStatus) => {
    postFaq(
      { id: Number(id), status, answer: getValues("answer") },
      {
        onSuccess: () => {
          successToast(!id ? "created" : "updated");
          navigate(`/hr-asked-questions?sphere=${faq?.sphere}`);
          if (!!id) refetch();
        },
      }
    );
  };

  const renderBtns = useMemo(() => {
    if (!faq?.status)
      return (
        <div className="float-end mb10">
          <button
            onClick={() => onSubmit(RequestStatus.rejected)}
            className="btn btn-danger btn-fill mr-2"
          >
            Отклонить
          </button>
          <button
            onClick={() => $answerModal(true)}
            className="btn btn-success btn-fill"
          >
            Ответить
          </button>
        </div>
      );
  }, [faq]);

  if (isLoading) return <Loading absolute />;

  return (
    <Card>
      <Header
        title={`Изменить №${id}`}
        subTitle={`Статус: ${handleHRStatus(faq?.status!)}`}
      >
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>
      <div className="content !pb-12">
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th>Вопрос</th>
              <td>{faq?.comments}</td>
            </tr>

            <tr>
              <th>Поступлен в</th>
              <td>
                {faq?.created_at
                  ? dayjs(faq?.created_at).format("DD.MM.YYYY HH:mm")
                  : "Не задано"}
              </td>
            </tr>
            <tr>
              <th>Ответ</th>
              <td>{faq?.answer ? faq.answer : "Не задано"}</td>
            </tr>
          </tbody>
        </table>

        {renderBtns}
      </div>

      <Modal isOpen={answerModal}>
        <Header title="Ответить" />
        <div className="px-4">
          <BaseInput label="Комментарии">
            <MainTextArea register={register("answer")} />
          </BaseInput>

          <button
            className="btn btn-success"
            onClick={() => onSubmit(RequestStatus.confirmed)}
          >
            Отправить
          </button>
        </div>
      </Modal>
    </Card>
  );
};

export default EditHRRequests;
