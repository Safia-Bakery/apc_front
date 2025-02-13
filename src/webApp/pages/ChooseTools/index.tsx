import { branchSelector, cartSelector } from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import cl from "classnames";
import { useEffect } from "react";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import arrow from "/icons/primaryArrow.svg";
import { useNavigate, useParams } from "react-router-dom";
import SelectCategoryTool from "@/webApp/components/SelectCategoryTool";
import useCategory from "@/hooks/useCategory";
import { deptSelector } from "@/store/reducers/auth";
import { Departments } from "@/utils/types";
import SelectCategoryToolFactory from "@/webApp/components/SelectCategoryToolFactory";
import { useTranslation } from "react-i18next";

const ChooseTools = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const department = useAppSelector(deptSelector);
  const selectedBranch = useAppSelector(branchSelector);
  const { data: category } = useCategory({ id: Number(id) });
  const cart = useAppSelector(cartSelector);

  useEffect(() => {
    if (!selectedBranch?.id) navigate("/tg/inventory-request/add-order");
  }, [selectedBranch?.id]);

  return (
    <div className="overflow-hidden h-svh pb-6 flex flex-col">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <InvHeader title={selectedBranch?.name} goBack />
        <div className="bg-white" onClick={() => navigate(-1)}>
          <WebAppContainer className="flex items-center gap-3">
            <img src={arrow} className="rotate-180" alt="select-branch" />
            <h4
              className={cl("font-normal text-[#BEA087] text-xl", {
                ["!font-bold"]: !category?.id,
              })}
            >
              {!!category?.name && category.name}
            </h4>
          </WebAppContainer>
        </div>

        {department === Departments.inventory_factory ? (
          <SelectCategoryToolFactory />
        ) : (
          <SelectCategoryTool />
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white py-2 px-5 z-[105]">
        <InvButton
          btnType={InvBtnType.primary}
          disabled={!Object.values(cart).length}
          className="w-full !h-11"
          onClick={() =>
            navigate("/tg/inventory-request/cart", {
              state: { category_id: id },
            })
          }
        >
          {t("cart")} ({Object.values(cart).length})
        </InvButton>
      </div>
    </div>
  );
};

export default ChooseTools;
