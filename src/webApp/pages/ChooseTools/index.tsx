import { branchSelector, cartSelector } from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import cl from "classnames";
import { useEffect } from "react";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/InvHeader";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import arrow from "/icons/primaryArrow.svg";
import { useNavigate, useParams } from "react-router-dom";
import SelectCategoryTool from "@/webApp/components/SelectCategoryTool";
import useCategory from "@/hooks/useCategory";

const ChooseTools = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const selectedBranch = useAppSelector(branchSelector);
  const { data: category } = useCategory({ id: Number(id) });
  const cart = useAppSelector(cartSelector);

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
              ["!font-bold"]: !category?.id,
            })}
          >
            {!!category?.name && category.name}
          </h4>
        </WebAppContainer>
      </div>

      <SelectCategoryTool />

      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-5 z-[105]">
        <InvButton
          btnType={InvBtnType.primary}
          disabled={!Object.values(cart).length}
          className="w-full"
          onClick={() =>
            navigate("/tg/inventory-request/cart", {
              state: { category_id: id },
            })
          }
        >
          Корзина ({Object.values(cart).length})
        </InvButton>
      </div>
    </div>
  );
};

export default ChooseTools;
