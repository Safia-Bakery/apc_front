import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Layout from "src/components/Routes";
import { ToastContainer } from "react-toastify";
import "dayjs/locale/ru";
import dayjs from "dayjs";
import { Suspense, lazy, useEffect, useMemo } from "react";
import Loading from "./components/Loader";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useAppDispatch, useAppSelector } from "./redux/utils/types";
import {
  loginHandler,
  logoutHandler,
  permissionHandler,
  permissionSelector,
  tokenSelector,
} from "./redux/reducers/auth";
import {
  Departments,
  MainPermissions,
  MarketingSubDep,
  Sphere,
} from "./utils/types";
import useToken from "./hooks/useToken";
import useQueryString from "./hooks/useQueryString";
import axios from "axios";

const ControlPanel = lazy(() => import("src/pages/ControlPanel"));
const Masters = lazy(() => import("src/pages/Masters"));
const EditClient = lazy(() => import("src/pages/EditClient"));
const TelegramAddProduct = lazy(() => import("src/pages/TelegramAddProduct"));
const CreateITRequest = lazy(() => import("src/pages/CreateITRequest"));
const CreateApcRequest = lazy(() => import("src/pages/CreateApcRequest"));
const ShowRequestApc = lazy(() => import("src/pages/ShowRequestApc"));
const RequestsApc = lazy(() => import("src/pages/RequestsApc"));
const ShowMarketingRequest = lazy(
  () => import("src/pages/ShowMarketingRequest")
);
const RequestsMarketing = lazy(() => import("src/pages/RequestsMarketing"));
const AddMarketingRequest = lazy(() => import("src/pages/AddMarketingRequest"));

const RequestInventory = lazy(() => import("src/pages/RequestInventory"));
const RequestsIT = lazy(() => import("src/pages/RequestsIT"));
const AddInventoryRequest = lazy(() => import("src/pages/AddInventoryRequest"));
const YandexMap = lazy(() => import("src/pages/Map"));
const Statistics = lazy(() => import("src/pages/Statistics"));
const Categories = lazy(() => import("src/pages/Categories"));
const ShowCategory = lazy(() => import("src/pages/ShowCategory"));
const EditAddRole = lazy(() => import("src/pages/EditAddRole"));
const Roles = lazy(() => import("src/pages/Roles"));
const ShowRole = lazy(() => import("src/pages/ShowRole"));
const EditAddUser = lazy(() => import("src/pages/EditAddUser"));
const Users = lazy(() => import("src/pages/Users"));
const CreateBrigades = lazy(() => import("src/pages/CreateBrigades"));
const Comments = lazy(() => import("src/pages/Comments"));
const ShowComment = lazy(() => import("src/pages/ShowComment"));
const Branches = lazy(() => import("src/pages/Branches"));
const EditAddBranch = lazy(() => import("src/pages/EditAddBranch"));
const RemainsInStock = lazy(() => import("src/pages/RemailnsInStock"));
const ShowRemainsInStock = lazy(() => import("src/pages/ShowRemainsInStock"));

export const routes = [
  { element: <ControlPanel />, path: "/", screen: MainPermissions.add_brigada },
  {
    element: <CreateITRequest />,
    path: "/requests-it/add",
    screen: MainPermissions.add_request_apc,
  },
  {
    element: <CreateApcRequest />,
    path: "/requests-apc-retail/add",
    screen: MainPermissions.add_request_apc,
  },
  {
    element: <CreateApcRequest />,
    path: "/requests-apc-fabric/add",
    screen: MainPermissions.add_fabric_requests,
  },
  {
    element: (
      <ShowRequestApc
        synciiko={MainPermissions.sync_fab_req_iiko}
        edit={MainPermissions.edit_fabric_requests}
        attaching={MainPermissions.fabric_req_attach_master}
      />
    ),
    path: "/requests-apc-fabric/:id",
    screen: MainPermissions.edit_fabric_requests,
  },
  {
    element: (
      <ShowRequestApc
        synciiko={MainPermissions.synch_apc_iiko}
        edit={MainPermissions.edit_request_apc}
        attaching={MainPermissions.request_ettach}
      />
    ),
    path: "/requests-apc-retail/:id",
    screen: MainPermissions.edit_request_apc,
  },
  {
    element: (
      <RequestsApc
        add={MainPermissions.add_request_apc}
        edit={MainPermissions.edit_request_apc}
      />
    ),
    path: "/requests-apc-retail",
    screen: MainPermissions.get_requests_apc,
  },
  {
    element: (
      <RequestsApc
        add={MainPermissions.add_fabric_requests}
        edit={MainPermissions.edit_fabric_requests}
      />
    ),
    path: "/requests-apc-fabric",
    screen: MainPermissions.get_fabric_requests,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[1]}/:id`,
    screen: MainPermissions.edit_design_request,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[2]}/:id`,
    screen: MainPermissions.edit_locmar_requests,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[3]}/:id`,
    screen: MainPermissions.edit_promo_requests,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[4]}/:id`,
    screen: MainPermissions.edit_pos_requests,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[5]}/:id`,
    screen: MainPermissions.edit_complect_requests,
  },
  {
    element: <RequestsMarketing />,
    path: `/marketing-${MarketingSubDep[1]}`,
    screen: MainPermissions.get_design_request,
  },
  {
    element: (
      <RequestsMarketing
      // add={MainPermissions.add_locmar_requests}
      // edit={MainPermissions.edit_locmar_requests}
      // title={"Локальный маркетинг"}
      // sub_id={MarketingSubDep.local_marketing}
      />
    ),
    path: `/marketing-${MarketingSubDep[2]}`,
    screen: MainPermissions.get_locmar_requests,
  },
  {
    element: (
      <RequestsMarketing
      // add={MainPermissions.add_promo_requests}
      // edit={MainPermissions.edit_promo_requests}
      // title={"Промо-продукция"}
      // sub_id={MarketingSubDep.promo_production}
      />
    ),
    path: `/marketing-${MarketingSubDep[3]}`,
    screen: MainPermissions.get_promo_requests,
  },
  {
    element: (
      <RequestsMarketing
      // add={MainPermissions.add_pos_requests}
      // edit={MainPermissions.edit_pos_requests}
      // title={"POS-Материалы"}
      // sub_id={MarketingSubDep.pos}
      />
    ),
    path: `/marketing-${MarketingSubDep[4]}`,
    screen: MainPermissions.get_pos_requests,
  },
  {
    element: <RequestsMarketing />,
    path: `/marketing-${MarketingSubDep[5]}`,
    screen: MainPermissions.get_complect_requests,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[1]}/add`,
    screen: MainPermissions.get_design_request,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[2]}/add`,
    screen: MainPermissions.get_locmar_requests,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[3]}/add`,
    screen: MainPermissions.get_promo_requests,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[4]}/add`,
    screen: MainPermissions.get_pos_requests,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[5]}/add`,
    screen: MainPermissions.get_complect_requests,
  },
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
  { element: <YandexMap />, path: "/map", screen: MainPermissions.get_map },
  {
    element: <Statistics />,
    path: "/statistics",
    screen: MainPermissions.get_statistics,
  },
  {
    element: (
      <Categories
        add={MainPermissions.add_apc_category}
        edit={MainPermissions.edit_apc_category}
        sphere_status={Sphere.retail}
        dep={Departments.apc}
      />
    ),
    path: `/categories-${Departments[1]}-retail`,
    screen: MainPermissions.get_apc_category,
  },
  {
    element: (
      <Categories
        add={MainPermissions.add_categ_fab}
        edit={MainPermissions.edit_categ_fab}
        sphere_status={Sphere.fabric}
        dep={Departments.apc}
      />
    ),
    path: `/categories-${Departments[1]}-fabric`,
    screen: MainPermissions.get_categ_fab,
  },
  {
    element: (
      <Categories
        add={MainPermissions.add_mark_category}
        edit={MainPermissions.edit_mark_category}
        dep={Departments.marketing}
      />
    ),
    path: `/categories-${Departments[3]}`,
    screen: MainPermissions.get_mark_category,
  },
  {
    element: <ShowCategory dep={Departments.marketing} />,
    path: `/categories-${Departments[3]}/:id`,
    screen: MainPermissions.edit_mark_category,
  },
  {
    element: (
      <ShowCategory dep={Departments.apc} sphere_status={Sphere.retail} />
    ),
    path: `/categories-${Departments[1]}-retail/:id`,
    screen: MainPermissions.edit_apc_category,
  },
  {
    element: (
      <ShowCategory dep={Departments.apc} sphere_status={Sphere.fabric} />
    ),
    path: `/categories-${Departments[1]}-fabric/:id`,
    screen: MainPermissions.edit_categ_fab,
  },
  {
    element: <ShowCategory dep={Departments.marketing} />,
    path: `/categories-${Departments[3]}/add`,
    screen: MainPermissions.add_mark_category,
  },
  {
    element: (
      <ShowCategory dep={Departments.apc} sphere_status={Sphere.retail} />
    ),
    path: `/categories-${Departments[1]}-retail/add`,
    screen: MainPermissions.add_apc_category,
  },
  {
    element: (
      <ShowCategory dep={Departments.apc} sphere_status={Sphere.fabric} />
    ),
    path: `/categories-${Departments[1]}-fabric/add`,
    screen: MainPermissions.add_categ_fab,
  },
  {
    element: <EditAddRole />,
    path: "/roles/edit/:id",
    screen: MainPermissions.edit_roles,
  },
  {
    element: <EditAddRole />,
    path: "/roles/add",
    screen: MainPermissions.add_role,
  },
  { element: <Roles />, path: "/roles", screen: MainPermissions.get_roles },
  {
    element: <ShowRole />,
    path: "/roles/:id",
    screen: MainPermissions.edit_roles,
  },
  {
    element: <EditAddUser />,
    path: "/users/add",
    screen: MainPermissions.add_users,
  },
  {
    element: (
      <Users
        add={MainPermissions.add_users}
        edit={MainPermissions.edit_users}
      />
    ),
    path: "/users",
    screen: MainPermissions.get_users,
  },
  {
    element: <EditAddUser />,
    path: "/users/:id",
    screen: MainPermissions.edit_users,
  },
  // {
  //   element: <EditAddUser />,
  //   path: "/clients/add",
  //   screen: MainPermissions.add_clients,
  // },
  {
    element: (
      <Masters
        add={MainPermissions.add_brigada}
        edit={MainPermissions.edit_brigada}
      />
    ),
    path: "/brigades",
    screen: MainPermissions.get_brigadas,
  },
  {
    element: (
      <Masters
        add={MainPermissions.add_master}
        edit={MainPermissions.edit_master}
        isMaster
      />
    ),
    path: "/masters",
    screen: MainPermissions.get_master,
  },
  {
    element: (
      <Users
        add={MainPermissions.add_clients}
        edit={MainPermissions.edit_clients}
      />
    ),
    path: "/clients",
    screen: MainPermissions.get_clients,
  },
  {
    element: <EditClient />,
    path: "/clients/:id",
    screen: MainPermissions.edit_clients,
  },
  {
    element: <CreateBrigades />,
    path: "/masters/add",
    screen: MainPermissions.add_master,
  },
  {
    element: <CreateBrigades />,
    path: "/masters/:id",
    screen: MainPermissions.edit_master,
  },
  {
    element: <CreateBrigades />,
    path: "/brigades/add",
    screen: MainPermissions.add_brigada,
  },
  {
    element: <CreateBrigades />,
    path: "/brigades/:id",
    screen: MainPermissions.edit_brigada,
  },
  {
    element: <Comments />,
    path: "/comments",
    screen: MainPermissions.get_comments_list,
  },
  {
    element: <ShowComment />,
    path: "/comments/:id",
    screen: MainPermissions.edit_comment,
  },
  {
    element: <Branches />,
    path: "/branches",
    screen: MainPermissions.get_fillials_list,
  },
  {
    element: <EditAddBranch />,
    path: "/branches/add",
    screen: MainPermissions.add_fillials,
  },
  {
    element: <EditAddBranch />,
    path: "/branches/:id",
    screen: MainPermissions.edit_fillials,
  },
  {
    element: <RemainsInStock />,
    path: "/items-in-stock",
    screen: MainPermissions.get_warehouse,
  },
  {
    element: <ShowRemainsInStock />,
    path: "/items-in-stock/:id",
    screen: MainPermissions.get_warehouse,
  },
];

dayjs.locale("ru");

const App = () => {
  const token = useAppSelector(tokenSelector);
  const navigate = useNavigate();
  const tokenKey = useQueryString("key");
  const dispatch = useAppDispatch();
  const permission = useAppSelector(permissionSelector);
  const { error, data: user } = useToken({});
  const { pathname, search } = useLocation();

  const renderScreen = useMemo(() => {
    if (!!permission && token)
      return routes.map((route) => {
        if (!!permission?.[route.screen]) {
          return (
            <Route key={route.path} element={route.element} path={route.path} />
          );
        }
      });

    return null;
  }, [permission, routes, token]);

  useEffect(() => {
    if (!token) navigate("/login");
    if (!!error) dispatch(logoutHandler());
  }, [token, error]);

  useEffect(() => {
    if (!!tokenKey) {
      dispatch(loginHandler(tokenKey));
      navigate(pathname + search);
    }
  }, [tokenKey]);

  useEffect(() => {
    if (!!user?.permissions.length)
      dispatch(permissionHandler(user?.permissions));
  }, [user?.permissions, token]);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            element={<TelegramAddProduct />}
            path={"/tg-add-product/:id"}
          />
          <Route element={<Login />} path={"/login"} />
          <Route path="/" element={<Layout />}>
            <Route index element={<ControlPanel />} />
            <Route path="*" element={<ControlPanel />} />
            {renderScreen}
          </Route>
        </Routes>
      </Suspense>

      <ToastContainer />
    </>
  );
};

export default App;
