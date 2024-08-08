import { branchSelector, cartSelector } from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import cl from "classnames";
import { useState } from "react";
import BranchModal from "./BranchModal";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/InvHeader";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import arrow from "/assets/icons/primaryArrow.svg";
import SelectCategoryTool from "@/webApp/components/SelectCategoryTool";
import { useNavigate } from "react-router-dom";
import { Departments } from "@/utils/types";
import useCategories from "@/hooks/useCategories";
import Loading from "@/components/Loader";

const SelectBranchAndCateg = () => {
  const selectedBranch = useAppSelector(branchSelector);
  const [branchModal, $branchModal] = useState(false);
  const cart = useAppSelector(cartSelector);
  const navigate = useNavigate();
  const cartLength = Object.values(cart)?.length;

  const { data: categories, isLoading: categoryLoading } = useCategories({
    category_status: 1,
    department: Departments.inventory,
  });

  const closeModal = () => $branchModal(false);
  const handleBranch = () => {
    closeModal();
  };

  if (categoryLoading) return <Loading />;

  return (
    <div className="overflow-hidden h-svh">
      <InvHeader title="Новая заявка" goBack />
      <div className="bg-white" onClick={() => $branchModal(true)}>
        <WebAppContainer className="flex items-center justify-between">
          <h4
            className={cl("font-normal text-[#BEA087] text-xl", {
              ["!font-bold"]: !selectedBranch?.id,
            })}
          >
            {!!selectedBranch?.name ? selectedBranch.name : "Выберите филиал"}
          </h4>
          <img src={arrow} alt="select-branch" />
        </WebAppContainer>
      </div>
      <BranchModal isOpen={branchModal} onClose={closeModal} />

      <SelectCategoryTool />

      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-5 z-[105]">
        {!cartLength ? (
          <InvButton
            btnType={InvBtnType.primary}
            className="w-full"
            onClick={handleBranch}
          >
            Подтвердить
          </InvButton>
        ) : (
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
            Корзина ({cartLength})
          </InvButton>
        )}
      </div>
    </div>
  );
};

export default SelectBranchAndCateg;
