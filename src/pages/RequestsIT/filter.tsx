import {
  OrderTypeNames,
  RequestStatusArr,
  UrgentNames,
} from "src/utils/helpers";

import { useAppSelector } from "src/redux/utils/types";
import {
  branchSelector,
  categorySelector,
} from "src/redux/reducers/cacheResources";
import { FC, useEffect, useRef, useState } from "react";
import useOrders from "src/hooks/useOrders";
import useDebounce from "src/hooks/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";

interface Props {
  currentPage: number;
}

const InventoryFilter: FC<Props> = ({ currentPage }) => {
  const initialLoadRef = useRef(true);
  const branches = useAppSelector(branchSelector);
  const categories = useAppSelector(categorySelector);

  const [id, $id] = useDebounce<number>(0);
  const [executor, $executor] = useState<string>();
  const [fillial_id, $fillial_id] = useState<number>();
  const [comment, $comment] = useState<string>();
  const [category_id, $category_id] = useState<number>();
  const [startDate, $startDate] = useState<Date | null>();
  const [endDate, $endDate] = useState<Date | null>();
  const [request_status, $request_status] = useState<string>();
  const [user, $user] = useDebounce<string>("");

  const { refetch } = useOrders({
    enabled: false,
    body: {
      finished_from: endDate?.toISOString(),
      finished_to: endDate?.toISOString(),
      created_from: startDate?.toISOString(),
      created_to: startDate?.toISOString(),
      ...(!!id && { id }),
      ...(!!executor && { executor }),
      ...(!!fillial_id && { fillial_id }),
      ...(!!category_id && { category_id }),
      ...(!!request_status && { request_status }),
      ...(!!user && { user }),
      ...(!!comment && { comment }),
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
    executor,
    fillial_id,
    category_id,
    comment,
    startDate,
    endDate,
    request_status,
    user,
    currentPage,
  ]);

  const startRange = (start: Date | null) => $startDate(start);

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
