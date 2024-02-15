import { useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, handleStatus } from "@/utils/helpers";
import { RequestStatus } from "@/utils/types";
import cl from "classnames";
import Loading from "@/components/Loader";
import TableHead from "@/components/TableHead";
import dayjs from "dayjs";
import { useDownloadExcel } from "react-export-table-to-excel";
import Pagination from "@/components/Pagination";
import EmptyList from "@/components/EmptyList";
import toolOrderMutation from "@/hooks/mutation/toolOrder";
import useInventoryOrders from "@/hooks/useInventoryOrders";
import { errorToast, successToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "name_in_table", key: "name" },
  { name: "Остаток", key: "amount_left", center: true },
  { name: "Максимум", key: "max_amount", center: true },
  { name: "Минимум", key: "min_amount", center: true },
  { name: "Заказан", key: "ordered_amount", center: true },
  { name: "Заказан в", key: "created_at" },
];

const ShowInventoryTool = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const tableRef = useRef(null);
  const { mutate } = toolOrderMutation();

  const { data, isLoading, refetch, isFetching } = useInventoryOrders({
    id: Number(id),
    enabled: !!id,
  });

  const order = data?.items?.[0];
  const navigate = useNavigate();

  const handleBack = () => navigate("/order-products-inventory");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Заявки на закуп",
    sheet: "Заявки на закуп",
  });

  const downloadAsPdf = () => onDownload();

  const onSubmit = (status: RequestStatus) => {
    mutate(
      {
        id: +id!,
        status,
      },
      {
        onSuccess: () => {
          refetch();
          handleBack();
          successToast("success");
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  const renderBtns = useMemo(() => {
    if (!!order?.status?.toString() && order?.status < RequestStatus.done)
      return (
        <div className="float-end mb10">
          <button
            onClick={() => onSubmit(RequestStatus.done)}
            className="btn btn-success btn-fill"
          >
            {t("finish")}
          </button>
        </div>
      );
  }, [order?.order_need]);

  if (isLoading || isFetching) return <Loading absolute />;

  return (
    <>
      <Card className="overflow-hidden">
        <Header
          title={`${t("purchasing_requests")} №${id}`}
          subTitle={`${t("status")}: ${t(
            handleStatus({
              status: order?.status,
            })
          )}`}
        >
          <button className="btn btn-success mr-2" onClick={downloadAsPdf}>
            {t("export_to_excel")}
          </button>
          <button onClick={handleBack} className="btn btn-primary btn-fill">
            {t("back")}
          </button>
        </Header>
        <div className="content">
          <table className="table table-hover" ref={tableRef}>
            <TableHead column={column} />

            <tbody>
              {!!order?.order_need.length &&
                order.order_need?.map((item, idx) => (
                  <tr key={idx} className={cl("transition-colors")}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{item?.need_tool?.name}</td>
                    <td width={150} className="text-center">
                      {item?.amount_last}
                    </td>
                    <td width={150} className="text-center">
                      {item?.need_tool?.max_amount}
                    </td>
                    <td width={150} className="text-center">
                      {item?.need_tool?.min_amount}
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
          {!order?.order_need?.length && !isLoading && <EmptyList />}
          {!!order && <Pagination totalPages={data.pages} />}
        </div>
      </Card>
    </>
  );
};

export default ShowInventoryTool;
