import { FC, useState } from "react";
import BaseInputs from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainSelect from "src/components/BaseInputs/MainSelect";

import useCategories from "src/hooks/useCategories";
import useDebounce from "src/hooks/useDebounce";
import useQueryString from "src/hooks/useQueryString";
import useUpdateEffect from "src/hooks/useUpdateEffect";
import { StatusName, itemsPerPage } from "src/utils/helpers";

const CategoriesFilter: FC = () => {
  const currentPage = Number(useQueryString("page")) || 1;
  const [name, $name] = useDebounce("");
  const [department, $department] = useDebounce("");
  const [category_status, $category_status] = useState<string>();

  const { refetch } = useCategories({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
    body: {
      ...(!!name && { name }),
      ...(!!category_status && { category_status }),
      ...(!!department && { department }),
    },
  });

  useUpdateEffect(() => {
    refetch();
  }, [category_status, name]);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => $name(e.target.value)} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => $department(e.target.value)} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={StatusName}
            onChange={(e) => $category_status(e.target.value)}
          />
        </BaseInputs>
      </td>
      <td></td>
    </>
  );
};

export default CategoriesFilter;
