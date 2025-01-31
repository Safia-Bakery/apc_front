import { FC, useEffect } from "react";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainSelect from "@/components/BaseInputs/MainSelect";
import { useNavigateParams } from "custom/useCustomNavigate";
import useDebounce from "custom/useDebounce";
import useQueryString from "custom/useQueryString";
import { RegionNames, StatusName } from "@/utils/helpers";
import { useForm } from "react-hook-form";

const BranchesFilter: FC = () => {
  const navigate = useNavigateParams();

  const [latitude, $latitude] = useDebounce<number>(0);
  const [longitude, $longitude] = useDebounce<number>(0);
  const fillial_status = useQueryString("fillial_status");
  const country = useQueryString("country");
  const name = useQueryString("name");
  const { reset, register, getValues } = useForm();

  const handleSubmit = () => navigate({ name: getValues("name") });

  useEffect(() => {
    reset({
      name,
    });
  }, []);

  return (
    <>
      <td></td>
      <td className="!p-0">
        <BaseInputs className="!m-1">
          <MainInput
            className="!mb-0"
            register={register("name")}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </BaseInputs>
      </td>
      <td className="!p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={StatusName}
            value={fillial_status?.toString()}
            onChange={(e) => navigate({ fillial_status: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td></td>
    </>
  );
};

export default BranchesFilter;
