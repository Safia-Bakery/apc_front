import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { ExpensesTypes, MainPermissions, RoleTypes } from "@/utils/types";
import Loading from "@/components/Loader";
import { useState } from "react";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import EmptyList from "@/components/EmptyList";
import { useTranslation } from "react-i18next";
import useExpensesApc from "@/hooks/useExpensesApc";
import dayjs from "dayjs";
import { dateMonthYear } from "@/utils/keys";
import { numberWithCommas } from "@/utils/helpers";

const column = [
  { name: "№", key: "" },
  { name: "request_number", key: "id" },
  { name: "summ", key: "amount" },
  { name: "from_date", key: "from_date" },
  { name: "to_date", key: "to_date" },
  { name: "receipt_date", key: "created_at" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const ApcExpenses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const permission = useAppSelector(permissionSelector);
  const [sort, $sort] = useState<ExpensesTypes[]>();

  const { data: expenses, isLoading: expenseLoading } = useExpensesApc({});

  if (expenseLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title={"expense_for_outsource"}>
        {permission?.[MainPermissions.add_apc_expenses] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate("add")}
          >
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={expenses}
          />

          {!!expenses?.length && (
            <tbody>
              {(sort?.length ? sort : expenses)?.map((expense, idx) => (
                <tr className="bg-blue" key={expense.id}>
                  <td width="40">{idx + 1}</td>
                  <td>{expense?.id}</td>
                  <td>{numberWithCommas(expense?.amount)}</td>
                  <td>{expense?.from_date}</td>
                  <td>{expense?.to_date}</td>
                  <td>{dayjs(expense?.created_at).format(dateMonthYear)}</td>
                  <td>{!expense.status ? t("not_active") : t("active")}</td>
                  <td width={40}>
                    {permission?.[MainPermissions.edit_apc_expenses] && (
                      <TableViewBtn onClick={handleNavigate(`${expense.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!expenses?.length && !expenseLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default ApcExpenses;
