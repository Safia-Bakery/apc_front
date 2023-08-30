import { RequestStatusArr } from "src/utils/helpers";
import styles from "./index.module.scss";
import { FC, useEffect, useRef, useState } from "react";
import useOrders from "src/hooks/useOrders";
import useDebounce from "src/hooks/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import useCategories from "src/hooks/useCategories";
import dayjs from "dayjs";
import useQueryString from "src/hooks/useQueryString";
import BranchSelect from "src/components/BranchSelect";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";
import cl from "classnames";
import { Departments } from "src/utils/types";

interface Props {
  currentPage: number;
  sub_id?: number | string;
}

const InventoryFilter: FC<Props> = ({ currentPage, sub_id }) => {
  const initialLoadRef = useRef(true);
  const { data: categories, refetch: categoryRefetch } = useCategories({
    sub_id: Number(sub_id),
    enabled: false,
  });

  const choose_fillial = useQueryString("choose_fillial");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const navigate = useNavigateParams();
  const removeParam = useRemoveParams();

  const [id, $id] = useDebounce<number>(0);
  const [phone, $phone] = useState<number>();
  const [changed, $changed] = useState<string>();
  const [category_id, $category_id] = useState<number>();
  const [request_status, $request_status] = useState<string>();
  const [user, $user] = useDebounce<string>("");
  const [created_at, $created_at] = useState<Date | null>();

  const { refetch } = useOrders({
    enabled: false,
    sub_id: Number(sub_id),
    department: Departments.marketing,
    body: {
      ...(!!created_at && {
        created_at: dayjs(created_at).format("YYYY-MM-DD"),
      }),
      ...(!!id && { id }),
      ...(!!phone && { executor: phone }),
      ...(!!branch?.id && { fillial_id: branch?.id }),
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
    branch?.id,
    category_id,
    request_status,
    user,
    created_at,
    currentPage,
  ]);

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
      <td width={150} className="p-0 position-relative">
        <div className={cl("position-absolute w-100", styles.fillial)}>
          <BranchSelect />
        </div>
      </td>
      <td className="p-0">
        <MainDatePicker selected={created_at} onChange={finishRange} />
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
