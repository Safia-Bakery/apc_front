import {
  OrderTypeNames,
  RequestStatusArr,
  UrgentNames,
  itemsPerPage,
} from "src/utils/helpers";

import InputBlock from "src/components/Input";
import { useAppSelector } from "src/redux/utils/types";
import {
  branchSelector,
  categorySelector,
} from "src/redux/reducers/cacheResources";
import DatePicker from "react-datepicker";
import { FC, useEffect, useRef, useState } from "react";
import useOrders from "src/hooks/useOrders";
import useDebounce from "src/hooks/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";

type dateRangeType = {
  start: string;
  end: string;
};

interface Props {
  currentPage: number;
}

const RequestsFilter: FC<Props> = ({ currentPage }) => {
  const initialLoadRef = useRef(true);
  const branches = useAppSelector(branchSelector);
  const categories = useAppSelector(categorySelector);

  const [id, $id] = useDebounce<number>(0);
  const [department, $department] = useState<string>();
  const [fillial_id, $fillial_id] = useState<number>();
  const [category_id, $category_id] = useState<number>();
  const [urgent, $urgent] = useState<boolean>();
  const [startDate, $startDate] = useState<Date | null>();
  const [endDate, $endDate] = useState<Date | null>();
  const [request_status, $request_status] = useState<number>();
  const [user, $user] = useDebounce<string>("");

  const { refetch } = useOrders({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
    body: {
      // department,
      // fillial_id,
      // category_id,
      // urgent,
      finished_from: endDate?.toISOString(),
      finished_to: endDate?.toISOString(),
      created_from: startDate?.toISOString(),
      created_to: startDate?.toISOString(),
      // request_status,
      ...(!!id && { id }),
      ...(!!department && { department }),
      ...(!!fillial_id && { fillial_id }),
      ...(!!category_id && { category_id }),
      ...(!!urgent && { urgent }),
      // ...(!!endDate?.start && { finished_from: endDate?.start }),
      // ...(!!endDate?.end && { finished_to: endDate?.end }),
      // ...(!!startDate?.start && { created_from: startDate?.start }),
      // ...(!!startDate?.end && { created_to: startDate?.end }),
      ...(!!request_status && { request_status }),
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
    endDate,
    request_status,
    user,
  ]);

  const startRange = (start: Date | null) => $startDate(start);

  const finishRange = (start: Date | null) => $endDate(start);

  return (
    <>
      <td></td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $id(Number(e.target.value))}
          blockClass={"m-2"}
          inputType="number"
        />
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
        <DatePicker
          selected={startDate}
          onChange={startRange}
          wrapperClassName="form-group m-2"
          className="form-control"
        />
      </td>
      <td className="p-0">
        <DatePicker
          selected={endDate}
          onChange={finishRange}
          wrapperClassName="form-group m-2"
          className="form-control"
        />
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={RequestStatusArr}
            onChange={(e) => $request_status(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <InputBlock
          blockClass={"m-2"}
          onChange={(e) => $user(e.target.value)}
        />
      </td>
      <td></td>
    </>
  );
};

export default RequestsFilter;
