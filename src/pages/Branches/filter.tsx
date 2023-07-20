import { FC, useEffect, useRef, useState } from "react";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";

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
          onChange={(e) => $name(e.target.value)}
        />
      </td>
      <td className="p-0">
        <BaseInputs className="mb-0">
          <MainSelect
            values={RegionNames}
            onChange={(e) => $country(e.target.value)}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $latitude(Number(e.target.value))}
          blockClass={"m-2"}
          inputType="number"
        />
      </td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $longitude(Number(e.target.value))}
          blockClass={"m-2"}
          inputType="number"
        />
      </td>
      <td className="p-0">
        <BaseInputs className="mb-0">
          <MainSelect
            values={StatusName}
            onChange={(e) => $fillial_status(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td></td>
    </>
  );
};

export default BranchesFilter;
