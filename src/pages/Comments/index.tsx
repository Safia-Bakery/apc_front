import Card from "src/components/Card";
import Header from "src/components/Header";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "src/components/Pagination";
import { useState } from "react";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import dayjs from "dayjs";
import ItemsCount from "src/components/ItemsCount";
import useComments from "src/hooks/useComments";
import useQueryString from "src/hooks/useQueryString";

const column = [
  { name: "№", key: "id" },
  { name: "Сотрудник", key: "purchaser" },
  { name: "Заявка", key: "status" },
  { name: "Оценка", key: "status" },
  { name: "Текст", key: "status" },
  { name: "Дата", key: "status" },
];

const Comments = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const currentPage = Number(useQueryString("page")) || 1;

  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const { data: comments, isLoading } = useComments({
    size: itemsPerPage,
    page: currentPage,
  });

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };
  return (
    <Card>
      <Header title={"Comments"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <div className="content">
        <div className="table-responsive grid-view">
          <ItemsCount data={comments} />
          <table className="table table-hover">
            <TableHead
              column={column}
              sort={handleSort}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />

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
                    <td>rate</td>
                    <td>{comment?.comment}</td>
                    <td>
                      {dayjs(comment?.request?.finished_at).format(
                        "DD.MM.YYYY HH:mm"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!!comments && <Pagination totalPages={comments.pages} />}
          {!comments?.items?.length && !isLoading && (
            <div className="w-full">
              <p className="text-center w-full ">Спосок пуст</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Comments;
