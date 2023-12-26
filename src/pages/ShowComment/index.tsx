import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import dayjs from "dayjs";
import TableHead from "@/components/TableHead";
import { detectFileType, itemsPerPage } from "@/utils/helpers";
import useOrders from "@/hooks/useOrders";
import { FileType, ModalTypes, Order, OrderType } from "@/utils/types";
import useOrder from "@/hooks/useOrder";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import { baseURL } from "@/main";
import cl from "classnames";
import ShowRequestModals from "@/components/ShowRequestModals";
import Loading from "@/components/Loader";

const column = [
  { name: "№", key: "id" as keyof Order["id"] },
  { name: "Сотрудник", key: "purchaser" as keyof Order["product"] },
  { name: "Оценка", key: "type" as keyof Order["product"] },
  { name: "Текст", key: "category.name" as keyof Order["category"] },
  { name: "Дата", key: "price" as keyof Order["product"] },
];

const ShowComment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();

  const { data: order, isLoading: orderLoading } = useOrder({ id: Number(id) });

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      navigateParams({ modal: ModalTypes.showPhoto, photo: file });
    }
  };

  const renderModal = useMemo(() => {
    return <ShowRequestModals />;
  }, []);

  const goBack = () => navigate(-1);

  if (orderLoading) return <Loading absolute />;

  return (
    <>
      <Card>
        <Header title={`№${id}`}>
          <button className="btn btn-primary btn-fill" onClick={goBack}>
            Назад
          </button>
        </Header>
        <div className="content">
          <div className="row ">
            <div className="col-md-6">
              <table className="table table-striped table-bordered detail-view">
                <tbody>
                  <tr>
                    <th>Сотрудник</th>
                    <td width={450}>{order?.product}</td>
                  </tr>
                  <tr>
                    <th>Филиал</th>
                    <td>{order?.fillial?.parentfillial?.name}</td>
                  </tr>
                  <tr>
                    <th>Файл</th>
                    <td className="flex flex-col">
                      {order?.file?.map((item, index) => {
                        if (item.status === 0)
                          return (
                            <div
                              className={cl(
                                "text-link cursor-pointer max-w-[150px] w-full text-truncate"
                              )}
                              onClick={handleShowPhoto(
                                `${baseURL}/${item.url}`
                              )}
                              key={item.url + index}
                            >
                              файл - {index + 1}
                            </div>
                          );
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <table className="table table-striped table-bordered detail-view">
                <tbody>
                  <tr>
                    <th>Добавил</th>
                    <td width={450}>{order?.user?.full_name}</td>
                  </tr>
                  <tr>
                    <th>Дата поступления </th>
                    <td>
                      {dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                  </tr>
                  <tr>
                    <th>Комментарий</th>
                    <td>{order?.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
      {renderModal}

      {/* <Card>
        <Header title="Отзывы" />
        <div className="content">
          <table className="table table-hover">
            <TableHead
              column={column}
              onSort={(data) => $sort(data)}
              data={requests?.items}
            />

            {!!requests?.items.length && (
              <tbody>
                {(sort?.length ? sort : requests?.items)?.map((order, idx) => (
                  <tr className="bg-blue" key={idx}>
                    <td width="40">1</td>
                    <td>sotrudnit | (не задано)</td>
                    <td>rate - 5</td>
                    <td>text</td>
                    <td>
                      {dayjs("order.time_created").format("DD.MM.YYYY HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          <hr />
        </div>
      </Card> */}
    </>
  );
};

export default ShowComment;
