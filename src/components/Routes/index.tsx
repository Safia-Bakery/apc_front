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

import { useLayoutEffect } from "react";
import useToken from "src/hooks/useToken";
import ControlPanel from "src/pages/ControlPanel";
import ActiveOrders from "src/pages/ActiveOrders";
import ShowOrder from "src/pages/ShowOrder";
import YandexMap from "src/pages/Map";
import Categories from "src/pages/Categories";
import RemainsInStock from "src/pages/RemailnsInStock";
import Brigades from "src/pages/Brigades";
import Users from "src/pages/Users";
import Roles from "src/pages/Roles";
import Comments from "src/pages/Comments";
import Settings from "src/pages/Settings";
import Statistics from "src/pages/Statistics";
import ShowCategory from "src/pages/ShowCategory";
import AddEditRole from "src/pages/AddEditRole";
import EditAddUser from "src/pages/EditAddUser";

const Navigation = () => {
  const token = useAppSelector(tokenSelector);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: me, isError, error } = useToken({ enabled: !!token });

  useLayoutEffect(() => {
    if (!token) navigate("/login");
    if (isError || error) dispatch(logoutHandler());
    if (me?.role) dispatch(roleHandler(me));
  }, [token, isError, me, error, navigate, dispatch]);

  return (
    <>
      {token && <SideBar />}
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<ControlPanel />} path="/" />

        <Route element={<CreateOrder />} path="/create-order" />
        <Route element={<ShowOrder />} path="/orders/:id" />
        <Route element={<ActiveOrders />} path="/orders" />
        <Route element={<YandexMap />} path="/map" />
        <Route element={<Statistics />} path="/statistics" />
        <Route element={<Categories />} path="/categories" />
        <Route element={<ShowCategory />} path="/categories/:id" />
        <Route element={<ShowCategory />} path="/add-category" />
        <Route element={<AddEditRole />} path="/edit-role/:id" />
        <Route element={<AddEditRole />} path="/add-role" />
        <Route element={<EditAddUser />} path="/edit-user/:id" />
        <Route element={<EditAddUser />} path="/add-user" />
        <Route element={<RemainsInStock />} path="/items-in-stock" />
        <Route element={<Brigades />} path="/brigades" />
        <Route element={<Users />} path="/users" />
        <Route element={<Roles />} path="/roles" />
        <Route element={<Comments />} path="/comments" />
        <Route element={<Settings />} path="/settings" />
      </Routes>
    </>
  );
};

export default Navigation;
