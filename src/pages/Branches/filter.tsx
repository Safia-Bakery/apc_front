import { FC, useEffect, useRef, useState } from "react";
import BaseSelect from "src/components/BaseSelect";
import InputBlock from "src/components/Input";
import useBranches from "src/hooks/useBranches";
import useDebounce from "src/hooks/useDebounce";
import { RegionNames, StatusName, itemsPerPage } from "src/utils/helpers";

interface Props {
  currentPage: number;
}

const BranchesFilter: FC<Props> = ({ currentPage }) => {
  const initialLoadRef = useRef(true);
  const [name, $name] = useDebounce("");
  const [country, $country] = useState("");
  const [latitude, $latitude] = useDebounce<number>(0);
  const [longitude, $longitude] = useDebounce<number>(0);
  const [fillial_status, $fillial_status] = useState<number>();

  const { refetch } = useBranches({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
    body: {
      fillial_status,
      country,
      ...(!!name && { name }),
      ...(!!latitude && { latitude }),
      ...(!!longitude && { longitude }),
    },
  });

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const fetchData = async () => {
      await refetch();
    };

    fetchData();
  }, [name, country, latitude, longitude, fillial_status]);
  return (
    <>
      <td></td>
      <td className="p-0">
        <InputBlock
          blockClass={"m-2"}
          className="form-control"
          onChange={(e) => $name(e.target.value)}
        />
      </td>
      <td className="p-0">
        <BaseSelect
          blockClass={"m-2"}
          defaultSelected
          onChange={(e) => $country(e.target.value)}
          values={RegionNames}
        />
      </td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $latitude(Number(e.target.value))}
          blockClass={"m-2"}
          inputType="number"
          className="form-control"
        />
      </td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $longitude(Number(e.target.value))}
          blockClass={"m-2"}
          inputType="number"
          className="form-control"
        />
      </td>
      <td className="p-0">
        <BaseSelect
          blockClass={"m-2"}
          defaultSelected
          onChange={(e) => $fillial_status(Number(e.target.value))}
          values={StatusName}
        />
      </td>
      <td></td>
    </>
  );
};

export default BranchesFilter;
