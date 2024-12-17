import { RequestStatusArr } from "@/utils/helpers";
import { ChangeEvent, FC, useEffect, useState } from "react";
import useDebounce from "custom/useDebounce";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import BranchSelect from "@/components/BranchSelect";
import useQueryString from "custom/useQueryString";
import { useNavigateParams } from "custom/useCustomNavigate";
import { useForm } from "react-hook-form";
import useUpdateEffect from "custom/useUpdateEffect";
import { getPositions } from "@/hooks/hr-registration";

const HrRequestFilter: FC = () => {
  const navigate = useNavigateParams();

  const { data: positions, refetch: positionsRefetch } = getPositions({
    enabled: false,
    status: 1,
  });

  const { register, reset } = useForm();
  const [id, $id] = useDebounce<string>("");
  const [enabled, $enabled] = useState(false);
  const [user, $user] = useDebounce<string>("");
  const [employee_name, $employee_name] = useDebounce<string>("");
  const status = useQueryString("status");
  const position_id = Number(useQueryString("position_id"));
  const userQ = useQueryString("user");
  const idQ = useQueryString("id");
  const employee = useQueryString("employee_name");

  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    $user(e.target.value);

  const handleEmployee = (e: ChangeEvent<HTMLInputElement>) =>
    $employee_name(e.target.value);

  const handleID = (e: ChangeEvent<HTMLInputElement>) => $id(e.target.value);

  useUpdateEffect(() => {
    navigate({ user });
  }, [user]);

  useUpdateEffect(() => {
    navigate({ employee_name });
  }, [employee_name]);

  useUpdateEffect(() => {
    navigate({ id });
  }, [id]);

  useEffect(() => {
    if (!!userQ || !!idQ || !!employee) {
      reset({
        userName: userQ,
        id: Number(idQ),
        employee,
      });
    }
  }, []);

  return (
    <>
      <td></td>
      <td className="!p-0">
        <BaseInput className="!m-1">
          <MainInput
            register={register("id")}
            className="!mb-0"
            type="number"
            onChange={handleID}
          />
        </BaseInput>
      </td>
      <td className="!p-0">
        <BaseInput className="!m-1">
          <MainSelect
            values={positions}
            onFocus={() => positionsRefetch()}
            value={position_id?.toString()}
            onChange={(e) => navigate({ position_id: e.target.value })}
          />
        </BaseInput>
      </td>
      <td className="!p-0">
        <BaseInput className="!m-1">
          <MainInput
            register={register("userName")}
            className="!mb-0"
            onChange={handleName}
          />
        </BaseInput>
      </td>
      <td width={150} className="!p-0 relative">
        <BaseInput className="!m-1">
          <MainInput
            register={register("employee")}
            className="!mb-0"
            onChange={handleEmployee}
          />
        </BaseInput>
      </td>
      <td className="!p-0">
        <div onClick={() => $enabled(true)} className={"m-1"}>
          <BranchSelect enabled={enabled} />
        </div>
      </td>

      <td className="!p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            defaultValue={status?.toString()}
            onChange={(e) => navigate({ status: e.target.value })}
          >
            <option value={undefined} />
            {RequestStatusArr.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </MainSelect>
        </BaseInputs>
      </td>

      <td className="!p-0">
        {/* <MainDatePicker
          selected={
            !!created_at && created_at !== "undefined"
              ? dayjs(created_at).toDate()
              : undefined
          }
          onChange={startRange}
          dateFormat="d.MM.yyyy"
          wrapperClassName={"m-1"}
        /> */}
      </td>
    </>
  );
};

export default HrRequestFilter;
