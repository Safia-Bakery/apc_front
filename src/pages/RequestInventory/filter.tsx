import { OrderTypeNames, UrgentNames } from "@/utils/helpers";
import { FC, useEffect, useRef, useState } from "react";
import useOrders from "@/hooks/useOrders";
import useDebounce from "custom/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import { Departments } from "@/utils/types";
import useCategories from "@/hooks/useCategories";
import useBranches from "@/hooks/useBranches";

const InventoryFilter: FC = () => {
  const { data: branches } = useBranches({});
  const { data: categories, refetch: catRefetch } = useCategories({
    department: Departments.inventory,
    enabled: false,
  });

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
  });

  const startRange = (start: Date | null) => $startDate(start);

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
            values={branches?.items}
            onChange={(e) => $fillial_id(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={categories?.items}
            onFocus={() => catRefetch()}
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
