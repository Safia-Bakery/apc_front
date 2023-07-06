import { Route, Routes, useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import {
  logoutHandler,
  roleHandler,
  tokenSelector,
} from "src/redux/reducers/authReducer";
import CreateOrder from "pages/CreateOrder";
import Login from "pages/Login";

import { useLayoutEffect, useMemo } from "react";
import { StatusRoles } from "src/utils/types";
import useToken from "src/hooks/useToken";
import ControlPanel from "src/pages/ControlPanel";
import ActiveOrders from "src/pages/ActiveOrders";

const Navigation = () => {
  const token = useAppSelector(tokenSelector);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const { data: me, isError, error } = useToken({ enabled: !!token });

  // useLayoutEffect(() => {
  //   if (!token) navigate("/login");
  //   // if (isError || error) dispatch(logoutHandler());
  //   if (me?.role) dispatch(roleHandler(me));
  // }, [token, isError, me, error, navigate, dispatch]);

  return (
    <>
      {token && <SideBar />}
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<ControlPanel />} path="/" />

        <Route element={<CreateOrder />} path="/create-order" />
        <Route element={<ActiveOrders />} path="/orders" />
      </Routes>
    </>
  );
};

export default Navigation;
