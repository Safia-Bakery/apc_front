import { RequestStatusArr, SystemArr, UrgentNames } from "src/utils/helpers";
import { ChangeEvent, FC, useEffect, useState } from "react";
import useDebounce from "src/hooks/useDebounce";
import "react-datepicker/dist/react-datepicker.css";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import BranchSelect from "src/components/BranchSelect";
import useQueryString from "src/hooks/useQueryString";
import styles from "./index.module.scss";
import cl from "classnames";
import { Departments, MainPermissions, Sphere } from "src/utils/types";
import dayjs from "dayjs";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";
import useCategories from "src/hooks/useCategories";
import { useForm } from "react-hook-form";
import { permissionSelector } from "src/redux/reducers/auth";
import { useAppSelector } from "src/redux/utils/types";
import useUpdateEffect from "src/hooks/useUpdateEffect";

const StaffFilter: FC = () => {
  const navigate = useNavigateParams();
  const deleteParam = useRemoveParams();
  const perm = useAppSelector(permissionSelector);
  const sphere_status = Number(useQueryString("sphere_status"));

  const { data: categories, refetch: catRefetch } = useCategories({
    department: Departments.apc,
    ...(!!sphere_status && { sphere_status }),
    enabled: false,
  });

  const { register, reset } = useForm();
  const [id, $id] = useDebounce<string>("");
  const [enabled, $enabled] = useState(false);
  const [user, $user] = useDebounce<string>("");
  const [portion, $portion] = useDebounce<string>("");
  const [bread, $bread] = useDebounce<string>("");
  const request_status = useQueryString("request_status");
  const created_at = useQueryString("created_at");
  const userQ = useQueryString("user");
  const idQ = useQueryString("id");

  const startRange = (start: Date | null) => {
    if (start === undefined) deleteParam(["created_at"]);
    if (!!start) navigate({ created_at: start });
  };
  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    $user(e.target.value);
  const handlePortion = (e: ChangeEvent<HTMLInputElement>) =>
    $portion(e.target.value);
  const handleBread = (e: ChangeEvent<HTMLInputElement>) =>
    $bread(e.target.value);

  const handleID = (e: ChangeEvent<HTMLInputElement>) => $id(e.target.value);

  useUpdateEffect(() => {
    navigate({ user });
  }, [user]);

  useUpdateEffect(() => {
    navigate({ id });
  }, [id]);

  useEffect(() => {
    if (!!userQ || !!idQ) {
      reset({
        userName: userQ,
        id: Number(idQ),
      });
    }
  }, []);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="my-2 mx-1">
          <MainInput type="number" onChange={handleID} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="my-2 mx-1">
          <MainInput onChange={handleName} />
        </BaseInput>
      </td>
      <td width={150} className="p-0 position-relative">
        <div
          onClick={() => $enabled(true)}
          className={cl("position-absolute w-100 ", styles.fillial)}
        >
          {perm?.[MainPermissions.get_fillials_list] && (
            <BranchSelect enabled={enabled} />
          )}
        </div>
      </td>
      <td className="p-0">
        <BaseInput className="my-2 mx-1">
          <MainInput onChange={handlePortion} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="my-2 mx-1">
          <MainInput onChange={handleBread} />
        </BaseInput>
      </td>

      <td className="p-0">
        <MainDatePicker
          selected={
            !!created_at && created_at !== "undefined"
              ? dayjs(created_at).toDate()
              : undefined
          }
          onChange={startRange}
          className="mt-1"
          dateFormat="MM.d.yyyy"
        />
      </td>
      <td className="p-0"></td>
    </>
  );
};

export default StaffFilter;
