import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import dayjs from "dayjs";
import TableHead from "@/components/TableHead";
import { itemsPerPage } from "@/utils/helpers";
import useOrders from "@/hooks/useOrders";
import { Order, OrderType } from "@/utils/types";

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
  const [sort, $sort] = useState<OrderType[]>();

  const [currentPage, setCurrentPage] = useState(1);

  const { data: requests } = useOrders({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });

  const goBack = () => navigate(-1);

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
                    <td width={450}>Сотрудник</td>
                  </tr>
                  <tr>
                    <th>Филиал</th>
                    <td>E sergeli</td>
                  </tr>
                  <tr>
                    <th>Категория</th>
                    <td>category</td>
                  </tr>
                  <tr>
                    <th>Комментарий</th>
                    <td>comments</td>
                  </tr>
                  <tr>
                    <th>Фото</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Статус</th>
                    <td>status </td>
                  </tr>
                  <tr>
                    <th>Результат</th>
                    <td>result</td>
                  </tr>
                  <tr>
                    <th>Результат файл</th>
                    <td>result file</td>
                  </tr>
                  <tr>
                    <th>Дата</th>
                    <td>{dayjs("order").format("DD.MM.YYYY HH:mm")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <table className="table table-striped table-bordered detail-view">
                <tbody>
                  <tr>
                    <th>Добавил</th>
                    <td width={450}>added</td>
                  </tr>
                  <tr>
                    <th>Добавлен в </th>
                    <td>{dayjs("order").format("DD.MM.YYYY HH:mm")}</td>
                  </tr>
                  <tr>
                    <th>Назначил испольнителя</th>
                    <td>Administrator</td>
                  </tr>
                  <tr>
                    <th>Назначен испольнитель в</th>
                    <td>{dayjs("order").format("DD.MM.YYYY HH:mm")}</td>
                  </tr>
                  <tr>
                    <th>Принял</th>
                    <td>no</td>
                  </tr>
                  <tr>
                    <th>Принят в</th>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>Завершил</th>
                    <td>(не задано)</td>
                  </tr>
                  <tr>
                    <th>Завершен в</th>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>Отменил</th>
                    <td>someone</td>
                  </tr>
                  <tr>
                    <th>Отменен в</th>
                    <td>{dayjs("order").format("DD.MM.YYYY HH:mm")}</td>
                  </tr>
                  <tr>
                    <th>Причина отмены</th>
                    <td>denyreason</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      <Card>
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
      </Card>
    </>
  );
};

export default ShowComment;
