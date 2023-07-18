import { FC, useEffect, useState } from "react";
import BaseSelect from "src/components/BaseSelect";
import InputBlock from "src/components/Input";
import useCategories from "src/hooks/useCategories";
import useDebounce from "src/hooks/useDebounce";
import { StatusName, itemsPerPage } from "src/utils/helpers";

interface Props {
  currentPage: number;
}
const CategoriesFilter: FC<Props> = ({ currentPage }) => {
  const [name, $name] = useDebounce("");
  const [category_status, $category_status] = useState<number>();

  const { refetch } = useCategories({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
    body: { category_status, ...(!!name && { name }) },
  });

  useEffect(() => {
    refetch();
  }, [category_status, name]);
  return (
    <>
      <td></td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $name(e.target.value)}
          blockClass={"m-2"}
          className="form-control"
        />
      </td>
      <td className="p-0">
        <BaseSelect
          blockClass={"m-2"}
          onChange={(e) => $category_status(Number(e.target.value))}
          defaultSelected
          values={StatusName}
        />
      </td>
      <td></td>
    </>
  );
};

export default CategoriesFilter;
