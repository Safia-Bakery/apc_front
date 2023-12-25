import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import { handleIdx, itemsPerPage } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import useComments from "@/hooks/useComments";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import { MainPermissions } from "@/utils/types";
import DateRangeBlock from "@/components/DateRangeBlock";
import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";
import { useRef } from "react";

const column = [
  { name: "№", key: "id" },
  { name: "Заявка", key: "id" },
  { name: "Сотрудник", key: "purchaser" },
  { name: "Филиал", key: "status" },
  { name: "Дата поступления", key: "status" },
  { name: "Фотография", key: "status" },
  { name: "Текст", key: "status" },
];

const ClientsComments = () => {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const currentPage = Number(useQueryString("page")) || 1;
  const permission = useAppSelector(permissionSelector);

  const { data: comments, isLoading } = useComments({
    size: itemsPerPage,
    page: currentPage,
  });

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "статистика по категориям",
    sheet: "categories",
  });

  const downloadAsPdf = () => onDownload();

  return (
    <Card>
      <Header title="Отзывы гостей">
        <button
          className="btn btn-primary btn-fill mr-2"
          onClick={downloadAsPdf}
        >
          Экспорт в Excel
        </button>
        {permission?.[MainPermissions.add_client_comment] && (
          <button
            className="btn btn-success btn-fill"
            id="add_master"
            onClick={() => navigate("add")}
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="content">
        <DateRangeBlock />

        <div className="table-responsive grid-view">
          <ItemsCount data={comments} />
          <table className="table table-hover" ref={tableRef}>
            <TableHead column={column} />

            {!!comments?.items?.length && (
              <tbody>
                {comments?.items?.map((comment, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">{handleIdx(idx)}</td>
                    <td>
                      {permission?.[MainPermissions.add_client_comment] ? (
                        <Link to={`/comments/${comment?.request?.id}`}>
                          {comment?.id}
                        </Link>
                      ) : (
                        <span>{comment?.id}</span>
                      )}
                    </td>
                    <td>{comment.user?.full_name}</td>

                    <td>branch</td>
                    <td>
                      {dayjs(comment?.request?.finished_at).format(
                        "DD.MM.YYYY HH:mm"
                      )}
                    </td>
                    <td>{comment?.comment}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!!comments && <Pagination totalPages={comments.pages} />}
          {!comments?.items?.length && !isLoading && <EmptyList />}
        </div>
      </div>
    </Card>
  );
};

export default ClientsComments;
