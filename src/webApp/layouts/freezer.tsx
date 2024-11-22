import { freezerState } from "@/store/reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const MainFreezerRoute = () => {
  const navigate = useNavigate();
  const { order_id } = useAppSelector(freezerState);

  useEffect(() => {
    if (!!order_id) navigate("/tg/collector/show-order");
    else navigate("/tg/collector/products");
  }, [order_id]);

  return <Outlet />;
};

export default MainFreezerRoute;
