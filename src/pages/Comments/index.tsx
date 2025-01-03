import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import useComments from "@/hooks/useComments";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import { useTranslation } from "react-i18next";
import { dateTimeFormat } from "@/utils/keys";

const column = [
  { name: "№", key: "id" },
  { name: "employee", key: "purchaser" },
  { name: "Заявка", key: "id" },
  { name: "Оценка", key: "rate" },
  { name: "Текст", key: "status" },
  { name: "date", key: "date" },
];

const Comments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const currentPage = Number(useQueryString("page")) || 1;

  const { data: comments, isLoading } = useComments({
    page: currentPage,
  });

  return (
    <Card>
      <Header title="reviews">
        <button className="btn btn-primary  " onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <div className="content">
        <div className="table-responsive ">
          <ItemsCount data={comments} />
          <table className="table table-hover">
            <TableHead column={column} />

            {!!comments?.items?.length && (
              <tbody>
                {comments?.items?.map((comment, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{comment.user?.full_name}</td>
                    <td>
                      <Link to={`/comments/${comment?.request?.id}`}>
                        {comment?.request?.id}
                      </Link>
                    </td>
                    <td>{comment?.rating}</td>
                    <td>{comment?.comment}</td>
                    <td>
                      {dayjs(comment?.request?.finished_at).format(
                        dateTimeFormat
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!comments?.items?.length && !isLoading && <EmptyList />}
          {!!comments && <Pagination totalPages={comments.pages} />}
        </div>
      </div>
    </Card>
  );
};

export default Comments;
