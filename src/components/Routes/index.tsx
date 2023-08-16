import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import {
  loginHandler,
  logoutHandler,
  tokenSelector,
} from "src/redux/reducers/auth";
import CreateApcRequest from "src/pages/CreateApcRequest";
import Login from "pages/Login";
import { useEffect, useMemo } from "react";
import useToken from "src/hooks/useToken";
import ControlPanel from "src/pages/ControlPanel";
import RequestsApc from "src/pages/RequestsApc";
import ShowRequestApc from "src/pages/ShowRequestApc";
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
import { Screens } from "src/utils/types";
import useQueriesPrefetch from "src/hooks/sync/useQueriesPrefetch";
import CustomSidebar from "../CustomSidebar";
import Logs from "src/pages/LogsScreen";
import RequestInventory from "src/pages/RequestInventory";
import AddInventoryRequest from "src/pages/AddInventoryRequest";
import RequestsIT from "src/pages/RequestsIT";
import CreateITRequest from "src/pages/CreateITRequest";
import { permissioms as me } from "src/utils/helpers";
import Loading from "../Loader";
import ShowRemainsInStock from "src/pages/ShowRemainsInStock";
import useQueryString from "src/hooks/useQueryString";

export const routes = [
  { element: <ControlPanel />, path: "/", screen: Screens.permitted },
  {
    element: <CreateITRequest />,
    path: "/requests-it/add",
    screen: Screens.requests_it,
  },
  {
    element: <CreateApcRequest />,
    path: "/requests-apc/add",
    screen: Screens.requests,
  },
  {
    element: <ShowRequestApc />,
    path: "/requests-apc/:id",
    screen: Screens.requests,
  },
  {
    element: <RequestsApc />,
    path: "/requests-apc",
    screen: Screens.requests,
  },
  {
    element: <ShowRequestApc />,
    path: "/requests-it/:id",
    screen: Screens.requests_it,
  },
  {
    element: <RequestsIT />,
    path: "/requests-it",
    screen: Screens.requests_it,
  },
  { element: <Logs />, path: "/logs/:id", screen: Screens.requests },
  {
    element: <RequestInventory />,
    path: "/requests-inventory",
    screen: Screens.requests_inventory,
  },
  {
    element: <AddInventoryRequest />,
    path: "/requests-inventory/add",
    screen: Screens.requests_inventory,
  },
  { element: <YandexMap />, path: "/map", screen: Screens.maps },
  { element: <Statistics />, path: "/statistics", screen: Screens.statistics },
  { element: <Categories />, path: "/categories", screen: Screens.category },
  {
    element: <ShowCategory />,
    path: "/categories/:id",
    screen: Screens.category,
  },
  {
    element: <ShowCategory />,
    path: "/categories/add",
    screen: Screens.category,
  },
  { element: <EditAddRole />, path: "/roles/edit/:id", screen: Screens.roles },
  { element: <EditAddRole />, path: "/roles/add", screen: Screens.roles },
  { element: <Roles />, path: "/roles", screen: Screens.roles },
  { element: <ShowRole />, path: "/roles/:id", screen: Screens.roles },
  { element: <EditAddUser />, path: "/users/add", screen: Screens.users },
  { element: <Users />, path: "/users", screen: Screens.users },
  { element: <EditAddUser />, path: "/users/:id", screen: Screens.users },
  { element: <Brigades />, path: "/brigades", screen: Screens.brigada },
  {
    element: <CreateBrigades />,
    path: "/brigades/add",
    screen: Screens.brigada,
  },
  {
    element: <CreateBrigades />,
    path: "/brigades/:id",
    screen: Screens.brigada,
  },
  { element: <Comments />, path: "/comments", screen: Screens.comments },
  { element: <ShowComment />, path: "/comments/:id", screen: Screens.comments },
  { element: <Branches />, path: "/branches", screen: Screens.fillials },
  {
    element: <EditAddBranch />,
    path: "/branches/add",
    screen: Screens.fillials,
  },
  {
    element: <EditAddBranch />,
    path: "/branches/:id",
    screen: Screens.fillials,
  },
  {
    element: <RemainsInStock />,
    path: "/items-in-stock",
    screen: Screens.warehouse,
  },
  {
    element: <ShowRemainsInStock />,
    path: "/items-in-stock/:id",
    screen: Screens.warehouse,
  },
];

const Navigation = () => {
  const token = useAppSelector(tokenSelector);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, error, isLoading } = useToken({});
  const tokenKey = useQueryString("key");
  const { pathname, search } = useLocation();
  //@ts-ignore
  const isSuperAdmin = user?.permissions === "*";
  const { isLoading: appLoading } = useQueriesPrefetch();
  useEffect(() => {
    if (!token) navigate("/login");
    if (!!error) dispatch(logoutHandler());
    if (!!tokenKey) {
      dispatch(loginHandler(tokenKey));
      navigate(pathname + search);
    }
  }, [token, error, tokenKey]);

  const renderSidebar = useMemo(() => {
    if (user?.permissions && token)
      return (
        <>
          <CustomSidebar />
          <BreadCrump />
        </>
      );
  }, [user, me, token]);

  if (appLoading || (isLoading && !!token)) return <Loading />;

  return (
    <>
      {renderSidebar}

      <Routes>
        <Route element={<Login />} path={"/login"} />
        <Route element={<ControlPanel />} path={"/"} />
        {/* <Route element={<ControlPanel />} path={"*"} /> */}
        {routes.map((route) => {
          if (!!(isSuperAdmin ? me : user?.permissions)?.[route.screen]) {
            return (
              <Route
                key={route.path}
                element={route.element}
                path={route.path}
              />
            );
          }
        })}
      </Routes>
    </>
  );
};

export default Navigation;
