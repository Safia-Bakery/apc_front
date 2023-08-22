import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import {
  loginHandler,
  logoutHandler,
  permissionHandler,
  permissionSelector,
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
import { MainPerm, MarketingSubDep } from "src/utils/types";
import useQueriesPrefetch from "src/hooks/sync/useQueriesPrefetch";
import CustomSidebar from "../CustomSidebar";
import Logs from "src/pages/LogsScreen";
import RequestInventory from "src/pages/RequestInventory";
import AddInventoryRequest from "src/pages/AddInventoryRequest";
import RequestsIT from "src/pages/RequestsIT";
import CreateITRequest from "src/pages/CreateITRequest";
import Loading from "../Loader";
import ShowRemainsInStock from "src/pages/ShowRemainsInStock";
import useQueryString from "src/hooks/useQueryString";
import TelegramAddProduct from "src/pages/TelegramAddProduct";
import RequestsMarketing from "src/pages/RequestsMarketing";
import AddMarketingRequest from "src/pages/AddMarketingRequest";
import ShowMarketingRequest from "src/pages/ShowMarketingRequest";

export const routes = [
  { element: <ControlPanel />, path: "/", screen: MainPerm.add_brigada },
  {
    element: <CreateITRequest />,
    path: "/requests-it/add",
    screen: MainPerm.add_request_apc,
  },
  {
    element: <CreateApcRequest />,
    path: "/requests-apc/add",
    screen: MainPerm.add_request_apc,
  },
  {
    element: <ShowRequestApc />,
    path: "/requests-apc/:id",
    screen: MainPerm.edit_request_apc,
  },
  {
    element: <RequestsApc />,
    path: "/requests-apc",
    screen: MainPerm.get_requests_apc,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[1]}/:id`,
    screen: MainPerm.edit_designers_requests,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[2]}/:id`,
    screen: MainPerm.edit_locmar_requests,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[3]}/:id`,
    screen: MainPerm.edit_promo_requests,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[4]}/:id`,
    screen: MainPerm.edit_pos_requests,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[5]}/:id`,
    screen: MainPerm.edit_complect_requests,
  },
  {
    element: (
      <RequestsMarketing
        title={"Проектная работа для дизайнеров"}
        sub_id={MarketingSubDep.designers}
      />
    ),
    path: `/marketing-${MarketingSubDep[1]}`,
    screen: MainPerm.get_requests_apc,
  },
  {
    element: (
      <RequestsMarketing
        title={"Локальный маркетинг"}
        sub_id={MarketingSubDep.local_marketing}
      />
    ),
    path: `/marketing-${MarketingSubDep[2]}`,
    screen: MainPerm.get_locmar_requests,
  },
  {
    element: (
      <RequestsMarketing
        title={"Промо-продукция"}
        sub_id={MarketingSubDep.promo_production}
      />
    ),
    path: `/marketing-${MarketingSubDep[3]}`,
    screen: MainPerm.get_promo_requests,
  },
  {
    element: (
      <RequestsMarketing title={"POS-Материалы"} sub_id={MarketingSubDep.pos} />
    ),
    path: `/marketing-${MarketingSubDep[4]}`,
    screen: MainPerm.get_pos_requests,
  },
  {
    element: (
      <RequestsMarketing
        title={"Комплекты"}
        sub_id={MarketingSubDep.complects}
      />
    ),
    path: `/marketing-${MarketingSubDep[5]}`,
    screen: MainPerm.get_complect_requests,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[1]}/add`,
    screen: MainPerm.get_design_request,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[2]}/add`,
    screen: MainPerm.get_locmar_requests,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[3]}/add`,
    screen: MainPerm.get_promo_requests,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[4]}/add`,
    screen: MainPerm.get_pos_requests,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[5]}/add`,
    screen: MainPerm.get_complect_requests,
  },
  { element: <Logs />, path: "/logs/:id", screen: MainPerm.edit_request_apc },
  // {
  //   element: <RequestInventory />,
  //   path: "/requests-inventory",
  //   screen: MainPerm.requests_inventory,
  // },
  // {
  //   element: <AddInventoryRequest />,
  //   path: "/requests-inventory/add",
  //   screen: MainPerm.requests_inventory,
  // },
  { element: <YandexMap />, path: "/map", screen: MainPerm.get_map },
  {
    element: <Statistics />,
    path: "/statistics",
    screen: MainPerm.get_statistics,
  },
  {
    element: <Categories />,
    path: "/categories",
    screen: MainPerm.get_category,
  },
  {
    element: <Categories />,
    path: "/categories-marketing",
    screen: MainPerm.get_category,
  },
  {
    element: <ShowCategory />,
    path: "/categories/:id",
    screen: MainPerm.edit_category,
  },
  {
    element: <ShowCategory />,
    path: "/categories-marketing/add",
    screen: MainPerm.add_category,
  },
  {
    element: <ShowCategory />,
    path: "/categories/add",
    screen: MainPerm.add_category,
  },
  {
    element: <EditAddRole />,
    path: "/roles/edit/:id",
    screen: MainPerm.edit_roles,
  },
  { element: <EditAddRole />, path: "/roles/add", screen: MainPerm.add_role },
  { element: <Roles />, path: "/roles", screen: MainPerm.get_roles },
  { element: <ShowRole />, path: "/roles/:id", screen: MainPerm.edit_roles },
  { element: <EditAddUser />, path: "/users/add", screen: MainPerm.add_users },
  { element: <Users />, path: "/users", screen: MainPerm.get_users },
  { element: <EditAddUser />, path: "/users/:id", screen: MainPerm.edit_users },
  { element: <Brigades />, path: "/brigades", screen: MainPerm.get_brigadas },
  {
    element: <CreateBrigades />,
    path: "/brigades/add",
    screen: MainPerm.add_brigada,
  },
  {
    element: <CreateBrigades />,
    path: "/brigades/:id",
    screen: MainPerm.edit_brigada,
  },
  {
    element: <Comments />,
    path: "/comments",
    screen: MainPerm.get_comments_list,
  },
  {
    element: <ShowComment />,
    path: "/comments/:id",
    screen: MainPerm.edit_comment,
  },
  {
    element: <Branches />,
    path: "/branches",
    screen: MainPerm.get_fillials_list,
  },
  {
    element: <EditAddBranch />,
    path: "/branches/add",
    screen: MainPerm.add_fillials,
  },
  {
    element: <EditAddBranch />,
    path: "/branches/:id",
    screen: MainPerm.edit_fillials,
  },
  {
    element: <RemainsInStock />,
    path: "/items-in-stock",
    screen: MainPerm.get_warehouse,
  },
  {
    element: <ShowRemainsInStock />,
    path: "/items-in-stock/:id",
    screen: MainPerm.get_warehouse,
  },
];

const Navigation = () => {
  const token = useAppSelector(tokenSelector);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, error, isLoading } = useToken({});
  const tokenKey = useQueryString("key");
  const { pathname, search } = useLocation();
  const { isLoading: appLoading } = useQueriesPrefetch();
  const permission = useAppSelector(permissionSelector);

  useEffect(() => {
    if (!!user?.permissions.length)
      dispatch(permissionHandler(user?.permissions));
  }, [user?.permissions]);

  const renderSidebar = useMemo(() => {
    if (permission && token)
      return (
        <>
          <CustomSidebar />
          <BreadCrump />
        </>
      );
  }, [permission, token]);

  const renderScreen = useMemo(() => {
    if (!!permission)
      return routes.map((route) => {
        if (!!permission?.[route.screen]) {
          return (
            <Route key={route.path} element={route.element} path={route.path} />
          );
        }
      });

    return null;
  }, [permission, routes]);

  useEffect(() => {
    if (!!tokenKey) {
      dispatch(loginHandler(tokenKey));
      navigate(pathname + search);
    }
  }, [tokenKey]);

  useEffect(() => {
    if (!token) navigate("/login");
    if (!!error) dispatch(logoutHandler());
  }, [token, error, tokenKey]);

  if ((isLoading && token) || appLoading) return <Loading />;

  return (
    <>
      {renderSidebar}

      <Routes>
        <Route element={<Login />} path={"/login"} />
        <Route element={<ControlPanel />} path={"/"} />
        <Route element={<TelegramAddProduct />} path={"/tg-add-product/:id"} />
        {renderScreen}
      </Routes>
    </>
  );
};

export default Navigation;
