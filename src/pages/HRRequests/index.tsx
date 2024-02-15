import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { FAQRequestTypes, MainPermissions } from "@/utils/types";
import Pagination from "@/components/Pagination";
import {
  HRRequestTypes,
  handleHRStatus,
  handleIdx,
  requestRows,
} from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import EmptyList from "@/components/EmptyList";
import useFAQRequests from "@/hooks/useFaqRequests";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "question", key: "name" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const handleTitle = (dep: HRRequestTypes) => {
  switch (dep) {
    case HRRequestTypes.asked_questions:
      return "asked_questions";
    case HRRequestTypes.objections:
      return "objections";
    case HRRequestTypes.offers:
      return "offers";

    default:
      break;
  }
};

const HRRequests = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<FAQRequestTypes["items"]>();
  const permission = useAppSelector(permissionSelector);
  const page = Number(useQueryString("page")) || 1;
  const sphere = Number(useQueryString("sphere"));

  const { data: faqs, isLoading } = useFAQRequests({
    page,
    ...(!!sphere && { sphere }),
  });
  const handleNavigate = (route: string) => () => navigate(route);

  return (
    <Card>
      <Header title={handleTitle(sphere)} />

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
                <tr key={idx} className={requestRows(faq.status)}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td>{faq?.comments}</td>
                  <td>{t(handleHRStatus(faq?.status) || "")}</td>
                  <td width={40}>
                    {permission?.[MainPermissions.edit_faq] && (
                      <TableViewBtn onClick={handleNavigate(`${faq.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {isLoading && <Loading />}
        {!faqs?.items?.length && !isLoading && <EmptyList />}
        {!!faqs && <Pagination totalPages={faqs.pages} />}
      </div>
    </Card>
  );
};

export default HRRequests;
