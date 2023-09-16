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
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";
import useQueryString from "src/hooks/useQueryString";
import dayjs from "dayjs";

const StockFilter: FC = () => {
  const initialLoadRef = useRef(true);
  const navigate = useNavigateParams();
  const [count, $count] = useDebounce("");
  const [name, $name] = useDebounce<string>("");
  const [price, $price] = useDebounce<string>("");
  const syncDate = useQueryString("syncDate");
  const deleteParam = useRemoveParams();

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const fetchData = async () => {
      await navigate({ name });
    };

    fetchData();
  }, [name]);
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const fetchData = async () => {
      await navigate({ count });
    };

    fetchData();
  }, [count]);
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const fetchData = async () => {
      await navigate({ price });
    };

    fetchData();
  }, [price]);

  const startRange = (start: Date | null) => {
    if (start === undefined) deleteParam(["syncDate"]);
    if (!!start) navigate({ syncDate: start });
  };

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $name(e.target.value)} />
        </BaseInput>
      </td>

      <td className="p-0">
        <MainDatePicker
          wrapperClassName="w-100 pr-3"
          selected={
            !!syncDate && syncDate !== "undefined"
              ? dayjs(syncDate).toDate()
              : undefined
          }
          onChange={startRange}
        />
      </td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $count(e.target.value)} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $price(e.target.value)} />
        </BaseInput>
      </td>
    </>
  );
};

export default StockFilter;
