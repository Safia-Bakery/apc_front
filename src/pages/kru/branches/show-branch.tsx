import BaseInput from "@/components/BaseInputs";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import useDebounce from "@/hooks/custom/useDebounce";
import { kruAddTools, useKruBranchTools, useKruTools } from "@/hooks/kru";
import useBranch from "@/hooks/useBranch";
import errorToast from "@/utils/errorToast";
import successToast from "@/utils/successToast";
import { ValueLabel } from "@/utils/types";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const KruShowBranch = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: branch, isLoading } = useBranch({ id: id!, enabled: !!id });
  const [tool_name, $tool_name] = useDebounce("");
  const [selected_tools, $selected_tools] = useState<ValueLabel[]>([]);

  const {
    data: defaultVals,
    isLoading: defaultValLoading,
    refetch,
  } = useKruBranchTools({ enabled: !!id, branch_id: id! });

  const { mutate, isPending: mutating } = kruAddTools();

  const { data: tool_item, isPending } = useKruTools({
    enabled: !!tool_name,
    tool_name,
  });

  const handleSubmit = () => {
    mutate(
      {
        branch_id: id!,
        tool_ids: selected_tools.map((item) => +item.value),
      },
      {
        onSuccess: () => {
          refetch();
          successToast("success");
          navigate(-1);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const handleSelect = (data: any, option: any) => {
    if (!selected_tools.find((tool) => tool.value === option.id))
      $selected_tools((prev) => [
        ...prev,
        { value: option.id, label: option.name },
      ]);
  };

  const handleDesect = (id: any) => {
    $selected_tools((prev) => prev.filter((tool) => tool.value !== id));
  };

  useEffect(() => {
    if (defaultVals?.length)
      $selected_tools(
        defaultVals?.map((item) => ({
          label: item.tool.name,
          value: item.tool.id,
        }))
      );
  }, [defaultVals]);

  if (isLoading || defaultValLoading || defaultValLoading) return <Loading />;

  return (
    <Card>
      <Header title={branch?.name} />
      <div className="content">
        <BaseInput label="Добавленные продукты">
          <Select
            mode="multiple"
            loading={isPending}
            allowClear
            onDeselect={handleDesect}
            onSearch={(e) => $tool_name(e)}
            className="flex"
            fieldNames={{ label: "name", value: "name" }}
            placeholder="Введите текст для поиска..."
            onSelect={handleSelect}
            options={tool_item?.tools}
            value={selected_tools}
          />
        </BaseInput>
        <button
          className="btn btn-success"
          disabled={mutating}
          onClick={handleSubmit}
        >
          Отправить
        </button>
      </div>
    </Card>
  );
};

export default KruShowBranch;
