import Loading from "@/components/Loader";
import { getInvFactoryManagersDivisions } from "@/hooks/factory";
import { selectBranch } from "@/store/reducers/webInventory";
import { useAppDispatch } from "@/store/utils/types";
import CustomLink from "@/webApp/components/CustomLink";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import cl from "classnames";
import { useState } from "react";
import { useParams } from "react-router-dom";

const InvSelectManagerBranch = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data: divisions, isLoading } = getInvFactoryManagersDivisions({
    manager_id: Number(id),
    enabled: !!id,
  });
  const [selected_branch, $selected_branch] = useState<{
    name: string;
    id: string;
  }>();

  if (isLoading) return <Loading />;
  return (
    <>
      <InvHeader title="Новая заявка" goBack sticky />

      <div className="bg-white my-4">
        <WebAppContainer>
          <h3 className={"text-[#BEA087] text-xl"}>Выберите свой отдел</h3>
        </WebAppContainer>
      </div>

      <WebAppContainer>
        <div className="grid grid-cols-2 gap-3 pb-24">
          {divisions?.map((item) => (
            <div
              onClick={() =>
                $selected_branch({ id: `${item.id}`, name: item.name })
              }
              className={cl(
                "p-3 rounded-xl border transition-colors uppercase text-xs flex justify-center items-center text-center text-[#595959] border-[#BEA087] bg-[#DCC38B4D]",
                { ["bg-[#DCC38BC9]"]: selected_branch?.id === item.id }
              )}
              key={item.id}
            >
              {item.name}
            </div>
          ))}
        </div>
      </WebAppContainer>

      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-5 z-[105]">
        <CustomLink disabled={!selected_branch} to={`add-order`}>
          <InvButton
            btnType={InvBtnType.primary}
            disabled={!selected_branch}
            className="w-full"
            onClick={() =>
              dispatch(
                selectBranch({
                  name: selected_branch!.name,
                  id: selected_branch!.id,
                })
              )
            }
          >
            Далее
          </InvButton>
        </CustomLink>
      </div>
    </>
  );
};

export default InvSelectManagerBranch;
