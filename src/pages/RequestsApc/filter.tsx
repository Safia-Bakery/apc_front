import { RequestStatusArr, SystemArr, UrgentNames } from "src/utils/helpers";
import { ChangeEvent, FC, useEffect, useState } from "react";
import useDebounce from "src/hooks/custom/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import BranchSelect from "src/components/BranchSelect";
import useQueryString from "src/hooks/custom/useQueryString";
import { Departments, MainPermissions, Sphere } from "src/utils/types";
import dayjs from "dayjs";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/custom/useCustomNavigate";
import useCategories from "src/hooks/useCategories";
import { useForm } from "react-hook-form";
import { permissionSelector } from "src/store/reducers/sidebar";
import { useAppSelector } from "src/store/utils/types";
import useUpdateEffect from "src/hooks/useUpdateEffect";

const ApcFilter: FC = () => {
  const navigate = useNavigateParams();
  const deleteParam = useRemoveParams();
  const perm = useAppSelector(permissionSelector);
  const sphere_status = Number(useQueryString("sphere_status"));

  const { data: categories, refetch: catRefetch } = useCategories({
    department: Departments.apc,
    ...(!!sphere_status && { sphere_status }),
    enabled: false,
  });

  const { register, reset } = useForm();
  const [id, $id] = useDebounce<string>("");
  const [enabled, $enabled] = useState(false);
  const [user, $user] = useDebounce<string>("");
  const system = useQueryString("system");
  const request_status = useQueryString("request_status");
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
            register={register("idQ")}
            className="!mb-0"
            type="number"
            onChange={handleID}
          />
        </BaseInput>
      </td>
      {sphere_status === Sphere.fabric && (
        <td className="p-0">
          <BaseInput className="!m-1">
            <MainSelect
              value={system?.toString()}
              values={SystemArr}
              onChange={(e) => navigate({ system: e.target.value })}
            />
          </BaseInput>
        </td>
      )}
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            register={register("userName")}
            className="!mb-0"
            onChange={handleName}
          />
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
            className="!mb-0"
            value={urgent?.toString()}
            onChange={handleUrgent}
          />
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
      <td className="p-0">
        <MainDatePicker
          selected={
            !!created_at && created_at !== "undefined"
              ? dayjs(created_at).toDate()
              : undefined
          }
          onChange={startRange}
          dateFormat="d.MM.yyyy"
          wrapperClassName={"m-1"}
        />
      </td>

      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={RequestStatusArr}
            value={request_status?.toString()}
            onChange={(e) => navigate({ request_status: e.target.value })}
          />
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

export default ApcFilter;
