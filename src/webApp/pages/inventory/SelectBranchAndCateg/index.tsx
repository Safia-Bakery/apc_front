import { branchSelector, cartSelector } from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import cl from "classnames";
import { useState } from "react";
import BranchModal from "./BranchModal";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import arrow from "/icons/primaryArrow.svg";
import warnIcon from "/icons/warn.svg";
import SelectCategoryTool from "@/webApp/components/SelectCategoryTool";
import { useNavigate } from "react-router-dom";
import { Departments } from "@/utils/types";
import useCategories from "@/hooks/useCategories";
import Loading from "@/components/Loader";
import { deptSelector } from "@/store/reducers/auth";
import SelectCategoryToolFactory from "@/webApp/components/SelectCategoryToolFactory";
import { useTranslation } from "react-i18next";

const SelectBranchAndCateg = () => {
  const { t } = useTranslation();
  const selectedBranch = useAppSelector(branchSelector);
  const [branchModal, $branchModal] = useState(false);
  const cart = useAppSelector(cartSelector);
  const navigate = useNavigate();
  const cartLength = Object.values(cart)?.length;
  const dep = useAppSelector(deptSelector);

  const { data: categories, isLoading: categoryLoading } = useCategories({
    category_status: 1,
    department: dep,
    // enabled: dep !== Departments.inventory_factory,
  });

  const closeModal = () => $branchModal(false);
  const handleBranch = () => {
    closeModal();
  };

  if (categoryLoading) return <Loading />;

  return (
    <div className="overflow-hidden h-svh overflow-y-auto">
      <InvHeader title={t("new_order")} goBack />
      <div
        className="bg-white my-4"
        onClick={() =>
          dep === Departments.inventory_retail && $branchModal(true)
        }
      >
        <WebAppContainer className="flex items-center justify-between">
          <h4
            className={cl("font-normal text-[#BEA087] text-xl", {
              ["!font-bold"]: !selectedBranch?.id,
            })}
          >
            {!!selectedBranch?.name ? selectedBranch.name : t("select_branch")}
          </h4>
          <div className="flex gap-3 items-center">
            {!selectedBranch?.id && <img src={warnIcon} alt="select-branch" />}
            <img src={arrow} alt="select-branch" />
          </div>
        </WebAppContainer>
      </div>
      <BranchModal isOpen={branchModal} onClose={closeModal} />
      <div className="mt-6">
        {dep === Departments.inventory_factory ? (
          <SelectCategoryToolFactory />
        ) : (
          <SelectCategoryTool />
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-5 z-[105]">
        {!cartLength && branchModal && (
          <InvButton
            btnType={InvBtnType.primary}
            className="w-full"
            onClick={handleBranch}
          >
            {t("approve")}
          </InvButton>
        )}

        {!!cartLength && (
          <InvButton
            btnType={InvBtnType.primary}
            disabled={!cartLength}
            className="w-full"
            onClick={() =>
              navigate("/tg/inventory-request/cart", {
                state: { category_id: categories?.items?.[0]?.id },
              })
            }
          >
            {t("cart")} ({cartLength})
          </InvButton>
        )}
      </div>
    </div>
  );
};

export default SelectBranchAndCateg;
