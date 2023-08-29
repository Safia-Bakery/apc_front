import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Layout from "src/components/Routes";
import { ToastContainer } from "react-toastify";
import "dayjs/locale/ru";
import dayjs from "dayjs";
import { Suspense, lazy, useMemo } from "react";
import Loading from "./components/Loader";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useAppSelector } from "./redux/utils/types";
import { permissionSelector } from "./redux/reducers/auth";
import { Departments, MainPermissions, MarketingSubDep } from "./utils/types";

const ControlPanel = lazy(() => import("src/pages/ControlPanel"));
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
const Brigades = lazy(() => import("src/pages/Brigades"));
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
    path: "/requests-apc/add",
    screen: MainPermissions.add_request_apc,
  },
  {
    element: <ShowRequestApc />,
    path: "/requests-apc/:id",
    screen: MainPermissions.edit_request_apc,
  },
  {
    element: <RequestsApc sphere_status={1} />,
    path: "/requests-apc-retail",
    screen: MainPermissions.get_requests_apc,
  },
  {
    element: <RequestsApc sphere_status={2} />,
    path: "/requests-apc-fabric",
    screen: MainPermissions.get_requests_apc,
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
    element: (
      <RequestsMarketing
        add={MainPermissions.add_design_request}
        edit={MainPermissions.edit_design_request}
        title={"Проектная работа для дизайнеров"}
        sub_id={MarketingSubDep.designers}
      />
    ),
    path: `/marketing-${MarketingSubDep[1]}`,
    screen: MainPermissions.get_design_request,
  },
  {
    element: (
      <RequestsMarketing
        add={MainPermissions.add_locmar_requests}
        edit={MainPermissions.edit_locmar_requests}
        title={"Локальный маркетинг"}
        sub_id={MarketingSubDep.local_marketing}
      />
    ),
    path: `/marketing-${MarketingSubDep[2]}`,
    screen: MainPermissions.get_locmar_requests,
  },
  {
    element: (
      <RequestsMarketing
        add={MainPermissions.add_promo_requests}
        edit={MainPermissions.edit_promo_requests}
        title={"Промо-продукция"}
        sub_id={MarketingSubDep.promo_production}
      />
    ),
    path: `/marketing-${MarketingSubDep[3]}`,
    screen: MainPermissions.get_promo_requests,
  },
  {
    element: (
      <RequestsMarketing
        add={MainPermissions.add_pos_requests}
        edit={MainPermissions.edit_pos_requests}
        title={"POS-Материалы"}
        sub_id={MarketingSubDep.pos}
      />
    ),
    path: `/marketing-${MarketingSubDep[4]}`,
    screen: MainPermissions.get_pos_requests,
  },
  {
    element: (
      <RequestsMarketing
        add={MainPermissions.add_complect_requests}
        edit={MainPermissions.edit_complect_requests}
        title={"Комплекты"}
        sub_id={MarketingSubDep.complects}
      />
    ),
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
    element: <Categories sphere_status={1} dep={Departments.apc} />,
    path: `/categories-${Departments[1]}-retail`,
    screen: MainPermissions.get_apc_category,
  },
  {
    element: <Categories sphere_status={1} dep={Departments.apc} />,
    path: `/categories-${Departments[1]}-fabric`,
    screen: MainPermissions.get_apc_category,
  },
  {
    element: <Categories dep={Departments.marketing} />,
    path: `/categories-${Departments[3]}`,
    screen: MainPermissions.get_mark_category,
  },
  {
    element: <ShowCategory />,
    path: "/categories/:id",
    screen: MainPermissions.edit_apc_category,
  },
  {
    element: <ShowCategory />,
    path: `/categories-${Departments[3]}/add`,
    screen: MainPermissions.add_mark_category,
  },
  {
    element: <ShowCategory />,
    path: `/categories-${Departments[1]}/add`,
    screen: MainPermissions.add_apc_category,
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
  { element: <Users />, path: "/users", screen: MainPermissions.get_users },
  {
    element: <EditAddUser />,
    path: "/users/:id",
    screen: MainPermissions.edit_users,
  },
  {
    element: <Brigades />,
    path: "/brigades",
    screen: MainPermissions.get_brigadas,
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
  const permission = useAppSelector(permissionSelector);

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

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route element={<Login />} path={"/login"} />
              <Route index element={<ControlPanel />} />
              <Route
                element={<TelegramAddProduct />}
                path={"/tg-add-product/:id"}
              />
              {renderScreen}
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
