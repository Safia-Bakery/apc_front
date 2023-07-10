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
import EditAddSetting from "src/pages/EditAddSetting";
import EditAddUser from "src/pages/EditAddUser";
import ShowComment from "src/pages/ShowComment";
import EditAddRole from "src/pages/EditAddRole";
import ShowRole from "src/pages/ShowRole";
import BreadCrump from "../BreadCrump";
import CreateBrigades from "src/pages/CreateBrigades";
import Register from "src/pages/Register";

export const routes = [
  { element: <Login />, path: "/login" },
  { element: <Register />, path: "/register" },
  { element: <ControlPanel />, path: "/" },
  { element: <CreateOrder />, path: "/orders/add" },
  { element: <ShowOrder />, path: "/orders/:id" },
  { element: <ActiveOrders />, path: "/orders" },
  { element: <YandexMap />, path: "/map" },
  { element: <Statistics />, path: "/statistics" },
  { element: <Categories />, path: "/categories" },
  { element: <ShowCategory />, path: "/categories/:id" },
  {
    element: <ShowCategory />,
    path: "/categories/add",
  },
  { element: <EditAddRole />, path: "/roles/edit/:id" },
  { element: <EditAddRole />, path: "/roles/add" },
  {
    element: <EditAddUser />,
    path: "/users/:id",
  },
  { element: <EditAddUser />, path: "/users/add" },
  {
    element: <RemainsInStock />,
    path: "/items-in-stock",
  },
  { element: <Brigades />, path: "/brigades" },
  { element: <CreateBrigades />, path: "/brigades/add" },
  { element: <CreateBrigades />, path: "/brigades/:id" },
  { element: <Users />, path: "/users" },
  { element: <Roles />, path: "/roles" },
  { element: <ShowRole />, path: "/roles/:id" },
  { element: <Comments />, path: "/comments" },
  { element: <ShowComment />, path: "/comments/:id" },
  { element: <Settings />, path: "/settings" },
  { element: <EditAddSetting />, path: "/settings/add" },
  { element: <EditAddSetting />, path: "/settings/:id" },
];

const Navigation = () => {
  const token = useAppSelector(tokenSelector);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: me, isError, error } = useToken({ enabled: !!token });

  useLayoutEffect(() => {
    if (!token) navigate("/login");
    if (isError || error) dispatch(logoutHandler());
    if (me) dispatch(roleHandler(me));
  }, [token, isError, me, error]);

  return (
    <>
      {token && (
        <>
          <SideBar />
          <BreadCrump />
        </>
      )}

      <Routes>
        {routes.map((route) => (
          <Route key={route.path} element={route.element} path={route.path} />
        ))}
      </Routes>
    </>
  );
};

export default Navigation;
