import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import HrButton from "../hr-button";
import { useNavigate } from "react-router-dom";

const HrChooseDirection = () => {
  const navigate = useNavigate();
  return (
    <div>
      <InvHeader title="Официальное оформление" />

      <WebAppContainer>
        <HrButton
          className="mb-4"
          onClick={() => navigate("/tg/hr-registery/registery")}
        >
          <h6 className="mb-1 font-normal text-base text-left text-black">
            Записать на оформление
          </h6>
        </HrButton>
        <HrButton
          className="mb-4"
          onClick={() => navigate("/tg/hr-registery/orders")}
        >
          <h6 className="mb-1 font-normal text-base text-left">
            Отменить запись
          </h6>
        </HrButton>
      </WebAppContainer>
    </div>
  );
};

export default HrChooseDirection;
