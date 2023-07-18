import React, { FC } from "react";
import InputBlock from "src/components/Input";
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
        <InputBlock
          blockClass={"m-2"}
          className="form-control"
          onChange={(e) => $debName(e.target.value)}
        />
      </td>
      <td className="p-0">
        <InputBlock
          blockClass={"m-2"}
          className="form-control"
          onChange={(e) => $debDescr(e.target.value)}
        />
      </td>
      <td></td>
    </>
  );
};

export default BrigadesFilter;
