import { RequestStatusArr } from "src/utils/helpers";
import styles from "./index.module.scss";
import { FC, useState } from "react";
import useDebounce from "src/hooks/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import useCategories from "src/hooks/useCategories";
import dayjs from "dayjs";
import useQueryString from "src/hooks/useQueryString";
import BranchSelect from "src/components/BranchSelect";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";
import cl from "classnames";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";
import { MainPermissions } from "src/utils/types";
import useUpdateEffect from "src/hooks/useUpdateEffect";

interface Props {
  sub_id?: number | string;
}

const InventoryFilter: FC<Props> = ({ sub_id }) => {
  const deleteParam = useRemoveParams();
  const { data: categories, refetch: categoryRefetch } = useCategories({
    sub_id: Number(sub_id),
    enabled: false,
  });
  const perm = useAppSelector(permissionSelector);

  const navigate = useNavigateParams();

  const [id, $id] = useDebounce<string>("");
  const [phone, $phone] = useDebounce<string>("");
  const category_id = useQueryString("category_id");
  const request_status = useQueryString("request_status");
  const [enabled, $enabled] = useState(false);
  const [user, $user] = useDebounce<string>("");
  const created_at = useQueryString("created_at");

  const handleName = (user: string) => $user(user);
  const handleID = (id: string) => $id(id);
  const handlePhone = (id: string) => $phone(id);

  const finishRange = (start: Date | null) => {
    if (start === undefined) deleteParam(["created_at"]);
    if (!!start) navigate({ created_at: start });
  };

  useUpdateEffect(() => {
    navigate({ user });
  }, [user]);

  useUpdateEffect(() => {
    navigate({ id });
  }, [id]);

  useUpdateEffect(() => {
    navigate({ phone });
  }, [phone]);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput type="number" onChange={(e) => handleID(e.target.value)} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput onChange={(e) => handleName(e.target.value)} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => handlePhone(e.target.value)} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            onFocus={() => categoryRefetch()}
            values={categories?.items || []}
            value={category_id?.toString()}
            onChange={(e) => navigate({ category_id: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td width={150} className="p-0 position-relative">
        <div
          onClick={() => $enabled(true)}
          className={cl("position-absolute w-100", styles.fillial)}
        >
          {perm?.[MainPermissions.get_fillials_list] && (
            <BranchSelect enabled={enabled} />
          )}
        </div>
      </td>
      <td className="p-0">
        <MainDatePicker
          selected={
            !!created_at && created_at !== "undefined"
              ? dayjs(created_at).toDate()
              : undefined
          }
          onChange={finishRange}
        />
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={RequestStatusArr}
            value={request_status?.toString()}
            onChange={(e) => navigate({ request_status: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => navigate({ changed: e.target.value })} />
        </BaseInputs>
      </td>
    </>
  );
};

export default InventoryFilter;
