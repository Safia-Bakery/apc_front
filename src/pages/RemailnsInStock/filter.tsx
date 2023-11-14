import useDebounce from "src/hooks/useDebounce";
import "react-datepicker/dist/react-datepicker.css";

import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";
import useQueryString from "src/hooks/useQueryString";
import dayjs from "dayjs";
import useUpdateEffect from "src/hooks/useUpdateEffect";

const StockFilter = () => {
  const navigate = useNavigateParams();
  const [count, $count] = useDebounce("");
  const [name, $name] = useDebounce<string>("");
  const [price, $price] = useDebounce<string>("");
  const syncDate = useQueryString("syncDate");
  const deleteParam = useRemoveParams();

  useUpdateEffect(() => {
    navigate({ name });
  }, [name]);

  useUpdateEffect(() => {
    navigate({ count });
  }, [count]);

  useUpdateEffect(() => {
    navigate({ price });
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
          wrapperClassName="w-full pr-3"
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
