import { lazy, useMemo } from "react";
import dayjs from "dayjs";
import { Route, Routes } from "react-router-dom";
import "dayjs/locale/ru";
import "react-datepicker/dist/react-datepicker.css";

import WebRooutes from "./components/WebRoutes";
import { useAppSelector } from "@/store/utils/types";
import { tokenSelector } from "reducers/auth";
import { Sphere } from "@/utils/types";
import { permissionSelector } from "reducers/sidebar";
import Suspend from "./components/Suspend";
import TgRoutes from "./components/TgRoutes";
import {
  APCStatRoutes,
  ITStatsRoutes,
  InventoryStatsRoutes,
  MarketingStatsRoutes,
  routes,
} from "./utils/routeObjs";
import { MainPermissions } from "@/utils/permissions";

const HrSuccess = lazy(() => import("./webApp/pages/hr-registration/success"));
const HRSelectTime = lazy(
  () => import("./webApp/pages/hr-registration/select-time")
);
const HrSignRegistery = lazy(
  () => import("./webApp/pages/hr-registration/registery")
);
const HrRegisteryMain = lazy(
  () => import("./webApp/pages/hr-registration/main")
);
const HrChooseDirection = lazy(
  () => import("./webApp/pages/hr-registration/choose-direction")
);
const HrOrders = lazy(() => import("./webApp/pages/hr-registration/orders"));
const ShowHrOrder = lazy(
  () => import("./webApp/pages/hr-registration/orders/show-order")
);
const FreezerCart = lazy(() => import("./webApp/pages/freezer/cart"));
// const SetTools = lazy(() => import("./webApp/pages/freezer/set-tools"));
const ShowFreezerOrder = lazy(
  () => import("./webApp/pages/freezer/show-order")
);
const HrRegisterty = lazy(() => import("./webApp/layouts/hr-registery"));
const MainFreezerRoute = lazy(() => import("./webApp/layouts/freezer"));
const FreezerProducts = lazy(() => import("./webApp/pages/freezer/products"));
const ControlPanel = lazy(() => import("@/pages/ControlPanel"));
const TgRating = lazy(() => import("@/webApp/pages/TgRating"));

const ShowConsumption = lazy(() => import("@/pages/ShowConsumption"));
const ConsumptionStat = lazy(() => import("@/pages/StatsApc/ConsumptionStat"));
const Login = lazy(() => import("@/pages/Login"));

const BaseStatsBlock = lazy(() => import("./components/BaseStatsBlock"));

const MarketingStatCategory = lazy(
  () => import("@/pages/StatsMarketing/StatCategory")
);
const ServiceStatsMarketing = lazy(
  () => import("@/pages/StatsMarketing/ServiceStats")
);
const ServiceStatsIT = lazy(() => import("@/pages/StatsIT/ServiceStatsIT"));
const DepartmentStat = lazy(
  () => import("@/pages/StatsMarketing/DepartmentStat")
);

const CategoryStat = lazy(() => import("@/pages/StatsApc/CategoryStat"));
const FillialStat = lazy(() => import("@/pages/StatsApc/FillialStat"));
const BrigadaCategStat = lazy(
  () => import("@/pages/StatsApc/BrigadaCategStat")
);
const BrigadaStat = lazy(() => import("@/pages/StatsApc/BrigadaStat"));
const InventoryServiceStats = lazy(
  () => import("@/pages/StatsInventory/ServiceStats")
);
const ServiceStatsApc = lazy(() => import("@/pages/StatsApc/ServiceStats"));

const TelegramAddProduct = lazy(
  () => import("@/webApp/pages/TelegramAddProduct")
);
const AddInventoryRequest = lazy(() => import("@/pages/AddInventoryRequest"));
const InvSelectOrderType = lazy(
  () => import("@/webApp/pages/InvSelectOrderType")
);
const InventoryLayout = lazy(() => import("./webApp/layouts/inventory"));
const InvArchieve = lazy(() => import("@/webApp/pages/InvArchieve"));
const SelectBranchAndCateg = lazy(
  () => import("@/webApp/pages/SelectBranchAndCateg")
);
const ChooseTools = lazy(() => import("@/webApp/pages/ChooseTools"));
const InvCart = lazy(() => import("@/webApp/pages/InvCart"));
const InvSuccess = lazy(() => import("@/webApp/pages/InvSuccess"));
const UnAuthorized = lazy(() => import("@/webApp/pages/UnAuthorized"));

dayjs.locale("ru");

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
      <Route
        element={
          <Suspend>
            <Login />
          </Suspend>
        }
        path={"/login"}
      />
      <Route path="/" element={<WebRooutes />}>
        <Route
          index
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
        {renderScreen}

        {permission?.[MainPermissions.stats_apc_retail] && (
          <Route
            path="/statistics-apc-retail"
            element={
              <Suspend>
                <BaseStatsBlock
                  routesArr={APCStatRoutes}
                  title={"Статистика"}
                />
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
            <Route
              path="service_level"
              element={
                <Suspend>
                  <ServiceStatsApc />
                </Suspend>
              }
            />
          </Route>
        )}
        {permission?.[MainPermissions.stats_apc_fabric] && (
          <Route
            path="/statistics-apc-fabric"
            element={
              <Suspend>
                <BaseStatsBlock
                  routesArr={APCStatRoutes}
                  title={"Статистика"}
                />
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
            <Route
              path="service_level"
              element={
                <Suspend>
                  <ServiceStatsApc />
                </Suspend>
              }
            />
          </Route>
        )}

        {permission?.[MainPermissions.it_statistics] && (
          <Route
            path="/statistics-it"
            element={
              <Suspend>
                <BaseStatsBlock
                  routesArr={ITStatsRoutes}
                  title={"Статистика IT"}
                />
              </Suspend>
            }
          >
            <Route
              index
              path="service_level"
              element={
                <Suspend>
                  <ServiceStatsIT />
                </Suspend>
              }
            />
          </Route>
        )}

        {permission?.[MainPermissions.stats_marketing] && (
          <Route
            path="/statistics-marketing"
            element={
              <Suspend>
                <BaseStatsBlock
                  routesArr={MarketingStatsRoutes}
                  title={"Статистика Маркетинг"}
                />
              </Suspend>
            }
          >
            <Route
              index
              path="service_level"
              element={
                <Suspend>
                  <ServiceStatsMarketing />
                </Suspend>
              }
            />
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
        {permission?.[MainPermissions.inventory_reports_retail] && (
          <Route
            path="/statistics-inventory-retail"
            element={
              <Suspend>
                <BaseStatsBlock
                  routesArr={InventoryStatsRoutes}
                  title={"Статистика Инвентарь"}
                />
              </Suspend>
            }
          >
            <Route
              index
              path="service_level"
              element={
                <Suspend>
                  <InventoryServiceStats />
                </Suspend>
              }
            />
          </Route>
        )}
        {permission?.[MainPermissions.reports_inv_factory] && (
          <Route
            path="/statistics-inventory-factory"
            element={
              <Suspend>
                <BaseStatsBlock
                  routesArr={InventoryStatsRoutes}
                  title={"Статистика Инвентарь"}
                />
              </Suspend>
            }
          >
            <Route
              index
              path="service_level"
              element={
                <Suspend>
                  <InventoryServiceStats factory />
                </Suspend>
              }
            />
          </Route>
        )}
      </Route>

      <Route path="/tg" element={<TgRoutes />}>
        <Route
          element={
            <Suspend>
              <UnAuthorized />
            </Suspend>
          }
          path={"unauthorized"}
        />
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
        <Route
          element={
            <Suspend>
              <AddInventoryRequest />
            </Suspend>
          }
          path={"inventory-request-add"}
        />

        <Route
          element={
            <Suspend>
              <InventoryLayout />
            </Suspend>
          }
          path={"inventory-request"}
        >
          <Route
            element={
              <Suspend>
                <InvSelectOrderType />
              </Suspend>
            }
            path={"type"}
          />
          <Route
            element={
              <Suspend>
                <InvArchieve />
              </Suspend>
            }
            path={"archieve"}
          />
          <Route
            element={
              <Suspend>
                <SelectBranchAndCateg />
              </Suspend>
            }
            path={"add-order"}
          />
          <Route
            element={
              <Suspend>
                <ChooseTools />
              </Suspend>
            }
            path={"tool/:id"}
          />
          <Route
            element={
              <Suspend>
                <InvCart />
              </Suspend>
            }
            path={"cart"}
          />
          <Route
            element={
              <Suspend>
                <InvSuccess />
              </Suspend>
            }
            path={"success/:id"}
          />
        </Route>

        <Route
          element={
            <Suspend>
              <MainFreezerRoute />
            </Suspend>
          }
          path={"collector"}
        >
          <Route
            element={
              <Suspend>
                <FreezerProducts />
              </Suspend>
            }
            path={"products"}
          />
          <Route
            element={
              <Suspend>
                <FreezerProducts freezer />
              </Suspend>
            }
            path={"set-tools"}
          />
          <Route
            element={
              <Suspend>
                <FreezerCart />
              </Suspend>
            }
            path={"cart"}
          />
          <Route
            element={
              <Suspend>
                <ShowFreezerOrder />
              </Suspend>
            }
            path={"show-order/:id"}
          />
          <Route
            element={
              <Suspend>
                <InvSuccess freezer />
              </Suspend>
            }
            path={"success/:id"}
          />
        </Route>

        <Route
          element={
            <Suspend>
              <HrRegisterty />
            </Suspend>
          }
          path={"hr-registery"}
        >
          <Route
            element={
              <Suspend>
                <HrRegisteryMain />
              </Suspend>
            }
            path={"main"}
          />
          <Route
            element={
              <Suspend>
                <HrOrders />
              </Suspend>
            }
            path={"orders"}
          />
          <Route
            element={
              <Suspend>
                <ShowHrOrder />
              </Suspend>
            }
            path={"orders/:id"}
          />
          <Route
            element={
              <Suspend>
                <HrChooseDirection />
              </Suspend>
            }
            path={"choose-direction"}
          />
          <Route
            element={
              <Suspend>
                <HrSignRegistery />
              </Suspend>
            }
            path={"registery"}
          />
          <Route
            element={
              <Suspend>
                <HRSelectTime />
              </Suspend>
            }
            path={"select-time"}
          />
          <Route
            element={
              <Suspend>
                <HrSuccess />
              </Suspend>
            }
            path={"success/:id"}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
