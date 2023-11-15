import { RequestStatusArr } from "src/utils/helpers";
import { FC, useState } from "react";
import useDebounce from "src/hooks/custom/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import { Departments } from "src/utils/types";
import useCategories from "src/hooks/useCategories";
import useBranches from "src/hooks/useBranches";

interface Props {
  currentPage: number;
}

const InventoryFilter: FC<Props> = ({ currentPage }) => {
  const { data: branches } = useBranches({});

  const { data: categories, refetch: catRefetch } = useCategories({
    department: Departments.it,
  });

  const [id, $id] = useDebounce<number>(0);
  const [executor, $executor] = useState<string>();
  const [fillial_id, $fillial_id] = useState<number>();
  const [comment, $comment] = useState<string>();
  const [category_id, $category_id] = useState<number>();
  const [endDate, $endDate] = useState<Date | null>();
  const [request_status, $request_status] = useState<string>();
  const [user, $user] = useDebounce<string>("");

  const finishRange = (start: Date | null) => $endDate(start);

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
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $user(e.target.value)} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => $executor(e.target.value)} />
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
          <MainInput onChange={(e) => $comment(e.target.value)} />
        </BaseInputs>
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
        <MainDatePicker selected={endDate} onChange={finishRange} />
      </td>
    </>
  );
};

export default InventoryFilter;
