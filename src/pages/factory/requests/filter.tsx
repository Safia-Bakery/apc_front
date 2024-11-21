import { RequestStatusArr } from "@/utils/helpers";
import { ChangeEvent, FC, useEffect, useState } from "react";
import useDebounce from "custom/useDebounce";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import BranchSelect from "@/components/BranchSelect";
import useQueryString from "custom/useQueryString";
import { Departments, Sphere } from "@/utils/types";
import dayjs from "dayjs";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import useCategories from "@/hooks/useCategories";
import { useForm } from "react-hook-form";
import useUpdateEffect from "custom/useUpdateEffect";
import useBrigadas from "@/hooks/useBrigadas";

const FactoryFilter: FC = () => {
  const navigate = useNavigateParams();
  const deleteParam = useRemoveParams();

  const { data: categories, refetch: catRefetch } = useCategories({
    department: Departments.APC,
    enabled: false,
    sphere_status: Sphere.fabric,
  });

  const { data: brigades, refetch: masterRefetch } = useBrigadas({
    enabled: false,
    department: Departments.APC,
    sphere_status: Sphere.fabric,
  });

  const { register, reset } = useForm();
  const [id, $id] = useDebounce<string>("");
  const [enabled, $enabled] = useState(false);
  const [user, $user] = useDebounce<string>("");
  const category_id = Number(useQueryString("category_id"));
  const status = useQueryString("status");
  const created_at = useQueryString("created_at");
  const responsible = Number(useQueryString("responsible"));
  const userQ = useQueryString("user");
  const idQ = useQueryString("id");

  const startRange = (start: Date | null) => {
    if (start === undefined) deleteParam(["created_at"]);
    if (!!start) navigate({ created_at: start.toISOString() });
  };
  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    $user(e.target.value);

  const handleID = (e: ChangeEvent<HTMLInputElement>) => $id(e.target.value);

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
          <MainInput
            register={register("userName")}
            className="!mb-0"
            onChange={handleName}
          />
        </BaseInput>
      </td>
      <td className="!p-0">
        <BaseInput className="!m-1">
          <MainSelect
            values={brigades?.items.filter((item) => !!item.status)}
            onFocus={() => masterRefetch()}
            value={responsible?.toString()}
            onChange={(e) => navigate({ responsible: e.target.value })}
          />
        </BaseInput>
      </td>
      <td width={150} className="!p-0 relative">
        <div onClick={() => $enabled(true)} className={"m-1"}>
          <BranchSelect enabled={enabled} warehouse />
        </div>
      </td>
      <td className="!p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={categories?.items}
            onFocus={() => catRefetch()}
            value={category_id?.toString()}
            onChange={(e) => navigate({ category_id: e.target.value })}
          />
        </BaseInputs>
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
    </>
  );
};

export default FactoryFilter;
