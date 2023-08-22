import { StatusName } from "src/utils/helpers";
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

const StockFilter: FC<Props> = ({ currentPage }) => {
  const initialLoadRef = useRef(true);
  const [id, $id] = useDebounce<number>(0);
  const [department, $department] = useState<string>();
  const [fillial_id, $fillial_id] = useState<number>();
  const [category_id, $category_id] = useState<number>();
  const [urgent, $urgent] = useState<boolean>();
  const [startDate, $startDate] = useState<Date | null>();
  const [created_at, $created_at] = useState<Date | null>();
  const [request_status, $request_status] = useState<string>();
  const [user, $user] = useDebounce<string>("");

  const { refetch } = useOrders({
    enabled: false,
    body: {
      ...(!!id && { id }),
      ...(!!created_at && { created_at: created_at?.toISOString() }),
      ...(!!department && { department }),
      ...(!!fillial_id && { fillial_id }),
      ...(!!category_id && { category_id }),
      ...(!!request_status && { request_status }),
      ...(!!user && { user }),
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
    request_status,
    user,
    currentPage,
  ]);

  const startRange = (start: Date | null) => $startDate(start);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $user(e.target.value)} />
        </BaseInput>
      </td>

      <td className="p-0">
        <MainDatePicker selected={startDate} onChange={startRange} />
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={StatusName}
            onChange={(e) => $request_status(e.target.value)}
          />
        </BaseInputs>
      </td>
      <td></td>
    </>
  );
};

export default StockFilter;
