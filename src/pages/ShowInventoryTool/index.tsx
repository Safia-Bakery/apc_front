import { useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx } from "@/utils/helpers";
import { ModalTypes } from "@/utils/types";
import { useNavigateParams } from "custom/useCustomNavigate";
import cl from "classnames";
import useInventoryOrdersNeeded from "@/hooks/useInventoryOrdersNeeded";
import Loading from "@/components/Loader";
import TableHead from "@/components/TableHead";
import dayjs from "dayjs";
import { useDownloadExcel } from "react-export-table-to-excel";
import Pagination from "@/components/Pagination";
import EmptyList from "@/components/EmptyList";

const column = [
  { name: "№", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Остаток", key: "amount_left", center: true },
  { name: "Максимум", key: "max_amount", center: true },
  { name: "Минимум", key: "min_amount", center: true },
  { name: "Заказан", key: "ordered_amount", center: true },
  { name: "Заказан в", key: "created_at" },
];

const ShowInventoryTool = () => {
  const { id } = useParams();
  const tableRef = useRef(null);

  const navigateParams = useNavigateParams();
  const handleModal = (type: ModalTypes) => () => {
    navigateParams({ modal: type });
  };
  const { data: order, isLoading } = useInventoryOrdersNeeded({
    toolorder_id: Number(id),
  });
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Заявки на закуп",
    sheet: "Заявки на закуп",
  });

  const downloadAsPdf = () => onDownload();

  const renderBtns = useMemo(() => {
    if (!!order?.items?.length)
      return (
        <div className="float-end mb10">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger btn-fill mx-2"
          >
            Отклонить
          </button>
          <button
            // onClick={handleBrigada({ status: RequestStatus.done })}
            className="btn btn-success btn-fill"
          >
            Завершить
          </button>
        </div>
      );
  }, [order?.items]);

  if (isLoading) return <Loading absolute />;

  return (
    <>
      <Card className="overflow-hidden">
        <Header title={`Заказ №${id}`}>
          <button className="btn btn-success mr-2" onClick={downloadAsPdf}>
            Export Excel
          </button>
          <button onClick={handleBack} className="btn btn-primary btn-fill">
            Назад
          </button>
        </Header>
        <div className="content">
          <table className="table table-hover" ref={tableRef}>
            <TableHead column={column} />

            <tbody>
              {!!order?.items.length &&
                order.items?.map((item, idx) => (
                  <tr key={idx} className={cl("transition-colors")}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{item?.need_tools?.name}</td>
                    <td width={150} className="text-center">
                      {item?.amount_last}
                    </td>
                    <td width={150} className="text-center">
                      {item?.need_tools?.max_amount}
                    </td>
                    <td width={150} className="text-center">
                      {item?.need_tools?.min_amount}
                    </td>
                    <td width={150} className="text-center">
                      {item?.ordered_amount}
                    </td>
                    <td>{dayjs(item?.created_at).format("DD.MM.YYYY")}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {renderBtns}
          {!!order && <Pagination totalPages={order.pages} />}
          {!order?.items?.length && !isLoading && <EmptyList />}
        </div>
      </Card>
    </>
  );
};

export default ShowInventoryTool;
