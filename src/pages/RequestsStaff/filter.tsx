import { ChangeEvent, FC, useEffect, useState } from "react";
import useDebounce from "custom/useDebounce";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import BranchSelect from "@/components/BranchSelect";
import useQueryString from "custom/useQueryString";
import { MainPermissions } from "@/utils/types";
import dayjs from "dayjs";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import { useForm } from "react-hook-form";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import useUpdateEffect from "custom/useUpdateEffect";

const today = new Date();
const tomorrow = today.setDate(today.getDate() + 1);

const StaffFilter: FC = () => {
  const navigate = useNavigateParams();
  const deleteParam = useRemoveParams();
  const perm = useAppSelector(permissionSelector);

  const { reset, register } = useForm();
  const [id, $id] = useDebounce<string>("");
  const [enabled, $enabled] = useState(false);
  const [user, $user] = useDebounce<string>("");
  const [portion, $portion] = useDebounce<string>("");
  const [bread, $bread] = useDebounce<string>("");
  const arrival_date = useQueryString("arrival_date");
  const userQ = useQueryString("user");
  const idQ = useQueryString("id");

  const startRange = (start: Date | null) => {
    if (start === undefined) deleteParam(["arrival_date"]);
    if (!!start) navigate({ arrival_date: start });
  };
  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    $user(e.target.value);
  const handlePortion = (e: ChangeEvent<HTMLInputElement>) =>
    $portion(e.target.value);
  const handleBread = (e: ChangeEvent<HTMLInputElement>) =>
    $bread(e.target.value);

  const handleID = (e: ChangeEvent<HTMLInputElement>) => $id(e.target.value);

  useUpdateEffect(() => {
    navigate({ user });
  }, [user]);

  useUpdateEffect(() => {
    navigate({ id });
  }, [id]);

  useUpdateEffect(() => {
    navigate({ portion });
  }, [portion]);

  useUpdateEffect(() => {
    navigate({ bread });
  }, [bread]);

  useEffect(() => {
    if (!!userQ || !!idQ) {
      reset({
        userName: userQ,
        id: Number(idQ),
      });
    }
  }, []);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            register={register("idQ")}
            className="!mb-0"
            type="number"
            onChange={handleID}
          />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput className="!mb-0" onChange={handleName} />
        </BaseInput>
      </td>
      <td width={150} className="p-0 relative">
        <div
          onClick={() => $enabled(true)}
          className={"absolute top-1 left-1 right-1"}
        >
          {perm?.[MainPermissions.get_fillials_list] && (
            <BranchSelect enabled={enabled} />
          )}
        </div>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput className="!mb-0" onChange={handlePortion} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput className="!mb-0" onChange={handleBread} />
        </BaseInput>
      </td>

      <td className="p-0">
        <MainDatePicker
          selected={
            !!arrival_date && arrival_date !== "undefined"
              ? dayjs(arrival_date).toDate()
              : dayjs(tomorrow).toDate()
          }
          onChange={startRange}
          wrapperClassName={"m-1"}
          dateFormat="d.MM.yyyy"
        />
      </td>
      <td className="p-0"></td>
    </>
  );
};

export default StaffFilter;
