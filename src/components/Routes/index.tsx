import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import {
  logoutHandler,
  roleHandler,
  tokenSelector,
} from "src/redux/reducers/authReducer";
import CreateOrder from "pages/CreateOrder";
import Login from "pages/Login";
import { useEffect } from "react";
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
import Branches from "src/pages/Branches";
import Statistics from "src/pages/Statistics";
import ShowCategory from "src/pages/ShowCategory";
import EditAddBranch from "src/pages/EditAddBranch";
import EditAddUser from "src/pages/EditAddUser";
import ShowComment from "src/pages/ShowComment";
import EditAddRole from "src/pages/EditAddRole";
import ShowRole from "src/pages/ShowRole";
import BreadCrump from "../BreadCrump";
import CreateBrigades from "src/pages/CreateBrigades";
import Register from "src/pages/Register";
import Sidebar from "../Sidebar";
import useBrigadas from "src/hooks/useBrigadas";
import useRoles from "src/hooks/useRoles";
import useCategories from "src/hooks/useCategories";
import useBranches from "src/hooks/useBranches";
import TestSidebar from "../TestSidebar";

const Navigation = () => {
  const token = useAppSelector(tokenSelector);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: me, isError, error } = useToken({ enabled: !!token });
  useRoles({ enabled: !!token });
  useBrigadas({ enabled: !!token });
  useBranches({ enabled: !!token });
  useCategories({
    enabled: !!token,
  });

  useEffect(() => {
    if (!token) navigate("/login");
    if (isError || error) dispatch(logoutHandler());
    if (me) dispatch(roleHandler(me));
  }, [token, isError, me, error]);

  return (
    <>
      {token && (
        <>
          <Sidebar />
          {/* <TestSidebar /> */}
          <BreadCrump />
        </>
      )}

      <Routes>
        <Route element={<Login />} path={"/login"} />
        <Route element={<Register />} path={"/register"} />
        <Route element={<ControlPanel />} path={"/"} />
        <Route element={<CreateOrder />} path={"/orders/add"} />
        <Route element={<ShowOrder />} path={"/orders/:id"} />
        <Route element={<ActiveOrders />} path={"/orders"} />
        <Route element={<YandexMap />} path={"/map"} />
        <Route element={<Statistics />} path={"/statistics"} />
        <Route element={<Categories />} path={"/categories"} />
        <Route element={<ShowCategory />} path={"/categories/:id"} />
        <Route element={<EditAddRole />} path={"/roles/edit/:id"} />
        <Route element={<EditAddRole />} path={"/roles/add"} />
        <Route element={<EditAddUser />} path={"/users/add"} />
        <Route element={<Brigades />} path={"/brigades"} />
        <Route element={<CreateBrigades />} path={"/brigades/add"} />
        <Route element={<CreateBrigades />} path={"/brigades/:id"} />
        <Route element={<Users />} path={"/users"} />
        <Route element={<Roles />} path={"/roles"} />
        <Route element={<ShowRole />} path={"/roles/:id"} />
        <Route element={<Comments />} path={"/comments"} />
        <Route element={<ShowComment />} path={"/comments/:id"} />
        <Route element={<Branches />} path={"/branches"} />
        <Route element={<EditAddBranch />} path={"/branches/add"} />
        <Route element={<EditAddBranch />} path={"/branches/:id"} />
        <Route element={<ShowCategory />} path={"/categories/add"} />
        <Route element={<EditAddUser />} path={"/users/:id"} />
        <Route element={<RemainsInStock />} path={"/items-in-stock"} />
      </Routes>
    </>
  );
};

export default Navigation;
