import { branchSelector } from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import cl from "classnames";
import { useState } from "react";
import BranchModal from "./BranchModal";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/InvHeader";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import arrow from "/assets/icons/primaryArrow.svg";
import SelectTool from "@/webApp/components/SelectTool";
import useToolsIerarch from "@/hooks/useToolsIerarch";

const InvAddOrder = () => {
  const selectedBranch = useAppSelector(branchSelector);
  const [branchModal, $branchModal] = useState(false);

  useToolsIerarch({});

  const closeModal = () => $branchModal(false);
  const handleBranch = () => {
    closeModal();
  };

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

      <SelectTool />

      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-5 z-[105]">
        <InvButton
          btnType={InvBtnType.primary}
          className="w-full"
          onClick={handleBranch}
        >
          Подтвердить
        </InvButton>
      </div>
    </div>
  );
};

export default InvAddOrder;
