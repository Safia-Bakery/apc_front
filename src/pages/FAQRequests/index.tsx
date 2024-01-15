import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { FAQRequestTypes, MainFAQTypes, MainPermissions } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import EmptyList from "@/components/EmptyList";
import TableLoading from "@/components/TableLoading";
import useFAQRequests from "@/hooks/useFaqRequests";

const column = [
  { name: "№", key: "" },
  { name: "Вопрос", key: "name" },
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const FAQRequests = () => {
  const navigate = useNavigate();
  const [sort, $sort] = useState<FAQRequestTypes["items"]>();
  const permission = useAppSelector(permissionSelector);
  const page = Number(useQueryString("page")) || 1;
  const {
    data: faqs,
    isLoading,
    refetch,
  } = useFAQRequests({
    page,
  });
  const handleNavigate = (route: string) => () => navigate(route);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Card>
      <Header title="Отзывы" />

      <div className="content">
        <ItemsCount data={faqs} />
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={faqs?.items}
          />

          <tbody>
            {!!faqs?.items?.length &&
              (sort?.length ? sort : faqs?.items)?.map((faq, idx) => (
                <tr key={idx} className="bg-blue">
                  <td width="40">{handleIdx(idx)}</td>
                  <td>{faq?.comments}</td>
                  <td>{faq?.status ? "Активный" : "Неактивный"}</td>
                  <td width={40}>
                    {permission?.[MainPermissions.edit_faq] && (
                      <TableViewBtn onClick={handleNavigate(`${faq.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
            {isLoading && <TableLoading />}
          </tbody>
        </table>

        {!!faqs && <Pagination totalPages={faqs.pages} />}
        {!faqs?.items?.length && !isLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default FAQRequests;
