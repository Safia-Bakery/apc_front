import Card from "@/components/Card";
import Header from "@/components/Header";
import { ExpenseCategoriesTypes, RoleTypes } from "@/utils/types";
import Loading from "@/components/Loader";
import { useState } from "react";
import TableHead from "@/components/TableHead";
import EmptyList from "@/components/EmptyList";
import { useTranslation } from "react-i18next";
import useExpenseApcTypes from "@/hooks/useExpenseApcTypes";

const column = [
  { name: "№", key: "" },
  { name: "name", key: "name" },
  { name: "status", key: "status" },
];

const ApcExpenseCategories = () => {
  const { t } = useTranslation();
  const [sort, $sort] = useState<ExpenseCategoriesTypes[]>();

  const { data: expenses, isLoading: expenseLoading } = useExpenseApcTypes({});

  if (expenseLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title={"expense_categories"} />

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
                  <td>{expense.name}</td>
                  <td>{!expense.status ? t("not_active") : t("active")}</td>
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

export default ApcExpenseCategories;
