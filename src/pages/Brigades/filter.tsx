import React, { FC } from "react";
import BaseInputs from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";

import useBrigadas from "src/hooks/useBrigadas";
import useDebounce from "src/hooks/useDebounce";
import { itemsPerPage } from "src/utils/helpers";
interface Props {
  currentPage: number;
}
const BrigadesFilter: FC<Props> = ({ currentPage }) => {
  const [debName, $debName] = useDebounce("");
  const [debDescr, $debDescr] = useDebounce("");

  const {} = useBrigadas({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => $debName(e.target.value)} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => $debDescr(e.target.value)} />
        </BaseInputs>
      </td>
      <td></td>
    </>
  );
};

export default BrigadesFilter;
