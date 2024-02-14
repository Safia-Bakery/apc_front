import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useDownloadExcel } from "react-export-table-to-excel/lib/hooks/useExcel";
import { useMemo, useRef } from "react";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import { detectFileType, handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import {
  Departments,
  FileType,
  MainPermissions,
  ModalTypes,
} from "@/utils/types";
import DateRangeBlock from "@/components/DateRangeBlock";
import useOrders from "@/hooks/useOrders";
import { baseURL } from "@/main";
import { useNavigateParams } from "custom/useCustomNavigate";
import ShowRequestModals from "@/components/ShowRequestModals";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "id" },
  { name: "Заявка", key: "id" },
  { name: "employee", key: "purchaser" },
  { name: "branch", key: "status" },
  { name: "Дата поступления", key: "status" },
  { name: "photo", key: "status" },
  { name: "Текст", key: "status" },
];

const ClientsComments = () => {
  const { t } = useTranslation();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();
  const page = Number(useQueryString("page")) || 1;
  const permission = useAppSelector(permissionSelector);

  const { data: comments, isLoading } = useOrders({
    page,
    department: Departments.clientComment,
  });

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Отзывы гостей",
    sheet: "Отзывы гостей",
  });

  const renderModal = useMemo(() => {
    return <ShowRequestModals />;
  }, []);

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      navigateParams({ modal: ModalTypes.showPhoto, photo: file });
    }
  };

  const downloadAsPdf = () => onDownload();

  return (
    <Card>
      <Header title="Отзывы гостей">
        <button
          className="btn btn-primary btn-fill mr-2"
          onClick={downloadAsPdf}
        >
          {t("export_to_excel")}
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
                        <Link to={`/client-comments/${comment?.id}`}>
                          {comment?.id}
                        </Link>
                      ) : (
                        <span>{comment?.id}</span>
                      )}
                    </td>
                    <td>{comment?.product}</td>

                    <td>{comment?.fillial?.parentfillial?.name}</td>
                    <td>
                      {dayjs(comment?.created_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td>
                      {comment?.file?.[0]?.url && (
                        <div
                          onClick={handleShowPhoto(
                            `${baseURL}/${comment?.file?.[0]?.url}`
                          )}
                          className="h-20 w-20 flex items-center justify-center"
                        >
                          <img
                            className="object-contain h-20 w-20"
                            src={`${baseURL}/${comment?.file?.[0]?.url}`}
                            alt="image"
                          />
                        </div>
                      )}
                    </td>
                    <td>{comment?.description}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!comments?.items?.length && !isLoading && <EmptyList />}
          {!!comments && <Pagination totalPages={comments.pages} />}
        </div>
      </div>
      {renderModal}
    </Card>
  );
};

export default ClientsComments;
