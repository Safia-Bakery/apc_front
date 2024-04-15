import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { errorToast, successToast } from "@/utils/toast";
import useFAQRequests from "@/hooks/useFaqRequests";
import dayjs from "dayjs";
import hrRequestsMutation from "@/hooks/mutation/hrRequest";
import { RequestStatus } from "@/utils/types";
import { handleHRStatus } from "@/utils/helpers";
import Modal from "@/components/Modal";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import { useForm } from "react-hook-form";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";

const EditHRRequests = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { mutate: postFaq, isPending: posting } = hrRequestsMutation();
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
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const toggleModal = () => $answerModal((prev) => !prev);

  const renderBtns = useMemo(() => {
    if (!faq?.status)
      return (
        <div className="float-end mb10">
          <button
            onClick={() => onSubmit(RequestStatus.rejected)}
            className="btn btn-danger mr-2"
          >
            {t("deny")}
          </button>
          <button onClick={toggleModal} className="btn btn-success">
            Ответить
          </button>
        </div>
      );
  }, [faq]);

  if (isLoading) return <Loading />;

  return (
    <Card>
      <Header
        title={`${t("edit")} №${id}`}
        subTitle={`${t("status")}: ${t(handleHRStatus[faq?.status!] || "")}`}
      >
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>
      <div className="content !pb-12">
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th>{t("question")}</th>
              <td>{faq?.comments}</td>
            </tr>

            <tr>
              <th>{t("created_at")}</th>
              <td>
                {faq?.created_at
                  ? dayjs(faq?.created_at).format(dateTimeFormat)
                  : t("not_given")}
              </td>
            </tr>
            <tr>
              <th>{t("answer")}</th>
              <td>{faq?.answer ? faq.answer : t("not_given")}</td>
            </tr>
          </tbody>
        </table>

        {renderBtns}
      </div>

      <Modal isOpen={answerModal} onClose={toggleModal}>
        <Header title="to_answer">
          <button onClick={toggleModal} className="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </Header>
        <div className="px-4">
          <BaseInput label="comments">
            <MainTextArea register={register("answer")} />
          </BaseInput>

          <button
            className="btn btn-success w-full"
            onClick={() => onSubmit(RequestStatus.confirmed)}
          >
            {t("send")}
          </button>
        </div>
      </Modal>

      {posting && <Loading />}
    </Card>
  );
};

export default EditHRRequests;
