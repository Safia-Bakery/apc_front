import {
  OrderTypeNames,
  RequestStatusArr,
  UrgentNames,
} from "src/utils/helpers";

import { useAppSelector } from "src/redux/utils/types";
import { branchSelector, categorySelector } from "src/redux/reducers/cache";
import { FC, useEffect, useRef, useState } from "react";
import useOrders from "src/hooks/useOrders";
import useDebounce from "src/hooks/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import { Departments } from "src/utils/types";

interface Props {
  currentPage: number;
}

const InventoryFilter: FC<Props> = ({ currentPage }) => {
  const initialLoadRef = useRef(true);
  const branches = useAppSelector(branchSelector);
  const categories = useAppSelector(categorySelector);

  const [id, $id] = useDebounce<number>(0);
  const [department, $department] = useState<string>();
  const [fillial_id, $fillial_id] = useState<number>();
  const [category_id, $category_id] = useState<number>();
  const [urgent, $urgent] = useState<boolean>();
  const [startDate, $startDate] = useState<Date | null>();
  const [created_at, $created_at] = useState<Date | null>();
  const [user, $user] = useDebounce<string>("");

  const { refetch } = useOrders({
    enabled: false,
    department: Departments.inventory,
    body: {
      created_at: created_at?.toISOString(),
      ...(!!id && { id }),
      ...(!!department && { department }),
      ...(!!fillial_id && { fillial_id }),
      ...(!!category_id && { category_id }),
      ...(!!urgent && { urgent }),
    },
  });

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const fetchData = async () => {
      await refetch();
    };

    fetchData();
  }, [
    id,
    department,
    fillial_id,
    category_id,
    urgent,
    startDate,
    created_at,
    user,
    currentPage,
  ]);

  const startRange = (start: Date | null) => $startDate(start);

  const finishRange = (start: Date | null) => $created_at(start);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput
            type="number"
            onChange={(e) => $id(Number(e.target.value))}
          />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={OrderTypeNames}
            onChange={(e) => $department(e.target.value)}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={branches}
            onChange={(e) => $fillial_id(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={categories}
            onChange={(e) => $category_id(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={UrgentNames}
            onChange={(e) => $urgent(!!Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <MainDatePicker selected={startDate} onChange={startRange} />
      </td>
      {/* <td className="p-0">
        <MainDatePicker selected={endDate} onChange={finishRange} />
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={RequestStatusArr}
            onChange={(e) => $request_status(e.target.value)}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $user(e.target.value)} />
        </BaseInput>
      </td>
      <td></td> */}
    </>
  );
};

export default InventoryFilter;