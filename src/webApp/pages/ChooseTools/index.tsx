import {
  branchSelector,
  cartSelector,
  toolSelector,
} from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import cl from "classnames";
import { useEffect } from "react";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/InvHeader";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import arrow from "/assets/icons/primaryArrow.svg";
import { useNavigate, useParams } from "react-router-dom";
import SelectTool from "@/webApp/components/SelectTool";
import { useInvTools } from "@/hooks/useInvTools";

const ChooseTools = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const selectedTool = useAppSelector(toolSelector);
  const selectedBranch = useAppSelector(branchSelector);
  const cart = useAppSelector(cartSelector);

  // useInvTools({
  //   ...(id && !!selectedBranch?.id && { parent_id: id }),
  // });

  useEffect(() => {
    if (!selectedBranch?.id) navigate("/tg/inventory-request/add-order");
  }, [selectedBranch?.id]);

  return (
    <div className="overflow-hidden h-svh">
      <InvHeader title={selectedBranch?.name} goBack />
      <div className="bg-white" onClick={() => navigate(-1)}>
        <WebAppContainer className="flex items-center gap-3">
          <img src={arrow} className="rotate-180" alt="select-branch" />
          <h4
            className={cl("font-normal text-[#BEA087] text-xl", {
              ["!font-bold"]: !selectedTool?.id,
            })}
          >
            {!!selectedTool?.name && selectedTool.name}
          </h4>
        </WebAppContainer>
      </div>

      <SelectTool />

      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-5 z-[105]">
        <InvButton
          btnType={InvBtnType.primary}
          className="w-full"
          onClick={() => navigate("/tg/inventory-request/cart")}
        >
          Корзина ({Object.values(cart).length})
        </InvButton>
      </div>
    </div>
  );
};

export default ChooseTools;
