import {
  OrderTypeNames,
  RequestStatusArr,
  UrgentNames,
} from "src/utils/helpers";

import { useAppSelector } from "src/redux/utils/types";
import { categorySelector } from "src/redux/reducers/cache";
import { FC, useEffect, useRef, useState } from "react";
import useOrders from "src/hooks/useOrders";
import useDebounce from "src/hooks/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import BranchSelect from "src/components/BranchSelect";
import useQueryString from "src/hooks/useQueryString";
import styles from "./index.module.scss";
import cl from "classnames";
import { Departments } from "src/utils/types";
import dayjs from "dayjs";
import { useNavigateParams } from "src/hooks/useCustomNavigate";

interface Props {
  currentPage: number;
}

const InventoryFilter: FC<Props> = ({ currentPage }) => {
  const initialLoadRef = useRef(true);
  const navigate = useNavigateParams();
  const categories = useAppSelector(categorySelector);

  const choose_fillial = useQueryString("choose_fillial");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const [id, $id] = useDebounce<number>(0);
  const [department, $department] = useState<string>();
  const [category_id, $category_id] = useState<number>();
  const [urgent, $urgent] = useState<boolean>();
  const [created_at, $created_at] = useState<Date | null>();
  const [request_status, $request_status] = useState<string>();
  const [user, $user] = useDebounce<string>("");

  const { refetch } = useOrders({
    enabled: false,
    department: Departments.apc,
    body: {
      ...(!!created_at && {
        created_at: dayjs(created_at).format("YYYY-MM-DD"),
      }),
      ...(!!id && { id }),
      ...(!!department && { department }),
      ...(!!branch?.id && { fillial_id: branch?.id }),
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
    branch?.id,
    category_id,
    urgent,
    created_at,
    request_status,
    user,
    currentPage,
  ]);

  const startRange = (start: Date | null) => $created_at(start);

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
      <td width={150} className="p-0 position-relative">
        <div className={cl("position-absolute w-100 ", styles.fillial)}>
          <BranchSelect />
        </div>
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
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $user(e.target.value)} />
        </BaseInput>
      </td>
      <td className="p-0">
        <MainDatePicker selected={created_at} onChange={startRange} />
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
    </>
  );
};

export default InventoryFilter;
