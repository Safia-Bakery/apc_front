import { versionHandler } from "@/store/reducers/versionCheck";
import { useAppDispatch } from "@/store/utils/types";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const InventoryLayout = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(versionHandler());
  }, []);

  return <Outlet />;
};

export default InventoryLayout;
