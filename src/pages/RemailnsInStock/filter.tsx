import useDebounce from "custom/useDebounce";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import useQueryString from "custom/useQueryString";
import dayjs from "dayjs";
import useUpdateEffect from "custom/useUpdateEffect";

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
        <BaseInput className="!m-1">
          <MainInput className="!m-0" onChange={(e) => $name(e.target.value)} />
        </BaseInput>
      </td>

      <td className="p-0">
        <MainDatePicker
          wrapperClassName={"m-1"}
          dateFormat="d.MM.yyyy"
          selected={
            !!syncDate && syncDate !== "undefined"
              ? dayjs(syncDate).toDate()
              : undefined
          }
          onChange={startRange}
        />
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            className="!m-0"
            onChange={(e) => $count(e.target.value)}
          />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            className="!m-0"
            onChange={(e) => $price(e.target.value)}
          />
        </BaseInput>
      </td>
    </>
  );
};

export default StockFilter;
