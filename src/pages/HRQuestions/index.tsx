import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { FAQTypes } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Pagination from "@/components/Pagination";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import EmptyList from "@/components/EmptyList";
import useFAQ from "@/hooks/useFAQ";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "question", key: "name" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const FAQQuestions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<FAQTypes[]>();
  const permission = useAppSelector(permissionSelector);
  const page = Number(useQueryString("page")) || 1;
  const { data: faqs, isLoading } = useFAQ({
    page,
  });
  const handleNavigate = (route: string) => () => navigate(route);

  if (isLoading) return <Loading />;
  return (
    <Card>
      <Header title={"questions"}>
        {permission?.[MainPermissions.add_faq] && (
          <button
            className="btn btn-success  "
            onClick={handleNavigate(`add`)}
            id="add_category"
          >
            {t("add")}
          </button>
        )}
      </Header>

      <div className="content">
        <div className="table-responsive ">
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
                    <td>{faq?.question}</td>
                    <td>{faq?.status ? t("active") : t("not_active")}</td>
                    <td width={40}>
                      {permission?.[MainPermissions.edit_faq] && (
                        <TableViewBtn onClick={handleNavigate(`${faq.id}`)} />
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {!faqs?.items?.length && !isLoading && <EmptyList />}
          {!!faqs && <Pagination totalPages={faqs.pages} />}
        </div>
      </div>
    </Card>
  );
};

export default FAQQuestions;
