import { RatingFilterVals, RequestMarkStatusArr } from "@/utils/helpers";
import { FC, useState } from "react";
import useDebounce from "custom/useDebounce";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import useCategories from "@/hooks/useCategories";
import dayjs from "dayjs";
import useQueryString from "custom/useQueryString";
import BranchSelect from "@/components/BranchSelect";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import { MainPermissions } from "@/utils/types";
import useUpdateEffect from "custom/useUpdateEffect";
import StatusFilter from "@/components/StatusFilter";

interface Props {
  sub_id?: number | string;
}

const MarketingFilter: FC<Props> = ({ sub_id }) => {
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
  const rate = useQueryString("rate");

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
        <BaseInput className="!m-1">
          <MainInput
            className="!mb-0"
            type="number"
            onChange={(e) => handleID(e.target.value)}
          />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            className="!mb-0"
            onChange={(e) => handleName(e.target.value)}
          />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainInput
            className="!mb-0"
            onChange={(e) => handlePhone(e.target.value)}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            onFocus={() => categoryRefetch()}
            values={categories?.items || []}
            value={category_id?.toString()}
            onChange={(e) => navigate({ category_id: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td width={150} className="p-0 relative">
        <div onClick={() => $enabled(true)} className={"m-1"}>
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
          dateFormat="d.MM.yyyy"
          wrapperClassName={"m-1"}
        />
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={RatingFilterVals}
            value={rate?.toString()}
            onChange={(e) => navigate({ rate: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          {/* <MainSelect
            values={RequestMarkStatusArr}
            value={request_status?.toString()}
            onChange={(e) => navigate({ request_status: e.target.value })}
          /> */}

          <StatusFilter options={RequestMarkStatusArr} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainInput
            className="!mb-0"
            onChange={(e) => navigate({ changed: e.target.value })}
          />
        </BaseInputs>
      </td>
    </>
  );
};

export default MarketingFilter;
