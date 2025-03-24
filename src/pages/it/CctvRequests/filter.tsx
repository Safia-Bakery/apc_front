import { ITRequestStatusArr, UrgentValsArr } from "@/utils/helpers";
import { ChangeEvent, FC, useEffect, useState } from "react";
import useDebounce from "custom/useDebounce";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import BranchSelect from "@/components/BranchSelect";
import useQueryString from "custom/useQueryString";
import { Departments, EPresetTimes, Sphere } from "@/utils/types";
import dayjs from "dayjs";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import useCategories, { loadCategoriesChild } from "@/hooks/useCategories";
import { useForm } from "react-hook-form";
import useUpdateEffect from "custom/useUpdateEffect";
import useBrigadas from "@/hooks/useBrigadas";
import StatusFilter from "@/components/StatusFilter";
import AntCascader from "@/components/AntCascader";
import { CascaderProps } from "antd";
import errorToast from "@/utils/errorToast";

interface Option {
  value?: string | number | null;
  label?: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
  loading?: boolean;
}

const CctvFilter: FC = () => {
  const navigate = useNavigateParams();
  const deleteParam = useRemoveParams();

  // const { data: categories, refetch: catRefetch } = useCategories({
  //   department: Departments.IT,
  //   enabled: false,
  //   sphere_status: Sphere.fix,
  // });

  const { data: brigades, refetch: masterRefetch } = useBrigadas({
    enabled: false,
    department: Departments.IT,
  });

  const { register, reset } = useForm();
  const [id, $id] = useDebounce<string>("");
  const [enabled, $enabled] = useState(false);
  const [user, $user] = useDebounce<string>("");
  const category_id = Number(useQueryString("category_id"));
  const created_at = useQueryString("created_at");
  const responsible = Number(useQueryString("responsible"));
  const userQ = useQueryString("user");
  const idQ = useQueryString("id");
  const is_expired = useQueryString("is_expired");
  const urgent = useQueryString("urgent");

  const [options, setOptions] = useState<Option[]>([]);
  const paused = useQueryString("paused");

  const {
    data: categories,
    isLoading: categoriesLoading,
    refetch: catRefetch,
  } = useCategories({
    enabled: false,
    department: Departments.IT,
    sphere_status: Sphere.fix,
    category_status: 1,
    staleTime: EPresetTimes.MINUTE * 4,
  });

  const { mutateAsync, isPending } = loadCategoriesChild();

  const handleChange: CascaderProps<Option>["onChange"] = (value) => {
    navigate({ category_id: Number(value?.at(-1)) });
  };

  const loadData = async (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      const children = await mutateAsync({
        parent_id: Number(targetOption.value),
      });
      targetOption.loading = false;
      targetOption.children = children.items?.map((child) => ({
        value: child.id,
        label: child.name,
      }));
      setOptions([...options]); // Update options to trigger re-render
    } catch (error) {
      errorToast("Failed to load children:");
      targetOption.loading = false;
    }
  };

  useEffect(() => {
    if (!!categories?.items?.length)
      setOptions(
        categories?.items?.map((item) => ({
          label: item.name,
          value: item.id,
          isLeaf: !!item.is_child,
        }))
      );
  }, [categories]);

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
            value={responsible.toString()}
            onChange={(e) => navigate({ responsible: e.target.value })}
          />
        </BaseInput>
      </td>
      <td width={150} className="!p-0 relative">
        <div onClick={() => $enabled(true)} className={"m-1"}>
          <BranchSelect enabled={enabled} />
        </div>
      </td>
      <td className="!p-0">
        <BaseInputs className="!m-1">
          <AntCascader
            className="w-full"
            loading={categoriesLoading || isPending}
            changeOnSelect
            onFocus={() => catRefetch()}
            onChange={handleChange}
            options={options}
            loadData={loadData}
          />
        </BaseInputs>
      </td>
      <td className="!p-0">
        <BaseInputs className="!m-1">
          <MainInput className="!mb-0" />
        </BaseInputs>
      </td>
      <td className="!p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={UrgentValsArr}
            value={urgent?.toString()}
            onChange={(e) => navigate({ urgent: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="!p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={UrgentValsArr}
            value={paused?.toString()}
            onChange={(e) => navigate({ paused: e.target.value })}
          />
        </BaseInputs>
      </td>

      <td className="!p-0">
        <BaseInput className="!m-1">
          <MainInput register={register("comment")} className="!mb-0" />
        </BaseInput>
      </td>
      <td className="!p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={UrgentValsArr}
            value={is_expired?.toString()}
            onChange={(e) => navigate({ is_expired: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="!p-0">
        <BaseInputs className="!m-1">
          <StatusFilter options={ITRequestStatusArr} />
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

export default CctvFilter;
