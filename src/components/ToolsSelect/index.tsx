import { FC, useEffect } from "react";
import { useState } from "react";
import useTools from "@/hooks/useTools";
import useDebounce from "custom/useDebounce";
import { Departments } from "@/utils/types";
import Select from "react-select";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
  department?: Departments;
  register?: UseFormRegisterReturn;
  paginate?: boolean;
}

interface SelectValue {
  value: string;
  label: string;
}

const ToolsSelect: FC<Props> = ({
  department,
  paginate = false,
  ...others
}) => {
  const { t } = useTranslation();
  const [query, $query] = useDebounce("");
  const [page, $page] = useState(1);

  const { data, isFetching } = useTools({
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
  }, [data?.items, query]);

  const pageIncrement = () => $page((prev) => prev + 1);

  return (
    <Select
      options={items}
      isLoading={isFetching}
      onMenuScrollToBottom={() => (paginate ? pageIncrement() : null)}
      placeholder={t("select_product")}
      onInputChange={(e) => $query(e)}
      {...others}
    />
  );
};

export default ToolsSelect;
