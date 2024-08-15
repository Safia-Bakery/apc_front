import { RequestStatusArr } from "@/utils/helpers";
import { ChangeEvent, useEffect, useState } from "react";
import useDebounce from "custom/useDebounce";
import BaseInputs from "@/components/BaseInputs";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import BranchSelect from "@/components/BranchSelect";
import useQueryString from "custom/useQueryString";
import dayjs from "dayjs";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import { useForm } from "react-hook-form";
import useUpdateEffect from "custom/useUpdateEffect";
import StatusFilter from "@/components/StatusFilter";

const FormFilter = () => {
  const navigate = useNavigateParams();
  const deleteParam = useRemoveParams();

  // const { data: categories, refetch: catRefetch } = useCategories({
  //   department: Departments.form,
  //   enabled: false,
  // });

  const { register, reset } = useForm();
  const [id, $id] = useDebounce<string>("");
  const [enabled, $enabled] = useState(false);
  const created_at = useQueryString("created_at");
  const userQ = useQueryString("user");
  const idQ = useQueryString("id");

  const startRange = (start: Date | null) => {
    if (start === undefined) deleteParam(["created_at"]);
    if (!!start) navigate({ created_at: start.toISOString() });
  };

  const handleID = (e: ChangeEvent<HTMLInputElement>) => $id(e.target.value);

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
            register={register("id")}
            className="!mb-0"
            type="number"
            onChange={handleID}
          />
        </BaseInput>
      </td>
      <td width={150} className="p-0 relative">
        <div onClick={() => $enabled(true)} className={"m-1"}>
          <BranchSelect enabled={enabled} />
        </div>
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
        <BaseInput className="!m-1">
          <MainInput className="!mb-0" />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput className="!mb-0" />
        </BaseInput>
      </td>

      {/* <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            register={register("userName")}
            className="!mb-0"
            onChange={handleName}
          />
        </BaseInput>
      </td> */}

      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput register={register("comment")} className="!mb-0" />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <StatusFilter options={RequestStatusArr} />
        </BaseInputs>
      </td>
    </>
  );
};

export default FormFilter;
