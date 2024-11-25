import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import Loading from "@/components/Loader";
import {
  factoryToolMutation,
  getInvFactoryCategories,
  getInvFactoryTool,
} from "@/hooks/factory";
import successToast from "@/utils/successToast";
import { ChangeEvent } from "react";
import { useParams } from "react-router-dom";

const AddCategory = () => {
  const { id } = useParams();
  const { mutate, isPending } = factoryToolMutation();

  const { data: categories, isLoading } = getInvFactoryCategories({
    status: 1,
  });

  const {
    data: tool,
    refetch,
    isLoading: toolLoading,
  } = getInvFactoryTool({ id: Number(id) });

  const handleSubmit = (e: ChangeEvent<HTMLSelectElement>) => {
    mutate(
      {
        category_id: +e.target?.value,
        id: Number(id),
        status: tool?.status,
        name: tool?.name,
        file: tool?.file,
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
        value={tool?.category_id || undefined}
      />
      {(isPending || isLoading || toolLoading) && <Loading />}
    </BaseInputs>
  );
};

export default AddCategory;
