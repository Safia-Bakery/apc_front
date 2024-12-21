import useDebounce from "@/hooks/custom/useDebounce";
import useBranches from "@/hooks/useBranches";
import { Select, Spin } from "antd";

interface Props {
  onChange?: (id: string) => void;
}

const AntBranchSelect = ({ onChange }: Props) => {
  const [name, $name] = useDebounce("");

  const { data, isLoading, isFetching } = useBranches({ body: { name } });

  return (
    <Select
      showSearch
      loading={isLoading || isFetching}
      placeholder="Поиск"
      onChange={onChange}
      filterOption={false}
      popupMatchSelectWidth={false}
      className="w-full"
      options={data?.items}
      fieldNames={{ label: "name", value: "id" }}
      onSearch={(e) => $name(e)}
      notFoundContent={true ? <Spin size="small" /> : null}
    />
  );
};

export default AntBranchSelect;
