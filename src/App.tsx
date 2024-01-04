import { lazy, useMemo } from "react";
import dayjs from "dayjs";
import { Route, Routes } from "react-router-dom";
import "dayjs/locale/ru";
import "react-datepicker/dist/react-datepicker.css";

import WebRooutes from "./components/WebRoutes";
import { useAppSelector } from "@/store/utils/types";
import { tokenSelector } from "reducers/auth";
import {
  Departments,
  MainPermissions,
  MarketingSubDep,
  Sphere,
} from "@/utils/types";
import { permissionSelector } from "reducers/sidebar";
import DepartmentStat from "@/pages/StatsMarketing/DepartmentStat";
import MarketingStatCategory from "@/pages/StatsMarketing/StatCategory";
import Suspend from "./components/Suspend";
import TgRoutes from "./components/TgRoutes";

const ControlPanel = lazy(() => import("@/pages/ControlPanel"));
const TgRating = lazy(() => import("@/pages/TgRating"));
const RequestsStaff = lazy(() => import("@/pages/RequestsStaff"));
const AddStaffOrder = lazy(() => import("@/pages/AddStaffRequest"));
const LogysticsLogs = lazy(() => import("@/pages/LogysticsLogs"));
const RequestsLogystics = lazy(() => import("@/pages/RequestsLogystics"));
const CreateLogRequests = lazy(() => import("@/pages/CreateLogRequests"));
const ShowLogRequests = lazy(() => import("@/pages/ShowLogRequests"));
const Masters = lazy(() => import("@/pages/Masters"));
const ShowConsumption = lazy(() => import("@/pages/ShowConsumption"));
const Logs = lazy(() => import("@/pages/LogsScreen"));
const ConsumptionStat = lazy(
  () => import("@/pages/StatisticsApc/ConsumptionStat")
);
const Login = lazy(() => import("@/pages/Login"));
const CategoriesIT = lazy(() => import("@/pages/CategoriesIT"));
const CategoryProducts = lazy(() => import("@/pages/CategoryProducts"));
const EditAddCategoryProduct = lazy(
  () => import("@/pages/EditAddCategoryProduct")
);
const EditClient = lazy(() => import("@/pages/EditClient"));
const TelegramAddProduct = lazy(() => import("@/pages/TelegramAddProduct"));
const CreateITRequest = lazy(() => import("@/pages/CreateITRequest"));
const CreateApcRequest = lazy(() => import("@/pages/CreateApcRequest"));
const ShowRequestApc = lazy(() => import("@/pages/ShowRequestApc"));
const ShowITRequest = lazy(() => import("@/pages/ShowITRequest"));
const RequestsApc = lazy(() => import("@/pages/RequestsApc"));
const ShowMarketingRequest = lazy(() => import("@/pages/ShowMarketingRequest"));
const RequestsMarketing = lazy(() => import("@/pages/RequestsMarketing"));
const AddMarketingRequest = lazy(() => import("@/pages/AddMarketingRequest"));
const RequestsIT = lazy(() => import("@/pages/RequestsIT"));
const AddInventoryRequest = lazy(() => import("@/pages/AddInventoryRequest"));
const RequestsInventory = lazy(() => import("@/pages/RequestsInventory"));
const ShowRequestInventory = lazy(() => import("@/pages/ShowRequestInventory"));
const YandexMap = lazy(() => import("@/pages/Map"));
const StatisticsApc = lazy(() => import("@/pages/StatisticsApc"));
const StatsMarketing = lazy(() => import("@/pages/StatsMarketing"));
const Categories = lazy(() => import("@/pages/Categories"));
const EditAddCategory = lazy(() => import("@/pages/EditAddCategory"));
const EditAddRole = lazy(() => import("@/pages/EditAddRole"));
const Roles = lazy(() => import("@/pages/Roles"));
const ShowRole = lazy(() => import("@/pages/ShowRole"));
const EditAddUser = lazy(() => import("@/pages/EditAddUser"));
const Users = lazy(() => import("@/pages/Users"));
const CreateBrigades = lazy(() => import("@/pages/CreateBrigades"));
const Comments = lazy(() => import("@/pages/Comments"));
const ShowComment = lazy(() => import("@/pages/ShowComment"));
const Branches = lazy(() => import("@/pages/Branches"));
const EditAddBranch = lazy(() => import("@/pages/EditAddBranch"));
const LogysticCars = lazy(() => import("@/pages/LogysticCars"));
const EditAddLogCars = lazy(() => import("@/pages/EditAddLogCars"));
const EditAddClientsComments = lazy(
  () => import("@/pages/CreateClientsComments")
);
const ClientsComments = lazy(() => import("@/pages/ClientsComments"));
const RemainsInStock = lazy(() => import("@/pages/RemailnsInStock"));
const CategoryStat = lazy(() => import("@/pages/StatisticsApc/CategoryStat"));
const FillialStat = lazy(() => import("@/pages/StatisticsApc/FillialStat"));
const BrigadaCategStat = lazy(
  () => import("@/pages/StatisticsApc/BrigadaCategStat")
);
const BrigadaStat = lazy(() => import("@/pages/StatisticsApc/BrigadaStat"));

const EditProductInventory = lazy(() => import("@/pages/EditProductInventory"));
const ProductsInventory = lazy(() => import("@/pages/ProductsInventory"));

dayjs.locale("ru");

const routes = [
  {
    element: <CreateITRequest />,
    path: "/requests-it/:sphere/add",
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
    path: "/requests-it/:sphere/:id",
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
    path: "/requests-it/:sphere",
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
      <CategoriesIT
        add={MainPermissions.add_categ_it}
        edit={MainPermissions.edit_categ_it}
        dep={Departments.it}
      />
    ),
    path: `/categories-it/:sphere`,
    screen: MainPermissions.get_categ_it,
  },
  {
    element: <CategoryProducts />,
    path: `/categories-it/:sphere/:id/products`,
    screen: MainPermissions.get_categ_it,
  },
  {
    element: <EditAddCategoryProduct />,
    path: `/categories-it/:sphere/:id/add-product`,
    screen: MainPermissions.add_categ_it,
  },
  {
    element: <EditAddCategoryProduct />,
    path: `/categories-it/:sphere/:id/edit-product/:product_id`,
    screen: MainPermissions.edit_categ_it,
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
    element: <EditAddCategory dep={Departments.marketing} />,
    path: `/categories-marketing/:id`,
    screen: MainPermissions.edit_mark_category,
  },
  {
    element: (
      <EditAddCategory dep={Departments.apc} sphere_status={Sphere.retail} />
    ),
    path: `/categories-apc-retail/:id`,
    screen: MainPermissions.edit_apc_category,
  },
  {
    element: (
      <EditAddCategory dep={Departments.apc} sphere_status={Sphere.fabric} />
    ),
    path: `/categories-apc-fabric/:id`,
    screen: MainPermissions.edit_categ_fab,
  },
  {
    element: <EditAddCategory dep={Departments.it} />,
    path: `/categories-it/:sphere/:id`,
    screen: MainPermissions.edit_categ_it,
  },
  {
    element: <EditAddCategory dep={Departments.it} />,
    path: `/categories-it/:sphere/add`,
    screen: MainPermissions.edit_categ_it,
  },
  {
    element: (
      <EditAddCategory dep={Departments.apc} sphere_status={Sphere.retail} />
    ),
    path: `/categories-apc-retail/add`,
    screen: MainPermissions.add_apc_category,
  },
  {
    element: (
      <EditAddCategory dep={Departments.apc} sphere_status={Sphere.fabric} />
    ),
    path: `/categories-apc-fabric/add`,
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
  {
    element: <Masters />,
    path: "/masters",
    screen: MainPermissions.get_master,
  },
  {
    element: <Masters />,
    path: "/brigades",
    screen: MainPermissions.get_master,
  },
  {
    element: <Masters />,
    path: "/masters-it",
    screen: MainPermissions.it_get_masters,
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
    path: "/masters-it/add",
    screen: MainPermissions.it_add_master,
  },
  {
    element: <CreateBrigades />,
    path: "/masters/:id",
    screen: MainPermissions.edit_master,
  },
  {
    element: <CreateBrigades />,
    path: "/masters-it/:id",
    screen: MainPermissions.it_edit_master,
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
    element: <EditAddCategory dep={Departments.logystics} />,
    path: `/categories-logystics/:id`,
    screen: MainPermissions.edit_log_categs,
  },

  {
    element: <EditAddCategory dep={Departments.logystics} />,
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

  // iniventory
  {
    element: <RequestsInventory />,
    path: "/requests-inventory",
    screen: MainPermissions.get_requests_inventory,
  },
  {
    element: <ShowRequestInventory />,
    path: "/requests-inventory/:id",
    screen: MainPermissions.edit_requests_inventory,
  },
  {
    element: <AddInventoryRequest />,
    path: "/requests-inventory/add",
    screen: MainPermissions.add_requests_inventory,
  },
  {
    element: (
      <Categories
        add={MainPermissions.add_category_inventory}
        edit={MainPermissions.edit_category_inventory}
        dep={Departments.inventory}
      />
    ),
    path: `/categories-inventory`,
    screen: MainPermissions.get_category_inventory,
  },

  {
    element: <EditAddCategory dep={Departments.inventory} />,
    path: `/categories-inventory/:id`,
    screen: MainPermissions.edit_category_inventory,
  },
  {
    element: <EditAddCategory dep={Departments.inventory} />,
    path: `/categories-inventory/add`,
    screen: MainPermissions.add_category_inventory,
  },
  {
    element: <EditProductInventory />,
    path: `/products-inventory/:id`,
    screen: MainPermissions.edit_product_inventory,
  },
  {
    element: <ProductsInventory />,
    path: `/products-inventory`,
    screen: MainPermissions.get_product_inventory,
  },

  // ===========================================================
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
  {
    element: <LogysticCars />,
    path: "/logystics-cars",
    screen: MainPermissions.get_log_requests,
  },
  {
    element: <EditAddLogCars />,
    path: "/logystics-cars/add",
    screen: MainPermissions.add_log_requests,
  },
  {
    element: <EditAddLogCars />,
    path: "/logystics-cars/:id",
    screen: MainPermissions.edit_log_requests,
  },

  {
    element: <ClientsComments />,
    path: "/client-comments",
    screen: MainPermissions.get_client_comment,
  },
  {
    element: <ShowComment />,
    path: "/client-comments/:id",
    screen: MainPermissions.edit_client_comment,
  },
  {
    element: <EditAddClientsComments />,
    path: "/client-comments/add",
    screen: MainPermissions.add_client_comment,
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
