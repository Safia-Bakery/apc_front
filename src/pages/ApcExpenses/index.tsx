import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { BaseExpenseTypes } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
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
  { name: "type", key: "id" },
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
  const [sort, $sort] = useState<BaseExpenseTypes[]>();

  const { data: expenses, isLoading: expenseLoading } = useExpensesApc({});

  if (expenseLoading) return <Loading />;

  return (
    <Card>
      <Header title={"expense_for_outsource"}>
        {permission?.has(MainPermissions.add_apc_expenses) && (
          <button className="btn btn-success  " onClick={handleNavigate("add")}>
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive  content">
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={expenses?.items}
          />

          {!!expenses?.items?.length && (
            <tbody>
              {(sort?.length ? sort : expenses?.items)?.map((expense, idx) => (
                <tr className="bg-blue" key={expense.id}>
                  <td width="40">{idx + 1}</td>
                  <td>{expense?.expensetype?.name}</td>
                  <td>{numberWithCommas(expense?.amount)}</td>
                  <td>{expense?.from_date}</td>
                  <td>{expense?.to_date}</td>
                  <td>{dayjs(expense?.created_at).format(dateMonthYear)}</td>
                  <td>{!expense.status ? t("not_active") : t("active")}</td>
                  <td width={40}>
                    {permission?.has(MainPermissions.edit_apc_expenses) && (
                      <TableViewBtn onClick={handleNavigate(`${expense.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!expenses?.items?.length && !expenseLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default ApcExpenses;
