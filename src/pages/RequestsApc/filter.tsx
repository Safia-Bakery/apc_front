import { ChangeEvent, FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { RatingFilterVals, RequestStatusArr } from "@/utils/helpers";
import useDebounce from "custom/useDebounce";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import BranchSelect from "@/components/BranchSelect";
import useQueryString from "custom/useQueryString";
import { Departments, Sphere } from "@/utils/types";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import useCategories from "@/hooks/useCategories";
import useUpdateEffect from "custom/useUpdateEffect";
import useBrigadas from "@/hooks/useBrigadas";
import StatusFilter from "@/components/StatusFilter";
import { yearMonthDate } from "@/utils/keys";

interface Props {
  sphere_status?: Sphere;
}

const ApcFilter: FC<Props> = () => {
  const navigate = useNavigateParams();
  const deleteParam = useRemoveParams();

  const { register, reset } = useForm();
  const [id, $id] = useDebounce<string>("");
  const [enabled, $enabled] = useState(false);
  const [user, $user] = useDebounce<string>("");
  const rate = useQueryString("rate");
  const category_id = Number(useQueryString("category_id"));
  const created_at = useQueryString("created_at");
  const finished_at = useQueryString("finished_at");
  const userQ = useQueryString("user");
  const responsible = Number(useQueryString("responsible"));
  const idQ = useQueryString("id");

  const { data: categories, refetch: catRefetch } = useCategories({
    department: Departments.APC,
    sphere_status: Sphere.retail,
    enabled: !!category_id,
  });

  const startRange = (start: Date | null) => {
    if (start === undefined) deleteParam(["created_at"]);
    if (!!start) navigate({ created_at: start });
  };

  const finishRange = (end: Date | null) => {
    if (end === undefined) deleteParam(["finished_at"]);
    if (!!end) navigate({ finished_at: dayjs(end).format(yearMonthDate) });
  };

  const { data: brigades, refetch: masterRefetch } = useBrigadas({
    enabled: !!responsible,
    department: Departments.APC,
    sphere_status: Sphere.retail,
  });

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
        <div onClick={() => $enabled(true)} className={"m-1"}>
          <BranchSelect enabled={enabled} />
        </div>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={categories?.items}
            onFocus={() => catRefetch()}
            value={category_id?.toString()}
            onChange={(e) => navigate({ category_id: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect disabled className="!mb-0" onChange={handleUrgent} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainSelect
            values={brigades?.items.filter((item) => !!item.status)}
            onFocus={() => masterRefetch()}
            value={responsible.toString()}
            onChange={(e) => navigate({ responsible: e.target.value })}
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
        <MainDatePicker
          selected={
            !!finished_at && finished_at !== "undefined"
              ? dayjs(finished_at).toDate()
              : undefined
          }
          onChange={finishRange}
          dateFormat="d.MM.yyyy"
          wrapperClassName={"m-1"}
        />
      </td>

      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={RatingFilterVals}
            value={rate?.toString()}
            onChange={(e) => navigate({ rate: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <StatusFilter options={RequestStatusArr} />
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
