import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { successToast } from "@/utils/toast";
import useFAQRequests from "@/hooks/useFaqRequests";
import dayjs from "dayjs";
import faqRequestsMutation from "@/hooks/mutation/faqRequest";
import { RequestStatus } from "@/utils/types";
import { handleStatus } from "@/utils/helpers";

const EditAddFAQQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { mutate: postFaq } = faqRequestsMutation();

  const { data, refetch } = useFAQRequests({
    id: Number(id),
    enabled: !!id,
  });

  const faq = data?.items?.[0];

  const onSubmit = (status: RequestStatus) => {
    postFaq(
      { id: Number(id), status },
      {
        onSuccess: () => {
          successToast(!id ? "created" : "updated");
          goBack();
          if (!!id) refetch();
        },
      }
    );
  };

  const renderBtns = useMemo(() => {
    return (
      <div className="float-end mb10">
        <button
          onClick={() => onSubmit(RequestStatus.rejected)}
          className="btn btn-danger btn-fill mr-2"
        >
          Отклонить
        </button>
        <button
          onClick={() => onSubmit(RequestStatus.confirmed)}
          className="btn btn-success btn-fill"
        >
          Принять
        </button>
      </div>
    );
  }, [faq]);

  return (
    <Card>
      <Header
        title={`Изменить №${id}`}
        subTitle={`Статус: ${handleStatus({
          status: faq?.status,
        })}`}
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
              <th>Ответ</th>
              <td>
                {faq?.created_at
                  ? dayjs(faq?.created_at).format("DD.MM.YYYY HH:mm")
                  : "Не задано"}
              </td>
            </tr>
          </tbody>
        </table>

        {renderBtns}
      </div>
    </Card>
  );
};

export default EditAddFAQQuestions;
