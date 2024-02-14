import { lazy } from "react";
import { HRRequestTypes } from "./helpers";
import { stockStores } from "./keys";
import {
  Departments,
  MainPermissions,
  MarketingSubDep,
  SidebarType,
  Sphere,
} from "./types";

const RequestsStaff = lazy(() => import("@/pages/RequestsStaff"));
const AddStaffOrder = lazy(() => import("@/pages/AddStaffRequest"));
const ShowRequestStaff = lazy(() => import("@/pages/ShowRequestStaff"));
const LogysticsLogs = lazy(() => import("@/pages/LogysticsLogs"));
const RequestsLogystics = lazy(() => import("@/pages/RequestsLogystics"));
const CreateLogRequests = lazy(() => import("@/pages/CreateLogRequests"));
const ShowLogRequests = lazy(() => import("@/pages/ShowLogRequests"));
const Masters = lazy(() => import("@/pages/Masters"));
const Logs = lazy(() => import("@/pages/LogsScreen"));
const CategoriesIT = lazy(() => import("@/pages/CategoriesIT"));
const CategoryProducts = lazy(() => import("@/pages/CategoryProducts"));
const EditAddCategoryProduct = lazy(
  () => import("@/pages/EditAddCategoryProduct")
);
const EditClient = lazy(() => import("@/pages/EditClient"));
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

const Categories = lazy(() => import("@/pages/Categories"));
const EditAddCategory = lazy(() => import("@/pages/EditAddCategory"));
const EditAddRole = lazy(() => import("@/pages/EditAddRole"));
const Roles = lazy(() => import("@/pages/Roles"));
const ShowRole = lazy(() => import("@/pages/ShowRole"));
const EditAddUser = lazy(() => import("@/pages/EditAddUser"));
const Users = lazy(() => import("@/pages/Users"));
const EditAddMasters = lazy(() => import("@/pages/EditAddMasters"));
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

const EditInventoryProd = lazy(() => import("@/pages/EditInventoryProd"));
const InventoryRemainsMins = lazy(() => import("@/pages/InventoryRemainsMins"));
const InventoryRemains = lazy(() => import("@/pages/InventoryRemains"));
const ShowInventoryTool = lazy(() => import("@/pages/ShowInventoryTool"));
const InventoryOrderedTools = lazy(
  () => import("@/pages/InventoryOrderedTools")
);
const EditAddFAQQuestions = lazy(() => import("@/pages/EditAddFAQQuestions"));
const HRQuestions = lazy(() => import("@/pages/HRQuestions"));
const EditHRRequests = lazy(() => import("@/pages/EditHRRequests"));
const HRRequests = lazy(() => import("@/pages/HRRequests"));

const RequestsCCTV = lazy(() => import("@/pages/RequestsCCTV"));
const CreateCCTVRequest = lazy(() => import("@/pages/CreateCCTVRequest"));
const ShowCCTVRequests = lazy(() => import("@/pages/ShowCCTVRequests"));

export const sidebarRoutes: SidebarType[] = [
  {
    name: "Тепловая карта",
    url: "/map",
    icon: "/assets/icons/map.svg",
    screen: MainPermissions.get_map,
  },
  {
    name: "АРС розница",
    icon: "/assets/icons/apc.svg",
    screen: MainPermissions.get_requests_apc,
    department: Departments.apc,
    sphere_status: Sphere.retail,
    subroutes: [
      {
        name: "requests_apc_retail",
        url: "/requests-apc-retail",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_requests_apc,
      },
      {
        name: "Бригады",
        url: "/brigades",
        icon: "/assets/icons/brigades.svg",
        screen: MainPermissions.get_brigadas,
      },
      {
        name: "Остатки на складах",
        url: "/items-in-stock",
        icon: "/assets/icons/remains-in-stock.svg",
        param: `/${stockStores.retail}`,
        screen: MainPermissions.get_warehouse_retail,
      },
      {
        name: "Категории",
        url: `/categories-apc-retail`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_apc_category,
      },
      {
        name: "Статистика",
        url: "/statistics-apc-retail",
        param: "/category",
        icon: "/assets/icons/statistics.svg",
        screen: MainPermissions.stats_apc_retail,
      },
    ],
  },
  {
    name: "АРС фабрика",
    icon: "/assets/icons/apc.svg",
    screen: MainPermissions.get_fabric_requests,
    department: Departments.apc,
    sphere_status: Sphere.fabric,
    subroutes: [
      {
        name: "Заявки на APC фабрика",
        url: "/requests-apc-fabric",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_fabric_requests,
      },
      {
        name: "Мастера",
        url: "/masters",
        icon: "/assets/icons/brigades.svg",
        screen: MainPermissions.get_master,
      },
      {
        name: "Категории",
        url: `/categories-apc-fabric`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_categ_fab,
      },

      {
        name: "Остатки на складах",
        url: "/items-in-stock",
        icon: "/assets/icons/remains-in-stock.svg",
        param: `/${stockStores.fabric}`,
        screen: MainPermissions.get_warehouse_fabric,
      },
      {
        name: "Статистика",
        url: "/statistics-apc-fabric",
        icon: "/assets/icons/statistics.svg",
        param: "/category",
        screen: MainPermissions.stats_apc_fabric,
      },
    ],
  },

  {
    name: "IT",
    icon: "/assets/icons/it.svg",
    screen: MainPermissions.get_it_requests,
    department: Departments.it,
    subroutes: [
      // {
      //   name: "Заявки Закуп",
      //   url: `/requests-it/${Sphere.purchase}`,
      //   icon: "/assets/icons/subOrder.svg",
      //   screen: MainPermissions.get_it_requests,
      // },
      {
        name: "requests", // Поддержка
        url: `/requests-it/${Sphere.fix}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_it_requests,
      },
      {
        name: "ИТ специалисты",
        url: "/masters-it",
        icon: "/assets/icons/users.svg",
        screen: MainPermissions.it_get_masters,
      },
      // {
      //   name: "Категории(Закуп)",
      //   url: `/categories-it/${Sphere.purchase}`,
      //   icon: "/assets/icons/categories.svg",
      //   screen: MainPermissions.get_categ_it,
      // },
      {
        name: "Категории", // Поддержка
        url: `/categories-it/${Sphere.fix}`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_categ_it,
      },

      // {
      //   name: "Остатки на складах",
      //   url: "/items-in-stock-it",
      //   icon: "/assets/icons/remains-in-stock.svg",
      //   screen: MainPermissions.it_remains_in_stock,
      // },
      // {
      //   name: "Статистика",
      //   url: "/statistics-it",
      //   icon: "/assets/icons/statistics.svg",
      //   // param: "/category",
      //   screen: MainPermissions.it_statistics,
      // },
    ],
  },

  {
    name: "Инвентарь",
    icon: "/assets/icons/inventary.svg",
    department: Departments.inventory,
    screen: MainPermissions.get_requests_inventory,
    subroutes: [
      {
        name: "requests",
        url: "/requests-inventory",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_requests_inventory,
      },
      {
        name: "Инвентарь / Товары",
        url: "/products-ierarch",
        icon: "/assets/icons/products.svg",
        screen: MainPermissions.get_product_inventory,
      },
      {
        name: "Заявки на закуп",
        url: "/order-products-inventory",
        icon: "/assets/icons/products.svg",
        screen: MainPermissions.get_inventory_purchase_prods,
      },
      {
        name: "Статистика",
        url: "/statistics-inventory",
        param: "/service_level",
        icon: "/assets/icons/statistics.svg",
        screen: MainPermissions.inventory_reports,
      },
    ],
  },
  {
    name: "Маркетинг",
    icon: "/assets/icons/marketing.svg",
    screen: MainPermissions.get_design_request,
    department: Departments.marketing,
    subroutes: [
      {
        name: "Все Заявки",
        url: "/marketing-all-requests",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.marketing_all_requests,
      },
      {
        name: "Проектная работа для дизайнеров",
        url: `/marketing-${MarketingSubDep[1]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_design_request,
      },
      {
        name: "Локальный маркетинг",
        url: `/marketing-${MarketingSubDep[2]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_locmar_requests,
      },
      {
        name: "Промо-продукция",
        url: `/marketing-${MarketingSubDep[3]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_promo_requests,
      },
      {
        name: "POS-Материалы",
        url: `/marketing-${MarketingSubDep[4]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_pos_requests,
      },
      {
        name: "Комплекты",
        url: `/marketing-${MarketingSubDep[5]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_complect_requests,
      },
      {
        name: "Для Тер.Менеджеров",
        url: `/marketing-${MarketingSubDep[6]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_nostandard_requests,
      },
      {
        name: "Внешний вид филиала",
        url: `/marketing-${MarketingSubDep[7]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_stock_env_requests,
      },
      {
        name: "Категории",
        url: `/categories-marketing`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_mark_category,
      },
      {
        name: "Статистика",
        url: "/statistics-marketing",
        param: "/service_level",
        icon: "/assets/icons/statistics.svg",
        screen: MainPermissions.stats_marketing,
      },
    ],
  },
  {
    name: "Запрос машин",
    icon: "/assets/icons/logystics.svg",
    screen: MainPermissions.get_log_requests,
    department: Departments.logystics,
    subroutes: [
      {
        name: "Запрос машин",
        url: "/requests-logystics",
        icon: "/assets/icons/logystics.svg",
        screen: MainPermissions.get_log_requests,
      },
      {
        name: "Категории",
        url: `/categories-logystics`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_log_categs,
      },
      {
        name: "Грузовики",
        url: `/logystics-cars`,
        icon: "/assets/icons/truck.svg",
        screen: MainPermissions.get_log_requests,
      },
    ],
  },
  {
    name: "HR Заявки",
    icon: "/assets/icons/comments.svg",
    screen: MainPermissions.get_faq_requests,
    subroutes: [
      {
        name: "Вопросы и ответы",
        url: "/faq",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_faq,
      },
      {
        name: "Предложении 🧠",
        url: "/hr-offers",
        icon: "/assets/icons/comments.svg",
        screen: MainPermissions.get_faq_requests,
        param: `?sphere=${HRRequestTypes.offers}`,
      },
      {
        name: "Возражении 📝",
        url: "/hr-objections",
        icon: "/assets/icons/comments.svg",
        screen: MainPermissions.get_faq_requests,
        param: `?sphere=${HRRequestTypes.objections}`,
      },
      {
        name: "Заданные вопросы ❔",
        url: "/hr-asked-questions",
        icon: "/assets/icons/comments.svg",
        screen: MainPermissions.get_faq_requests,
        param: `?sphere=${HRRequestTypes.asked_questions}`,
      },
    ],
  },
  {
    name: "Видеонаблюдение",
    icon: "/assets/icons/camera.svg",
    screen: MainPermissions.get_requests_cctv,
    department: Departments.cctv,
    subroutes: [
      {
        name: "requests",
        url: "/requests-cctv",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_requests_cctv,
      },
      {
        name: "Категории",
        url: `/categories-cctv`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_cetagories_cctv,
      },
    ],
  },
  {
    name: "Заявки на еду",
    url: "/requests-staff",
    icon: "/assets/icons/staff.svg",
    screen: MainPermissions.get_staff_requests,
    department: Departments.staff,
  },
  {
    name: "Пользователи",
    url: "/users",
    icon: "/assets/icons/users.svg",
    screen: MainPermissions.get_users,
  },
  {
    name: "Клиенты",
    url: "/clients",
    icon: "/assets/icons/clients.svg",
    screen: MainPermissions.get_clients,
    param: "?client=true",
  },
  {
    name: "Роли",
    url: "/roles",
    icon: "/assets/icons/roles.svg",
    screen: MainPermissions.get_roles,
  },
  {
    name: "Отзывы",
    url: "/comments",
    icon: "/assets/icons/comments.svg",
    screen: MainPermissions.get_comments_list,
  },
  {
    name: "Отзывы гостей",
    url: "/client-comments",
    icon: "/assets/icons/clientComment.svg",
    screen: MainPermissions.get_client_comment,
  },
  {
    name: "Настройки",
    icon: "/assets/icons/settings.svg",
    screen: MainPermissions.get_fillials_list,
    subroutes: [
      {
        name: "Филиалы",
        url: "/branches",
        icon: "/assets/icons/branch.svg",
        screen: MainPermissions.get_fillials_list,
      },
    ],
  },
];

export const routes = [
  {
    element: <CreateITRequest />,
    path: "/requests-it/:sphere/add",
    screen: MainPermissions.add_it_requests,
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
        addExp={MainPermissions.add_expen_fab}
        edit={MainPermissions.edit_fabric_requests}
        attaching={MainPermissions.fabric_req_attach_master}
      />
    ),
    path: "/requests-apc-fabric/:id",
    screen: MainPermissions.edit_fabric_requests,
  },
  {
    element: (
      <ShowITRequest
        edit={MainPermissions.edit_it_requests}
        attaching={MainPermissions.edit_it_requests}
      />
    ),
    path: "/requests-it/:sphere/:id",
    screen: MainPermissions.edit_it_requests,
  },
  {
    element: (
      <ShowRequestApc
        addExp={MainPermissions.request_add_expanditure}
        edit={MainPermissions.edit_request_apc}
        attaching={MainPermissions.request_ettach}
      />
    ),
    path: "/requests-apc-retail/:id",
    screen: MainPermissions.edit_request_apc,
  },
  {
    element: <ShowRequestApc />,
    path: "/requests-apc/:id",
    screen: MainPermissions.stats_apc_retail,
  },
  {
    element: <ShowRequestApc />,
    path: "/requests-apc/:id",
    screen: MainPermissions.stats_apc_fabric,
  },
  {
    element: <RequestsIT />,
    path: "/requests-it/:sphere",
    screen: MainPermissions.get_it_requests,
  },
  {
    element: (
      <RequestsApc
        sphere_status={Sphere.retail}
        addExp={MainPermissions.request_add_expanditure}
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
        sphere_status={Sphere.fabric}
        addExp={MainPermissions.add_expen_fab}
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
    element: <ShowMarketingRequest />,
    path: `/marketing-all-requests/:id`,
    screen: MainPermissions.marketing_all_requests,
  },
  {
    element: (
      <RequestsMarketing
        title={"Заявки Маркетинг"}
        edit={MainPermissions.marketing_all_requests}
      />
    ),
    path: "/marketing-all-requests",
    screen: MainPermissions.marketing_all_requests,
  },
  {
    element: <Logs />,
    path: "/request/logs/:id",
    screen: MainPermissions.edit_design_request,
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
        title="Локальный маркетинг"
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
        title="Промо-продукция"
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
        title="POS-Материалы"
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
        title="Комплекты"
        sub_id={MarketingSubDep.complects}
      />
    ),
    path: `/marketing-${MarketingSubDep[5]}`,
    screen: MainPermissions.get_complect_requests,
  },
  {
    element: (
      <RequestsMarketing
        add={MainPermissions.add_nostandard_requests}
        edit={MainPermissions.edit_nostandard_requests}
        title="Для Тер.Менеджеров"
        sub_id={MarketingSubDep.nonstandartAdv}
      />
    ),
    path: `/marketing-${MarketingSubDep[6]}`,
    screen: MainPermissions.get_nostandard_requests,
  },
  {
    element: (
      <RequestsMarketing
        add={MainPermissions.add_stock_env_requests}
        edit={MainPermissions.edit_stock_env_requests}
        title="Внешний вид филиала"
        sub_id={MarketingSubDep.branchEnv}
      />
    ),
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
  // {
  //   element: <StatisticsApc />,
  //   path: "/statistics",
  //   screen: MainPermissions.stats_apc_retail,
  // },
  // {
  //   element: <StatisticsApc />,
  //   path: "/statistics-apc-fabric",
  //   screen: MainPermissions.stats_apc_fabric,
  // },
  {
    element: (
      <Categories
        add={MainPermissions.add_apc_category}
        edit={MainPermissions.edit_apc_category}
        sphere_status={Sphere.retail}
        dep={Departments.apc}
      />
    ),
    path: "/categories-apc-retail",
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
    path: "/categories-apc-fabric",
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
    path: "/categories-it/:sphere",
    screen: MainPermissions.get_categ_it,
  },
  {
    element: <CategoryProducts />,
    path: "/categories-it/:sphere/:id/products",
    screen: MainPermissions.get_categ_it,
  },
  {
    element: <EditAddCategoryProduct />,
    path: "/categories-it/:sphere/:id/add-product",
    screen: MainPermissions.add_categ_it,
  },
  {
    element: <EditAddCategoryProduct />,
    path: "/categories-it/:sphere/:id/edit-product/:product_id",
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
    path: "/categories-marketing",
    screen: MainPermissions.get_mark_category,
  },
  {
    element: <EditAddCategory dep={Departments.marketing} />,
    path: "/categories-marketing/:id",
    screen: MainPermissions.edit_mark_category,
  },
  {
    element: <EditAddCategory dep={Departments.marketing} />,
    path: "/categories-marketing/add",
    screen: MainPermissions.add_mark_category,
  },
  {
    element: (
      <EditAddCategory dep={Departments.apc} sphere_status={Sphere.retail} />
    ),
    path: "/categories-apc-retail/:id",
    screen: MainPermissions.edit_apc_category,
  },
  {
    element: (
      <EditAddCategory dep={Departments.apc} sphere_status={Sphere.fabric} />
    ),
    path: "/categories-apc-fabric/:id",
    screen: MainPermissions.edit_categ_fab,
  },
  {
    element: <EditAddCategory dep={Departments.it} />,
    path: "/categories-it/:sphere/:id",
    screen: MainPermissions.edit_categ_it,
  },
  {
    element: <EditAddCategory dep={Departments.it} />,
    path: "/categories-it/:sphere/add",
    screen: MainPermissions.edit_categ_it,
  },
  {
    element: (
      <EditAddCategory dep={Departments.apc} sphere_status={Sphere.retail} />
    ),
    path: "/categories-apc-retail/add",
    screen: MainPermissions.add_apc_category,
  },
  {
    element: (
      <EditAddCategory dep={Departments.apc} sphere_status={Sphere.fabric} />
    ),
    path: "/categories-apc-fabric/add",
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
    element: (
      <Masters
        dep={Departments.apc}
        sphere_status={Sphere.fabric}
        add={MainPermissions.add_master}
        edit={MainPermissions.edit_master}
      />
    ),
    path: "/masters",
    screen: MainPermissions.get_master,
  },
  {
    element: (
      <Masters
        dep={Departments.apc}
        sphere_status={Sphere.retail}
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
        dep={Departments.it}
        add={MainPermissions.it_add_master}
        edit={MainPermissions.it_edit_master}
      />
    ),
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
    element: <EditAddMasters />,
    path: "/masters/add",
    screen: MainPermissions.add_master,
  },
  {
    element: <EditAddMasters />,
    path: "/masters-it/add",
    screen: MainPermissions.it_add_master,
  },
  {
    element: <EditAddMasters />,
    path: "/masters/:id",
    screen: MainPermissions.edit_master,
  },
  {
    element: <EditAddMasters />,
    path: "/masters-it/:id",
    screen: MainPermissions.it_edit_master,
  },
  {
    element: <EditAddMasters />,
    path: "/brigades/add",
    screen: MainPermissions.add_brigada,
  },
  {
    element: <EditAddMasters />,
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
    path: "/categories-logystics",
    screen: MainPermissions.get_log_categs,
  },
  {
    element: <EditAddCategory dep={Departments.logystics} />,
    path: "/categories-logystics/:id",
    screen: MainPermissions.edit_log_categs,
  },

  {
    element: <EditAddCategory dep={Departments.logystics} />,
    path: "/categories-logystics/add",
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
    element: <EditInventoryProd />,
    path: "/inventory-remains/:id",
    screen: MainPermissions.edit_product_inventory,
  },
  {
    element: <InventoryRemainsMins />,
    path: "/inventory-remains",
    screen: MainPermissions.inventory_remains_in_stock,
  },
  {
    element: <InventoryOrderedTools />,
    path: "/order-products-inventory",
    screen: MainPermissions.get_inventory_purchase_prods,
  },
  {
    element: <ShowInventoryTool />,
    path: "/order-products-inventory/:id",
    screen: MainPermissions.edit_inventory_purchase_prods,
  },
  {
    element: <InventoryRemains />,
    path: "/products-ierarch",
    screen: MainPermissions.get_product_inventory,
  },

  // ===========================================================
  {
    element: <ShowRequestStaff />,
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
  // ===========================================================

  {
    element: <EditAddFAQQuestions />,
    path: "/faq/add",
    screen: MainPermissions.add_faq,
  },
  {
    element: <EditAddFAQQuestions />,
    path: "/faq/:id",
    screen: MainPermissions.edit_faq,
  },
  {
    element: <HRQuestions />,
    path: "/faq",
    screen: MainPermissions.get_faq,
  },
  {
    element: <HRRequests />,
    path: "/hr-offers",
    screen: MainPermissions.get_faq_requests,
  },
  {
    element: <EditHRRequests />,
    path: "/hr-offers/:id",
    screen: MainPermissions.edit_faq_requests,
  },
  {
    element: <HRRequests />,
    path: "/hr-asked-questions",
    screen: MainPermissions.get_faq_requests,
  },
  {
    element: <EditHRRequests />,
    path: "/hr-asked-questions/:id",
    screen: MainPermissions.edit_faq_requests,
  },
  {
    element: <HRRequests />,
    path: "/hr-objections",
    screen: MainPermissions.get_faq_requests,
  },
  {
    element: <EditHRRequests />,
    path: "/hr-objections/:id",
    screen: MainPermissions.edit_faq_requests,
  },
  // ===========================================================

  {
    element: <RequestsCCTV />,
    path: "/requests-cctv",
    screen: MainPermissions.get_requests_cctv,
  },
  {
    element: <ShowCCTVRequests />,
    path: "/requests-cctv/:id",
    screen: MainPermissions.edit_requests_cctv,
  },
  {
    element: <CreateCCTVRequest />,
    path: "/requests-cctv/add",
    screen: MainPermissions.add_requests_cctv,
  },

  {
    element: (
      <Categories
        add={MainPermissions.add_cetagories_cctv}
        edit={MainPermissions.edit_cetagories_cctv}
        dep={Departments.cctv}
      />
    ),
    path: "/categories-cctv",
    screen: MainPermissions.get_cetagories_cctv,
  },
  {
    element: <EditAddCategory dep={Departments.cctv} />,
    path: "/categories-cctv/add",
    screen: MainPermissions.add_cetagories_cctv,
  },
  {
    element: <EditAddCategory dep={Departments.cctv} />,
    path: "/categories-cctv/:id",
    screen: MainPermissions.edit_cetagories_cctv,
  },

  {
    element: <Logs />,
    path: "/request/logs/:id",
    screen: MainPermissions.edit_requests_cctv,
  },

  // ===========================================================
];

export const APCStatRoutes = [
  {
    name: "По категориям",
    url: "category",
  },
  {
    name: "По филиалам",
    url: "fillial",
  },
  {
    name: "По бригадам",
    url: "brigada",
  },
  {
    name: "Бригады по категориям",
    url: "brigade_categ",
  },
  {
    name: "По расходам",
    url: "consumptions",
  },
];

export const MarketingStatsRoutes = [
  {
    name: "По уровнем сервиса",
    url: "service_level",
  },
  {
    name: "Отчет по направлениям",
    url: "department",
  },
  {
    name: "По категориям",
    url: "category",
  },
];
export const ITStatsRoutes = [
  {
    name: "По уровнем сервиса",
    url: "service_level",
  },
  {
    name: "Отчет по направлениям",
    url: "department",
  },
  {
    name: "По категориям",
    url: "category",
  },
];

export const InventoryStatsRoutes = [
  {
    name: "По уровнем сервиса",
    url: "service_level",
  },
];
