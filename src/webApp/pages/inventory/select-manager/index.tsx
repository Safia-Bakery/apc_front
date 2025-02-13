import Loading from "@/components/Loader";
import { getInvFactoryManagers } from "@/hooks/factory";
import CustomLink from "@/webApp/components/CustomLink";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import cl from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const InvSelectManager = () => {
  const { t } = useTranslation();
  const { data: managers, isLoading } = getInvFactoryManagers({});
  const [selected_manager, $selected_manager] = useState<number>();

  if (isLoading) return <Loading />;
  return (
    <>
      <InvHeader title={t("new_order")} goBack sticky />

      <div className="bg-white my-4">
        <WebAppContainer>
          <h3 className={"text-[#BEA087] text-xl"}>
            {t("select_your_master")}
          </h3>
        </WebAppContainer>
      </div>

      <WebAppContainer>
        <div className="grid grid-cols-2 gap-3 pb-24">
          {managers?.map((item) => (
            <div
              onClick={() => $selected_manager(+item.id)}
              className={cl(
                "p-3 rounded-xl border transition-colors uppercase text-xs flex justify-center items-center text-center text-[#595959] border-[#BEA087] bg-[#DCC38B4D]",
                { ["bg-[#DCC38BC9]"]: selected_manager === item.id }
              )}
              key={item.id}
            >
              {item.name}
            </div>
          ))}
        </div>
      </WebAppContainer>

      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-5 z-[105]">
        <CustomLink
          disabled={!selected_manager}
          to={`select-manager-branch/${selected_manager}`}
        >
          <InvButton
            btnType={InvBtnType.primary}
            disabled={!selected_manager}
            className="w-full"
          >
            {t("next")}
          </InvButton>
        </CustomLink>
      </div>
    </>
  );
};

export default InvSelectManager;
