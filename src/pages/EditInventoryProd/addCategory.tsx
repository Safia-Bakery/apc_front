import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import Loading from "@/components/Loader";
import categoryTools from "@/hooks/mutation/categoryTools";
import useCategories from "@/hooks/useCategories";
import useTools from "@/hooks/useTools";
import { successToast } from "@/utils/toast";
import { Departments } from "@/utils/types";
import { ChangeEvent } from "react";
import { useParams } from "react-router-dom";

const AddCategory = () => {
  const { id } = useParams();
  const { mutate, isPending } = categoryTools();

  const { data: categories, isLoading } = useCategories({
    category_status: 1,
    department: Departments.inventory,
  });
  const {
    data,
    refetch,
    isLoading: toolLoading,
  } = useTools({ id, enabled: !!id });
  const tool = data?.items?.[0];
  const handleSubmit = (e: ChangeEvent<HTMLSelectElement>) => {
    mutate(
      {
        category_id: +e.target?.value,
        tool_id: Number(id),
      },
      {
        onSuccess: () => {
          refetch();
          successToast("success");
        },
      }
    );
  };

  return (
    <BaseInputs label="category">
      <MainSelect
        values={categories?.items}
        onChange={handleSubmit}
        value={tool?.category_id}
      />
      {(isPending || isLoading || toolLoading) && <Loading />}
    </BaseInputs>
  );
};

export default AddCategory;
