import "dayjs/locale/ru";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import WebRooutes from "./components/WebRoutes";
import { useAppSelector } from "src/store/utils/types";
import { tokenSelector } from "src/store/reducers/auth";
import { lazy, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Departments,
  MainPermissions,
  MarketingSubDep,
  Sphere,
} from "src/utils/types";
import { permissionSelector } from "src/store/reducers/sidebar";
import DepartmentStat from "src/pages/StatsMarketing/DepartmentStat";
import MarketingStatCategory from "src/pages/StatsMarketing/StatCategory";
import Suspend from "./components/Suspend";
import TgRoutes from "./components/TgRoutes";

const ControlPanel = lazy(() => import("src/pages/ControlPanel"));
const TgRating = lazy(() => import("src/pages/TgRating"));
const RequestsStaff = lazy(() => import("src/pages/RequestsStaff"));
const AddStaffOrder = lazy(() => import("src/pages/AddStaffRequest"));
const LogysticsLogs = lazy(() => import("src/pages/LogysticsLogs"));
const RequestsLogystics = lazy(() => import("src/pages/RequestsLogystics"));
const CreateLogRequests = lazy(() => import("src/pages/CreateLogRequests"));
const ShowLogRequests = lazy(() => import("src/pages/ShowLogRequests"));
const Masters = lazy(() => import("src/pages/Masters"));
const ShowConsumption = lazy(() => import("src/pages/ShowConsumption"));
const Logs = lazy(() => import("src/pages/LogsScreen"));
const ConsumptionStat = lazy(
  () => import("src/pages/StatisticsApc/ConsumptionStat")
);
const Login = lazy(() => import("src/pages/Login"));
const EditClient = lazy(() => import("src/pages/EditClient"));
const TelegramAddProduct = lazy(() => import("src/pages/TelegramAddProduct"));
const CreateITRequest = lazy(() => import("src/pages/CreateITRequest"));
const CreateApcRequest = lazy(() => import("src/pages/CreateApcRequest"));
const ShowRequestApc = lazy(() => import("src/pages/ShowRequestApc"));
const ShowITRequest = lazy(() => import("src/pages/ShowITRequest"));
const RequestsApc = lazy(() => import("src/pages/RequestsApc"));
const ShowMarketingRequest = lazy(
  () => import("src/pages/ShowMarketingRequest")
);
const RequestsMarketing = lazy(() => import("src/pages/RequestsMarketing"));
const AddMarketingRequest = lazy(() => import("src/pages/AddMarketingRequest"));
const RequestsIT = lazy(() => import("src/pages/RequestsIT"));
// const AddInventoryRequest = lazy(() => import("src/pages/AddInventoryRequest"));
const YandexMap = lazy(() => import("src/pages/Map"));
const StatisticsApc = lazy(() => import("src/pages/StatisticsApc"));
const StatsMarketing = lazy(() => import("src/pages/StatsMarketing"));
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
// const ShowRemainsInStock = lazy(() => import("src/pages/ShowRemainsInStock"));
const CategoryStat = lazy(() => import("src/pages/StatisticsApc/CategoryStat"));
const FillialStat = lazy(() => import("src/pages/StatisticsApc/FillialStat"));
const BrigadaCategStat = lazy(
  () => import("src/pages/StatisticsApc/BrigadaCategStat")
);
const BrigadaStat = lazy(() => import("src/pages/StatisticsApc/BrigadaStat"));

dayjs.locale("ru");

const routes = [
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
        edit={MainPermissions.edit_fabric_requests}
        attaching={MainPermissions.fabric_req_attach_master}
      />
    ),
    path: "/requests-apc/:id",
    screen: MainPermissions.edit_fabric_requests,
  },
  {
    element: (
      <ShowITRequest
        edit={MainPermissions.edit_fabric_requests}
        attaching={MainPermissions.fabric_req_attach_master}
      />
    ),
    path: "/requests-it/:id",
    screen: MainPermissions.edit_it_requests,
  },
  {
    element: (
      <ShowRequestApc
        edit={MainPermissions.edit_request_apc}
        attaching={MainPermissions.request_ettach}
      />
    ),
    path: "/requests-apc/:id",
    screen: MainPermissions.edit_request_apc,
  },
  {
    element: <RequestsIT />,
    path: "/requests-it",
    screen: MainPermissions.get_it_requests,
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
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[6]}/:id`,
    screen: MainPermissions.edit_nostandard_requests,
  },
  {
    element: <ShowMarketingRequest />,
    path: `/marketing-${MarketingSubDep[7]}/:id`,
    screen: MainPermissions.edit_stock_env_requests,
  },
  {
    element: <Logs />,
    path: `/request/logs/:id`,
    screen: MainPermissions.edit_design_request,
  },
  {
    element: <RequestsMarketing />,
    path: `/marketing-${MarketingSubDep[1]}`,
    screen: MainPermissions.get_design_request,
  },
  {
    element: <RequestsMarketing />,
    path: `/marketing-${MarketingSubDep[2]}`,
    screen: MainPermissions.get_locmar_requests,
  },
  {
    element: <RequestsMarketing />,
    path: `/marketing-${MarketingSubDep[3]}`,
    screen: MainPermissions.get_promo_requests,
  },
  {
    element: <RequestsMarketing />,
    path: `/marketing-${MarketingSubDep[4]}`,
    screen: MainPermissions.get_pos_requests,
  },
  {
    element: <RequestsMarketing />,
    path: `/marketing-${MarketingSubDep[5]}`,
    screen: MainPermissions.get_complect_requests,
  },
  {
    element: <RequestsMarketing />,
    path: `/marketing-${MarketingSubDep[6]}`,
    screen: MainPermissions.get_nostandard_requests,
  },
  {
    element: <RequestsMarketing />,
    path: `/marketing-${MarketingSubDep[7]}`,
    screen: MainPermissions.get_stock_env_requests,
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
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[6]}/add`,
    screen: MainPermissions.get_nostandard_requests,
  },
  {
    element: <AddMarketingRequest />,
    path: `/marketing-${MarketingSubDep[7]}/add`,
    screen: MainPermissions.get_stock_env_requests,
  },
  { element: <YandexMap />, path: "/map", screen: MainPermissions.get_map },
  {
    element: <StatisticsApc />,
    path: "/statistics",
    screen: MainPermissions.get_statistics,
  },
  {
    element: <StatisticsApc />,
    path: "/statistics-apc-fabric",
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
    path: `/categories-apc-retail`,
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
    path: `/categories-apc-fabric`,
    screen: MainPermissions.get_categ_fab,
  },
  {
    element: (
      <Categories
        add={MainPermissions.add_categ_it}
        edit={MainPermissions.edit_categ_it}
        dep={Departments.it}
      />
    ),
    path: `/categories-it`,
    screen: MainPermissions.get_categ_it,
  },
  {
    element: (
      <Categories
        add={MainPermissions.add_mark_category}
        edit={MainPermissions.edit_mark_category}
        dep={Departments.marketing}
      />
    ),
    path: `/categories-marketing`,
    screen: MainPermissions.get_mark_category,
  },
  {
    element: <ShowCategory dep={Departments.marketing} />,
    path: `/categories-marketing/:id`,
    screen: MainPermissions.edit_mark_category,
  },
  {
    element: (
      <ShowCategory dep={Departments.apc} sphere_status={Sphere.retail} />
    ),
    path: `/categories-apc-retail/:id`,
    screen: MainPermissions.edit_apc_category,
  },
  {
    element: (
      <ShowCategory dep={Departments.apc} sphere_status={Sphere.fabric} />
    ),
    path: `/categories-apc-fabric/:id`,
    screen: MainPermissions.edit_categ_fab,
  },
  {
    element: <ShowCategory dep={Departments.it} />,
    path: `/categories-it/:id`,
    screen: MainPermissions.edit_categ_it,
  },
  {
    element: <ShowCategory dep={Departments.marketing} />,
    path: `/categories-marketing/add`,
    screen: MainPermissions.add_mark_category,
  },
  {
    element: (
      <ShowCategory dep={Departments.apc} sphere_status={Sphere.retail} />
    ),
    path: `/categories-apc-retail/add`,
    screen: MainPermissions.add_apc_category,
  },
  {
    element: (
      <ShowCategory dep={Departments.apc} sphere_status={Sphere.fabric} />
    ),
    path: `/categories-apc-fabric/add`,
    screen: MainPermissions.add_categ_fab,
  },
  {
    element: <ShowCategory dep={Departments.it} />,
    path: `/categories-it/add`,
    screen: MainPermissions.add_categ_it,
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
  {
    element: <Masters />,
    path: "/masters/:dep/:sphere",
    screen: MainPermissions.get_brigadas,
  },
  {
    element: <Masters />,
    path: "/masters",
    screen: MainPermissions.get_master,
  },
  {
    element: <Masters />,
    path: "/masters-it",
    screen: MainPermissions.get_master_it,
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
    path: "/items-in-stock/:id",
    screen: MainPermissions.get_warehouse_retail,
  },

  {
    element: (
      <Categories
        add={MainPermissions.add_log_categs}
        edit={MainPermissions.edit_log_categs}
        dep={Departments.logystics}
      />
    ),
    path: `/categories-logystics`,
    screen: MainPermissions.get_log_categs,
  },
  {
    element: <ShowCategory dep={Departments.logystics} />,
    path: `/categories-logystics/:id`,
    screen: MainPermissions.edit_log_categs,
  },

  {
    element: <ShowCategory dep={Departments.logystics} />,
    path: `/categories-logystics/add`,
    screen: MainPermissions.add_log_categs,
  },
  {
    element: <ShowLogRequests />,
    path: "/requests-logystics/:id",
    screen: MainPermissions.edit_log_requests,
  },
  {
    element: <CreateLogRequests />,
    path: "/requests-logystics/add",
    screen: MainPermissions.add_log_requests,
  },
  {
    element: <LogysticsLogs />,
    path: "/requests-logystics/:id/logs",
    screen: MainPermissions.edit_log_requests,
  },
  {
    element: (
      <RequestsLogystics
        add={MainPermissions.add_log_requests}
        edit={MainPermissions.edit_log_requests}
      />
    ),
    path: "/requests-logystics",
    screen: MainPermissions.get_log_requests,
  },
  {
    element: <RequestsStaff />,
    path: "/requests-staff",
    screen: MainPermissions.get_staff_requests,
  },
  {
    element: <ShowLogRequests />,
    path: "/requests-staff/:id",
    screen: MainPermissions.edit_staff_requests,
  },
  {
    element: <AddStaffOrder />,
    path: "/requests-staff/add",
    screen: MainPermissions.add_staff_requests,
  },
];

const App = () => {
  const token = useAppSelector(tokenSelector);
  const permission = useAppSelector(permissionSelector);

  const renderScreen = useMemo(() => {
    if (!!permission && !!token)
      return routes.map((route) => {
        if (!!permission?.[route.screen])
          return (
            <Route
              key={route.path}
              element={<Suspend>{route.element}</Suspend>}
              path={route.path}
            />
          );
      });

    return null;
  }, [permission, routes, token]);

  return (
    <Routes>
      <Route path="/" element={<WebRooutes />}>
        <Route
          element={
            <Suspend>
              <Login />
            </Suspend>
          }
          path={"/login"}
        />
        <Route
          element={
            <Suspend>
              <ControlPanel />
            </Suspend>
          }
          path={"/home"}
        />
        <Route
          element={
            <Suspend>
              <ControlPanel />
            </Suspend>
          }
          path={"*"}
        />

        {permission?.[MainPermissions.get_statistics] && (
          <Route
            path="/statistics-apc-retail"
            element={
              <Suspend>
                <StatisticsApc />
              </Suspend>
            }
          >
            <Route
              index
              path="category"
              element={
                <Suspend>
                  <CategoryStat sphere_status={Sphere.retail} />
                </Suspend>
              }
            />
            <Route
              path="fillial"
              element={
                <Suspend>
                  <FillialStat sphere_status={Sphere.retail} />
                </Suspend>
              }
            />
            <Route
              path="brigada"
              element={
                <Suspend>
                  <BrigadaStat sphere_status={Sphere.retail} />
                </Suspend>
              }
            />
            <Route
              path="brigade_categ"
              element={
                <Suspend>
                  <BrigadaCategStat sphere_status={Sphere.retail} />
                </Suspend>
              }
            />
            <Route
              path="consumptions"
              element={
                <Suspend>
                  <ConsumptionStat sphere_status={Sphere.retail} />
                </Suspend>
              }
            />
            <Route
              path="consumptions/:id"
              element={
                <Suspend>
                  <ShowConsumption />
                </Suspend>
              }
            />
          </Route>
        )}
        {permission?.[MainPermissions.get_statistics] && (
          <Route
            path="/statistics-apc-fabric"
            element={
              <Suspend>
                <StatisticsApc />
              </Suspend>
            }
          >
            <Route
              index
              path="category"
              element={
                <Suspend>
                  <CategoryStat sphere_status={Sphere.fabric} />
                </Suspend>
              }
            />
            <Route
              path="fillial"
              element={
                <Suspend>
                  <FillialStat sphere_status={Sphere.fabric} />
                </Suspend>
              }
            />
            <Route
              path="brigada"
              element={
                <Suspend>
                  <BrigadaStat sphere_status={Sphere.fabric} />
                </Suspend>
              }
            />
            <Route
              path="brigade_categ"
              element={
                <Suspend>
                  <BrigadaCategStat sphere_status={Sphere.fabric} />
                </Suspend>
              }
            />
            <Route
              path="consumptions"
              element={
                <Suspend>
                  <ConsumptionStat sphere_status={Sphere.fabric} />
                </Suspend>
              }
            />
            <Route
              path="consumptions/:id"
              element={
                <Suspend>
                  <ShowConsumption />
                </Suspend>
              }
            />
          </Route>
        )}

        {permission?.[MainPermissions.get_statistics] && (
          <Route
            path="/statistics-marketing"
            element={
              <Suspend>
                <StatsMarketing />
              </Suspend>
            }
          >
            <Route
              index
              path="department"
              element={
                <Suspend>
                  <DepartmentStat />
                </Suspend>
              }
            />
            <Route
              path="category"
              element={
                <Suspend>
                  <MarketingStatCategory />
                </Suspend>
              }
            />
          </Route>
        )}
        {renderScreen}
      </Route>

      <Route path="/tg" element={<TgRoutes />}>
        <Route
          element={
            <Suspend>
              <TelegramAddProduct />
            </Suspend>
          }
          path={"add-product/:id"}
        />
        <Route
          element={
            <Suspend>
              <TgRating />
            </Suspend>
          }
          path={"order-rating/:id"}
        />
      </Route>
    </Routes>
  );
};

export default App;
