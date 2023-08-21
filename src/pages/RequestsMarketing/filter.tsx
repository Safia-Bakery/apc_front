import { RequestStatusArr } from "src/utils/helpers";

import { useAppSelector } from "src/redux/utils/types";
import { branchSelector } from "src/redux/reducers/cache";
import { FC, useEffect, useRef, useState } from "react";
import useOrders from "src/hooks/useOrders";
import useDebounce from "src/hooks/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import useQueryString from "src/hooks/useQueryString";
import useCategories from "src/hooks/useCategories";

interface Props {
  currentPage: number;
}

const InventoryFilter: FC<Props> = ({ currentPage }) => {
  const initialLoadRef = useRef(true);
  const branches = useAppSelector(branchSelector);
  const sub_id = useQueryString("sub_id");
  const { data: categories, refetch: categoryRefetch } = useCategories({
    sub_id: Number(sub_id),
    enabled: false,
  });

  const [id, $id] = useDebounce<number>(0);
  const [phone, $phone] = useState<number>();
  const [changed, $changed] = useState<string>();
  const [fillial_id, $fillial_id] = useState<number>();
  const [category_id, $category_id] = useState<number>();
  const [endDate, $endDate] = useState<Date | null>();
  const [request_status, $request_status] = useState<string>();
  const [user, $user] = useDebounce<string>("");

  const { refetch } = useOrders({
    enabled: false,
    sub_id: Number(sub_id),
    body: {
      finished_from: endDate?.toISOString(),
      finished_to: endDate?.toISOString(),
      ...(!!id && { id }),
      ...(!!phone && { executor: phone }),
      ...(!!fillial_id && { fillial_id }),
      ...(!!category_id && { category_id }),
      ...(!!request_status && { request_status }),
      ...(!!user && { user }),
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
    phone,
    fillial_id,
    category_id,
    endDate,
    request_status,
    user,
    currentPage,
  ]);

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
          <MainInput onChange={(e) => $phone(Number(e.target.value))} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            onFocus={() => categoryRefetch()}
            values={categories?.items || []}
            onChange={(e) => $category_id(Number(e.target.value))}
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
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => $changed(e.target.value)} />
        </BaseInputs>
      </td>
    </>
  );
};

export default InventoryFilter;
