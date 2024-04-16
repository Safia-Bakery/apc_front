import { RequestLogStatusArr, UrgentNames } from "@/utils/helpers";
import { ChangeEvent, FC, useEffect, useState } from "react";
import useDebounce from "custom/useDebounce";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import BranchSelect from "@/components/BranchSelect";
import useQueryString from "custom/useQueryString";
import { Departments, MainPermissions, ValueLabel } from "@/utils/types";
import dayjs from "dayjs";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import useCategories from "@/hooks/useCategories";
import { useForm } from "react-hook-form";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import useUpdateEffect from "custom/useUpdateEffect";
import Select from "react-select";
import StatusFilter from "@/components/StatusFilter";

const LogFilter: FC = () => {
  const navigate = useNavigateParams();
  const deleteParam = useRemoveParams();
  const perm = useAppSelector(permissionSelector);

  const { data: categories, refetch: catRefetch } = useCategories({
    department: Departments.car_requests,
    enabled: false,
  });

  const { register, reset } = useForm();
  const [id, $id] = useDebounce<string>("");
  const [enabled, $enabled] = useState(false);
  const [user, $user] = useDebounce<string>("");
  const category_id = Number(useQueryString("category_id"));
  const urgent = useQueryString("urgent");
  const created_at = useQueryString("created_at");
  const userQ = useQueryString("user");
  const idQ = useQueryString("id");

  const startRange = (start: Date | null) => {
    if (start === undefined) deleteParam(["created_at"]);
    if (!!start) navigate({ created_at: start });
  };
  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    $user(e.target.value);

  const handleID = (e: ChangeEvent<HTMLInputElement>) => $id(e.target.value);

  const handleUrgent = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!!e.target.value) navigate({ urgent: !!+e.target.value });
    else deleteParam(["urgent"]);
  };

  useUpdateEffect(() => {
    navigate({ user });
  }, [user]);

  useUpdateEffect(() => {
    navigate({ id });
  }, [id]);

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
            className="!mb-0"
            register={register("idQ")}
            type="number"
            onChange={handleID}
          />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            className="!mb-0"
            register={register("userName")}
            onChange={handleName}
          />
        </BaseInput>
      </td>
      <td>
        <MainInput className="!mb-0" />
      </td>
      <td width={150} className="p-0 relative">
        <div onClick={() => $enabled(true)} className={"m-1"}>
          {perm?.[MainPermissions.get_fillials_list] && (
            <BranchSelect enabled={enabled} />
          )}
        </div>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={categories?.items}
            onFocus={() => catRefetch()}
            value={category_id.toString()}
            onChange={(e) => navigate({ category_id: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={UrgentNames}
            value={urgent?.toString()}
            onChange={handleUrgent}
          />
        </BaseInputs>
      </td>

      <td className="p-0">
        <MainDatePicker
          selected={
            !!created_at && created_at !== "undefined"
              ? dayjs(created_at).toDate()
              : undefined
          }
          onChange={startRange}
          wrapperClassName={"m-1"}
          dateFormat="d.MM.yyyy"
        />
      </td>

      <td className="p-0">
        <BaseInputs className="!m-1">
          <StatusFilter options={RequestLogStatusArr} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            className="!mb-0"
            onChange={(e) => navigate({ user: e.target.value })}
          />
        </BaseInput>
      </td>
    </>
  );
};

export default LogFilter;
