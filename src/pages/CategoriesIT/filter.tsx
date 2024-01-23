import { FC, useState } from "react";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainSelect from "@/components/BaseInputs/MainSelect";

import useCategories from "@/hooks/useCategories";
import useDebounce from "custom/useDebounce";
import useQueryString from "custom/useQueryString";
import useUpdateEffect from "custom/useUpdateEffect";
import { StatusName, itemsPerPage } from "@/utils/helpers";

const CategoriesITFilter: FC = () => {
  const currentPage = Number(useQueryString("page")) || 1;
  const [name, $name] = useDebounce("");
  const [department, $department] = useDebounce("");
  const [category_status, $category_status] = useState<string>();

  const { refetch } = useCategories({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
    ...(!!department && { department }),
    body: {
      ...(!!name && { name }),
      ...(!!category_status && { category_status }),
    },
  });

  useUpdateEffect(() => {
    refetch();
  }, [category_status, name]);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainInput onChange={(e) => $name(e.target.value)} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainInput onChange={(e) => $department(e.target.value)} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainInput disabled />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1 !mb-2">
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

export default CategoriesITFilter;
