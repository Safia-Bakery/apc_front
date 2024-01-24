import { FC, useEffect } from "react";
import { useState } from "react";
import useTools from "@/hooks/useTools";
import useDebounce from "custom/useDebounce";
import { Departments } from "@/utils/types";
import Select from "react-select";
import { UseFormRegisterReturn } from "react-hook-form";
import Loading from "../Loader";

interface Props {
  department?: Departments;
  register?: UseFormRegisterReturn;
}

interface SelectValue {
  value: string;
  label: string;
}

const ToolsSelect: FC<Props> = ({ department, ...others }) => {
  const [query, $query] = useDebounce("");
  const [page, $page] = useState(1);

  const { data, isLoading } = useTools({
    page,
    department,
    ...(!!query && { name: query }),
  });
  const [items, $items] = useState<SelectValue[]>([]);

  useEffect(() => {
    if (data?.items?.length)
      $items((prev) => [
        ...prev,
        ...data.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      ]);
    if (!!query && data?.items)
      $items(
        data.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        })
      );
  }, [data?.items]);

  const pageIncrement = () => $page((prev) => prev + 1);

  if (isLoading) return <Loading absolute />;

  return (
    <Select
      options={items}
      onMenuScrollToBottom={pageIncrement}
      placeholder="Выбрать товар"
      onInputChange={(e) => $query(e)}
      {...others}
    />
  );
};

export default ToolsSelect;
