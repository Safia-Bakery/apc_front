import {
  OrderTypeNames,
  RequestStatusArr,
  UrgentNames,
  itemsPerPage,
} from "src/utils/helpers";
import BaseSelect from "src/components/BaseSelect";
import InputBlock from "src/components/Input";
import { useAppSelector } from "src/redux/utils/types";
import {
  branchSelector,
  categorySelector,
} from "src/redux/reducers/cacheResources";
import { FC, useEffect, useState } from "react";
import DateInput from "src/components/DateRangeInput";
import useOrders from "src/hooks/useOrders";
import useDebounce from "src/hooks/useDebounce";
import dayjs from "dayjs";

type dateRangeType = {
  start: string;
  end: string;
};

interface Props {
  currentPage: number;
}

const RequestsFilter: FC<Props> = ({ currentPage }) => {
  const branches = useAppSelector(branchSelector);
  const categories = useAppSelector(categorySelector);

  const [id, $id] = useDebounce<number>(0);
  const [department, $department] = useState<string>();
  const [fillial_id, $fillial_id] = useState<number>();
  const [category_id, $category_id] = useState<number>();
  const [urgent, $urgent] = useState<boolean>();
  const [startDate, $startDate] = useState<dateRangeType>();
  const [endDate, $endDate] = useState<dateRangeType>();
  const [request_status, $request_status] = useState<number>();
  const [user, $user] = useDebounce<string>("");

  const { refetch } = useOrders({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
    body: {
      department,
      fillial_id,
      category_id,
      urgent,
      finished_from: endDate?.start,
      finished_to: endDate?.end,
      created_from: startDate?.start,
      created_to: startDate?.end,
      request_status,
      ...(!!id && { id }),
      ...(!!user && { user }),
    },
  });

  useEffect(() => {
    refetch();
  }, [
    id,
    department,
    fillial_id,
    category_id,
    urgent,
    startDate,
    endDate,
    request_status,
    user,
  ]);

  const startRange = (start: Date | null, end: Date | null) => {
    if (start && end)
      $startDate({
        start: start.toISOString(),
        end: end.toISOString(),
      });
  };
  const finishRange = (start: Date | null, end: Date | null) => {
    if (start && end)
      $endDate({ start: start.toISOString(), end: end.toISOString() });
  };

  return (
    <>
      <td></td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $id(Number(e.target.value))}
          blockClass={"m-2"}
          inputType="number"
          className="form-control"
        />
      </td>
      <td className="p-0">
        <BaseSelect
          blockClass={"m-2"}
          onChange={(e) => $department(e.target.value)}
          defaultSelected
          values={OrderTypeNames}
        />
      </td>
      <td className="p-0">
        <BaseSelect
          blockClass={"m-2"}
          onChange={(e) => $fillial_id(Number(e.target.value))}
          defaultSelected
          values={branches}
        />
      </td>
      <td className="p-0">
        <BaseSelect
          blockClass={"m-2"}
          defaultSelected
          onChange={(e) => $category_id(Number(e.target.value))}
          values={categories}
        />
      </td>
      <td className="p-0">
        <BaseSelect
          blockClass={"m-2"}
          onChange={(e) => $urgent(!!Number(e.target.value))}
          defaultSelected
          values={UrgentNames}
        />
      </td>
      <td className="p-0">
        <DateInput blockClass={"m-2"} onDateRangeSelected={finishRange} />
      </td>
      <td className="p-0">
        <DateInput blockClass={"m-2"} onDateRangeSelected={startRange} />
      </td>
      <td className="p-0">
        <BaseSelect
          blockClass={"m-2"}
          onChange={(e) => $request_status(Number(e.target.value))}
          values={RequestStatusArr}
          defaultSelected
        />
      </td>
      <td className="p-0">
        <InputBlock
          blockClass={"m-2"}
          onChange={(e) => $user(e.target.value)}
          className="form-control"
        />
      </td>
      <td></td>
    </>
  );
};

export default RequestsFilter;
