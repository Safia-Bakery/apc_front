import { lazy } from "react";
import { stockStores } from "./keys";
import { Departments, MarketingSubDep, SidebarType, Sphere } from "./types";
import { MainPermissions } from "./permissions";
import { ITRequestStatusArr } from "./helpers";

const EditAddFormcategory = lazy(
  () => import("@/pages/form/categories/edit-add-category")
);
const FormCategories = lazy(() => import("@/pages/form/categories"));
const CoinRequests = lazy(() => import("@/pages/coins/requests"));
const ShowCoin = lazy(() => import("@/pages/coins/show-coin"));
const FactoryRequests = lazy(() => import("@/pages/factory/requests"));
const EditAddInvFabricCategory = lazy(
  () => import("@/pages/factory/edit-add-category")
);
const ShowFactoryRequest = lazy(() => import("@/pages/factory/show-request"));
const FactoryManagers = lazy(() => import("@/pages/factory/managers"));
const FactoryDivisions = lazy(() => import("@/pages/factory/divisions"));
const InventoryFactoryRemains = lazy(
  () => import("@/pages/factory/tool-remains")
);
const EditInventoryFactoryProd = lazy(
  () => import("@/pages/factory/edit-add-tool")
);
const EditAddFabricMaster = lazy(
  () => import("@/pages/factory/edit-add-managers")
);
const EditAddFactoryDivisions = lazy(
  () => import("@/pages/factory/edit-add-division")
);
const RequestsStaff = lazy(() => import("@/pages/RequestsStaff"));
const ParentTools = lazy(() => import("@/pages/ParentTools"));
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

const Categories = lazy(() => import("@/pages/Categories"));
const EditAddCategory = lazy(() => import("@/pages/EditAddCategory"));
const EditAddInvCategory = lazy(() => import("@/pages/EditAddInvCategory"));
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

const RequestsCCTV = lazy(() => import("@/pages/RequestsCCTV"));
const CreateCCTVRequest = lazy(() => import("@/pages/CreateCCTVRequest"));
const ShowCCTVRequests = lazy(() => import("@/pages/ShowCCTVRequests"));

const ApcExpenseCategories = lazy(() => import("@/pages/ApcExpenseCategories"));
const ApcExpenses = lazy(() => import("@/pages/ApcExpenses"));
const EditAddApcExpense = lazy(() => import("@/pages/EditAddApcExpense"));

const BotSettings = lazy(() => import("@/pages/BotSettings"));
const EditAddTgLink = lazy(() => import("@/pages/EditAddTgLink"));
const ITTgLinks = lazy(() => import("@/pages/ITTgLinks"));

const FormRequests = lazy(() => import("@/pages/form/requests"));
const ShowFormRequests = lazy(() => import("@/pages/form/show-request"));
const InventoryCategories = lazy(() => import("@/pages/InventoryCategories"));
const Cleaning = lazy(() => import("@/pages/Cleaning"));

const AddKRUSubTasks = lazy(() => import("@/pages/AddKRUSubTasks"));

const EditKruTask = lazy(() => import("@/pages/EditKruTask"));
const KruTasks = lazy(() => import("@/pages/KruTasks"));
const LogsIt = lazy(() => import("@/pages/ShowITRequest/logs"));

const indexes = [0, 1, 4, 6];
const filtered = indexes.map((i) => ITRequestStatusArr[i]);
const request_status = JSON.stringify(filtered);

export const sidebarRoutes: SidebarType[] = [
  {
    name: "apc_retail",
    icon: "/icons/apc.svg",
    screen: MainPermissions.get_requests_apc,
    department: Departments.APC,
    sphere_status: Sphere.retail,
    subroutes: [
      {
        name: "requests_apc_retail",
        url: "/requests-apc-retail",
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_requests_apc,
      },
      {
        name: "brigades",
        url: "/brigades",
        icon: "/icons/brigades.svg",
        screen: MainPermissions.get_brigadas,
      },
      {
        name: "remains_in_stock",
        url: "/items-in-stock",
        icon: "/icons/remains-in-stock.svg",
        param: `/${stockStores.retail}`,
        screen: MainPermissions.get_warehouse_retail,
      },
      {
        name: "categories",
        url: `/categories-apc-retail`,
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_apc_category,
      },
      {
        name: "statistics",
        url: "/statistics-apc-retail",
        param: "/service_level",
        icon: "/icons/statistics.svg",
        screen: MainPermissions.stats_apc_retail,
      },
      // {
      //   name: "expense_categories",
      //   url: "/expense-categories",
      //   icon: "/icons/categories.svg",
      //   screen: MainPermissions.get_apc_expenses_categories,
      // },
      {
        name: "expense_for_outsource",
        url: "/expense-for-outsource",
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_apc_expenses,
      },
      {
        name: "cleaning",
        url: "/cleaning",
        icon: "/icons/categories.svg",
        screen: MainPermissions.apc_cleaning,
      },
    ],
  },
  {
    name: "apc_fabric",
    icon: "/icons/apc.svg",
    screen: MainPermissions.get_fabric_requests,
    department: Departments.APC,
    sphere_status: Sphere.fabric,
    subroutes: [
      {
        name: "requests_apc_fabric",
        url: "/requests-apc-fabric",
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_fabric_requests,
      },
      {
        name: "masters",
        url: "/masters",
        icon: "/icons/brigades.svg",
        screen: MainPermissions.get_master,
      },
      {
        name: "managers",
        url: "/factory-managers",
        icon: "/icons/user.svg",
        screen: MainPermissions.get_apc_fabric_managers,
      },
      {
        name: "branch_dep",
        url: "/factory-divisions",
        icon: "/icons/branch.svg",
        screen: MainPermissions.get_apc_fabric_division,
      },
      {
        name: "categories",
        url: `/categories-apc-fabric`,
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_categ_fab,
      },
      {
        name: "remains_in_stock",
        url: "/items-in-stock",
        icon: "/icons/remains-in-stock.svg",
        param: `/${stockStores.fabric}`,
        screen: MainPermissions.get_warehouse_fabric,
      },
      {
        name: "statistics",
        url: "/statistics-apc-fabric",
        icon: "/icons/statistics.svg",
        param: "/service_level",
        screen: MainPermissions.stats_apc_fabric,
      },
    ],
  },

  {
    name: "IT",
    icon: "/icons/it.svg",
    screen: MainPermissions.get_it_requests,
    department: Departments.IT,
    subroutes: [
      {
        name: "requests",
        url: `/requests-it/${Sphere.fix}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_it_requests,
        param: `?request_status=${request_status}`,
      },
      {
        name: "it_specialists",
        url: "/masters-it",
        icon: "/icons/users.svg",
        screen: MainPermissions.it_get_masters,
      },
      {
        name: "categories",
        url: `/categories-it/${Sphere.fix}`,
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_categ_it,
      },

      {
        name: "tg_links",
        url: "/tg-link-it",
        icon: "/icons/remains-in-stock.svg",
        screen: MainPermissions.get_tg_link,
      },
      {
        name: "statistics",
        url: "/statistics-it",
        icon: "/icons/statistics.svg",
        param: "/service_level",
        screen: MainPermissions.it_statistics,
      },
    ],
  },

  {
    name: "inventory_retail",
    icon: "/icons/inventary.svg",
    department: Departments.inventory_retail,
    screen: MainPermissions.get_requests_inventory_retail,
    subroutes: [
      {
        name: "requests",
        url: `/requests-inventory/${Departments.inventory_retail}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_requests_inventory_retail,
      },
      {
        name: "categories",
        url: `/categories-inventory-retail`,
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_categories_inventory_retail,
      },
      {
        name: "inventory_products",
        url: "/products-ierarch",
        icon: "/icons/products.svg",
        screen: MainPermissions.get_product_inventory_retail,
      },
      {
        name: "purchasing_requests",
        url: "/order-products-inventory",
        icon: "/icons/products.svg",
        screen: MainPermissions.get_inventory_purchase_prods_retail,
      },
      {
        name: "statistics",
        url: "/statistics-inventory-retail",
        param: "/service_level",
        icon: "/icons/statistics.svg",
        screen: MainPermissions.inventory_reports_retail,
      },
    ],
  },

  {
    name: "inventory_fabric",
    icon: "/icons/inventary.svg",
    department: Departments.inventory_factory,
    screen: MainPermissions.get_requests_inventory_factory,
    subroutes: [
      {
        name: "requests",
        url: `/requests-inventory/${Departments.inventory_factory}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_requests_inventory_factory,
      },
      {
        name: "categories",
        url: `/categories-inventory-factory`,
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_categories_inventory_factory,
      },
      {
        name: "inventory_products",
        url: "/products-ierarch-factory",
        icon: "/icons/products.svg",
        screen: MainPermissions.get_prods_inv_factory,
      },
      {
        name: "statistics",
        url: "/statistics-inventory-factory",
        param: "/service_level",
        icon: "/icons/statistics.svg",
        screen: MainPermissions.reports_inv_factory,
      },
    ],
  },
  {
    name: "marketing",
    icon: "/icons/marketing.svg",
    screen: MainPermissions.get_design_request,
    department: Departments.marketing,
    subroutes: [
      {
        name: "all_requests",
        url: "/marketing-all-requests",
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.marketing_all_requests,
      },
      {
        name: "designers",
        url: `/marketing-${MarketingSubDep[1]}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_design_request,
      },
      {
        name: "video_photo",
        url: `/marketing-${MarketingSubDep[2]}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_locmar_requests,
      },
      {
        name: "promo_production",
        url: `/marketing-${MarketingSubDep[3]}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_promo_requests,
      },
      {
        name: "pos",
        url: `/marketing-${MarketingSubDep[4]}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_pos_requests,
      },
      {
        name: "complects",
        url: `/marketing-${MarketingSubDep[5]}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_complect_requests,
      },
      {
        name: "ter_managers",
        url: `/marketing-${MarketingSubDep[6]}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_nostandard_requests,
      },
      {
        name: "branch_env",
        url: `/marketing-${MarketingSubDep[7]}`,
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_stock_env_requests,
      },
      {
        name: "categories",
        url: `/categories-marketing`,
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_mark_category,
      },
      {
        name: "statistics",
        url: "/statistics-marketing",
        param: "/service_level",
        icon: "/icons/statistics.svg",
        screen: MainPermissions.stats_marketing,
      },
    ],
  },

  {
    name: "requests_for_form",
    icon: "/icons/logystics.svg",
    screen: MainPermissions.get_form_request,
    department: Departments.form,
    subroutes: [
      {
        name: "requests",
        url: "/requests-form",
        icon: "/icons/logystics.svg",
        screen: MainPermissions.get_form_request,
      },
      {
        name: "form_type_price",
        url: "/categories-form",
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_form_category,
      },
    ],
  },

  {
    name: "kru_tasks",
    icon: "/icons/logystics.svg",
    screen: MainPermissions.kru_sub_tasks,
    subroutes: [
      {
        name: "tasks", // Поддержка
        url: `/kru-tasks`,
        icon: "/icons/categories.svg",
        screen: MainPermissions.kru_tasks,
      },
    ],
  },

  {
    name: "car_requests",
    icon: "/icons/logystics.svg",
    screen: MainPermissions.get_log_requests,
    department: Departments.car_requests,
    subroutes: [
      {
        name: "car_requests",
        url: "/requests-logystics",
        icon: "/icons/logystics.svg",
        screen: MainPermissions.get_log_requests,
      },
      {
        name: "categories",
        url: `/categories-logystics`,
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_log_categs,
      },
      {
        name: "tracks",
        url: `/logystics-cars`,
        icon: "/icons/truck.svg",
        screen: MainPermissions.get_log_requests,
      },
    ],
  },
  {
    name: "cctv",
    icon: "/icons/camera.svg",
    screen: MainPermissions.get_requests_cctv,
    department: Departments.cctv,
    subroutes: [
      {
        name: "requests",
        url: "/requests-cctv",
        icon: "/icons/subOrder.svg",
        screen: MainPermissions.get_requests_cctv,
      },
      {
        name: "categories",
        url: `/categories-cctv`,
        icon: "/icons/categories.svg",
        screen: MainPermissions.get_cetagories_cctv,
      },
    ],
  },

  {
    name: "coins",
    url: "/coins",
    icon: "/icons/staff.svg",
    screen: MainPermissions.get_coin_request,
  },
  {
    name: "parent_tools",
    url: "/parent-tools",
    icon: "/icons/folder-icon.svg",
    screen: MainPermissions.get_all_folders,
  },
  {
    name: "users",
    url: "/users",
    icon: "/icons/users.svg",
    screen: MainPermissions.get_users,
  },
  {
    name: "clients",
    url: "/clients",
    icon: "/icons/clients.svg",
    screen: MainPermissions.get_clients,
    param: "?client=true",
  },
  {
    name: "roles",
    url: "/roles",
    icon: "/icons/roles.svg",
    screen: MainPermissions.get_roles,
  },
  {
    name: "reviews",
    url: "/comments",
    icon: "/icons/comments.svg",
    screen: MainPermissions.get_comments_list,
  },
  {
    name: "clients_comments",
    url: "/client-comments",
    icon: "/icons/clientComment.svg",
    screen: MainPermissions.get_client_comment,
  },
  {
    name: "settings",
    icon: "/icons/settings.svg",
    screen: MainPermissions.get_fillials_list,
    subroutes: [
      {
        name: "branches",
        url: "/branches",
        icon: "/icons/branch.svg",
        screen: MainPermissions.get_fillials_list,
      },

      {
        name: "additions",
        url: "/additions",
        icon: "/icons/settings.svg",
        screen: MainPermissions.bot_settings,
      },
    ],
  },
];

export const routes = [
  {
    element: <FormRequests />,
    path: "/requests-form",
    screen: MainPermissions.get_form_request,
  },
  {
    element: <ParentTools />,
    path: "/parent-tools",
    screen: MainPermissions.get_all_folders,
  },
  {
    element: <KruTasks />,
    path: "/kru-tasks",
    screen: MainPermissions.kru_tasks,
  },

  {
    element: <EditKruTask />,
    path: "/kru-tasks/:id",
    screen: MainPermissions.edit_kru_tasks,
  },

  {
    element: <EditKruTask />,
    path: "/kru-tasks/add",
    screen: MainPermissions.edit_kru_tasks,
  },
  {
    element: <AddKRUSubTasks />,
    path: "/kru-tasks/:id/add-task",
    screen: MainPermissions.kru_sub_tasks,
  },
  {
    element: <ShowFormRequests />,
    path: "/requests-form/:id",
    screen: MainPermissions.edit_form_request,
  },
  {
    element: <FormCategories />,
    path: "/categories-form",
    screen: MainPermissions.get_form_category,
  },
  {
    element: <EditAddFormcategory />,
    path: "/categories-form/:id",
    screen: MainPermissions.edit_form_category,
  },
  {
    element: <EditAddFormcategory />,
    path: "/categories-form/add",
    screen: MainPermissions.add_form_category,
  },

  {
    element: <BotSettings />,
    path: "/additions",
    screen: MainPermissions.bot_settings,
  },
  {
    element: <InventoryCategories dep={Departments.inventory_retail} />,
    path: "/categories-inventory-retail",
    screen: MainPermissions.get_categories_inventory_retail,
  },
  {
    element: <InventoryCategories dep={Departments.inventory_factory} />,
    path: "/categories-inventory-factory",
    screen: MainPermissions.get_categories_inventory_factory,
  },
  {
    element: <EditAddInvCategory />,
    path: "/categories-inventory-retail/:id",
    screen: MainPermissions.edit_categories_inventory_retail,
  },
  {
    element: <EditAddInvFabricCategory />,
    path: "/categories-inventory-factory/:id",
    screen: MainPermissions.edit_categories_inventory_factory,
  },
  {
    element: <EditAddInvFabricCategory />,
    path: "/categories-inventory-factory/add",
    screen: MainPermissions.add_categories_inventory_factory,
  },
  {
    element: <EditAddInvCategory />,
    path: "/categories-inventory-retail/add",
    screen: MainPermissions.add_categories_inventory_retail,
  },
  {
    element: <ITTgLinks />,
    path: "/tg-link-it",
    screen: MainPermissions.get_tg_link,
  },
  {
    element: <EditAddTgLink />,
    path: "/tg-link-it/add",
    screen: MainPermissions.add_tg_link,
  },
  {
    element: <EditAddTgLink />,
    path: "/tg-link-it/:id",
    screen: MainPermissions.edit_tg_link,
  },
  {
    element: <ApcExpenseCategories />,
    path: "/expense-categories",
    screen: MainPermissions.get_apc_expenses_categories,
  },
  {
    element: <ApcExpenses />,
    path: "/expense-for-outsource",
    screen: MainPermissions.get_apc_expenses,
  },
  {
    element: <EditAddApcExpense />,
    path: "/expense-for-outsource/add",
    screen: MainPermissions.add_apc_expenses,
  },
  {
    element: <EditAddApcExpense />,
    path: "/expense-for-outsource/:id",
    screen: MainPermissions.edit_apc_expenses,
  },
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
    element: <Cleaning />,
    path: "/cleaning",
    screen: MainPermissions.apc_cleaning,
  },
  {
    element: <CreateApcRequest />,
    path: "/requests-apc-fabric/add",
    screen: MainPermissions.add_fabric_requests,
  },
  {
    element: <ShowFactoryRequest />,
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
        addExp={MainPermissions.request_add_expanditure}
        add={MainPermissions.add_request_apc}
        edit={MainPermissions.edit_request_apc}
      />
    ),
    path: "/requests-apc-retail",
    screen: MainPermissions.get_requests_apc,
  },
  {
    element: <FactoryRequests />,
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
        title="Видеография / Фото"
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
        sub_id={MarketingSubDep.ter_managers}
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
        sub_id={MarketingSubDep.branch_env}
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
  // { element: <YandexMap />, path: "/map", screen: MainPermissions.get_map },
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
        dep={Departments.APC}
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
        dep={Departments.APC}
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
        dep={Departments.IT}
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
      <EditAddCategory dep={Departments.APC} sphere_status={Sphere.retail} />
    ),
    path: "/categories-apc-retail/:id",
    screen: MainPermissions.edit_apc_category,
  },
  {
    element: (
      <EditAddCategory dep={Departments.APC} sphere_status={Sphere.fabric} />
    ),
    path: "/categories-apc-fabric/:id",
    screen: MainPermissions.edit_categ_fab,
  },
  {
    element: <EditAddCategory dep={Departments.IT} />,
    path: "/categories-it/:sphere/:id",
    screen: MainPermissions.edit_categ_it,
  },
  {
    element: <EditAddCategory dep={Departments.IT} />,
    path: "/categories-it/:sphere/add",
    screen: MainPermissions.edit_categ_it,
  },
  {
    element: (
      <EditAddCategory dep={Departments.APC} sphere_status={Sphere.retail} />
    ),
    path: "/categories-apc-retail/add",
    screen: MainPermissions.add_apc_category,
  },
  {
    element: (
      <EditAddCategory dep={Departments.APC} sphere_status={Sphere.fabric} />
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
        dep={Departments.APC}
        sphere_status={Sphere.fabric}
        add={MainPermissions.add_master}
        edit={MainPermissions.edit_master}
      />
    ),
    path: "/masters",
    screen: MainPermissions.get_master,
  },
  {
    element: <FactoryManagers />,
    path: "/factory-managers",
    screen: MainPermissions.get_apc_fabric_managers,
  },
  {
    element: (
      <Masters
        dep={Departments.APC}
        sphere_status={Sphere.retail}
        add={MainPermissions.add_brigada}
        edit={MainPermissions.edit_brigada}
      />
    ),
    path: "/brigades",
    screen: MainPermissions.get_brigadas,
  },
  {
    element: <LogsIt />,
    path: "/request-it/logs/:id",
    screen: MainPermissions.edit_it_requests,
  },
  {
    element: <Logs />,
    path: "/request/logs/:id",
    screen: MainPermissions.edit_request_apc,
  },
  {
    element: <Logs />,
    path: "/request/logs/:id",
    screen: MainPermissions.edit_fabric_requests,
  },

  {
    element: (
      <Masters
        dep={Departments.IT}
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
    element: <EditAddFabricMaster />,
    path: "/factory-managers/add",
    screen: MainPermissions.update_apc_fabric_managers,
  },
  {
    element: <EditAddMasters />,
    path: "/masters/add",
    screen: MainPermissions.add_master,
  },
  {
    element: <FactoryDivisions />,
    path: "/factory-divisions",
    screen: MainPermissions.get_apc_fabric_division,
  },
  {
    element: <EditAddFactoryDivisions />,
    path: "/factory-divisions/add",
    screen: MainPermissions.update_apc_fabric_division,
  },
  {
    element: <EditAddFactoryDivisions />,
    path: "/factory-divisions/:id",
    screen: MainPermissions.update_apc_fabric_division,
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
    element: <EditAddFabricMaster />,
    path: "/factory-managers/:id",
    screen: MainPermissions.update_apc_fabric_managers,
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
    element: <RemainsInStock />,
    path: "/items-in-stock/:id",
    screen: MainPermissions.get_warehouse_fabric,
  },
  {
    element: (
      <Categories
        add={MainPermissions.add_log_categs}
        edit={MainPermissions.edit_log_categs}
        dep={Departments.car_requests}
      />
    ),
    path: "/categories-logystics",
    screen: MainPermissions.get_log_categs,
  },
  {
    element: <EditAddCategory dep={Departments.car_requests} />,
    path: "/categories-logystics/:id",
    screen: MainPermissions.edit_log_categs,
  },

  {
    element: <EditAddCategory dep={Departments.car_requests} />,
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
    path: "/requests-inventory/:dep",
    screen: MainPermissions.get_requests_inventory_factory,
  },
  {
    element: <RequestsInventory />,
    path: "/requests-inventory/:dep",
    screen: MainPermissions.get_requests_inventory_retail,
  },
  {
    element: <ShowRequestInventory />,
    path: "/requests-inventory/:dep/:id",
    screen: MainPermissions.edit_requests_inventory_retail,
  },
  {
    element: <ShowRequestInventory />,
    path: "/requests-inventory/:dep/:id",
    screen: MainPermissions.edit_requests_inventory_factory,
  },
  {
    element: <AddInventoryRequest />,
    path: "/requests-inventory/:dep/add",
    screen: MainPermissions.add_requests_inventory_retail,
  },
  {
    element: <AddInventoryRequest />,
    path: "/requests-inventory/:dep/add",
    screen: MainPermissions.edit_requests_inventory_factory,
  },
  {
    element: <EditInventoryProd />,
    path: "/inventory-remains/:id",
    screen: MainPermissions.edit_product_inventory_retail,
  },
  {
    element: <EditInventoryFactoryProd />,
    path: "/inventory-remains-factory/:id",
    screen: MainPermissions.edit_prods_inv_factory,
  },
  {
    element: <InventoryRemainsMins />,
    path: "/inventory-remains",
    screen: MainPermissions.inventory_remains_in_stock_retail,
  },
  {
    element: <InventoryFactoryRemains />,
    path: "/inventory-remains-factory",
    screen: MainPermissions.remains_in_stock_inv_factory,
  },
  {
    element: <InventoryOrderedTools />,
    path: "/order-products-inventory",
    screen: MainPermissions.get_inventory_purchase_prods_retail,
  },
  // {
  //   element: <InventoryOrderedTools />,
  //   path: "/order-products-inventory",
  //   screen: MainPermissions.get_purchase_prods_inv_factory,
  // },
  {
    element: <ShowInventoryTool />,
    path: "/order-products-inventory/:id",
    screen: MainPermissions.edit_inventory_purchase_prods_retail,
  },
  // {
  //   element: <EditInventoryFactoryProd />,
  //   path: "/order-products-inventory/:id",
  //   screen: MainPermissions.edit_purchase_prods_inv_factory,
  // },
  {
    element: <InventoryRemains />,
    path: "/products-ierarch",
    screen: MainPermissions.get_product_inventory_retail,
  },
  {
    element: <InventoryFactoryRemains />,
    path: "/products-ierarch-factory",
    screen: MainPermissions.get_prods_inv_factory,
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
  // {
  //   element: <HRQuestions />,
  //   path: "/faq",
  //   screen: MainPermissions.get_faq,
  // },
  // {
  //   element: <HRRequests />,
  //   path: "/hr-offers",
  //   screen: MainPermissions.get_faq_requests,
  // },
  // {
  //   element: <EditHRRequests />,
  //   path: "/hr-offers/:id",
  //   screen: MainPermissions.edit_faq_requests,
  // },
  // {
  //   element: <HRRequests />,
  //   path: "/hr-asked-questions",
  //   screen: MainPermissions.get_faq_requests,
  // },
  // {
  //   element: <EditHRRequests />,
  //   path: "/hr-asked-questions/:id",
  //   screen: MainPermissions.edit_faq_requests,
  // },
  // {
  //   element: <HRRequests />,
  //   path: "/hr-objections",
  //   screen: MainPermissions.get_faq_requests,
  // },
  // {
  //   element: <EditHRRequests />,
  //   path: "/hr-objections/:id",
  //   screen: MainPermissions.edit_faq_requests,
  // },
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

  {
    element: <CoinRequests />,
    path: "/coins",
    screen: MainPermissions.get_coin_request,
  },

  {
    element: <ShowCoin />,
    path: "/coins/:id",
    screen: MainPermissions.edit_coin_request,
  },

  // ===========================================================
];

export const APCStatRoutes = [
  {
    name: "with_category",
    url: "category",
  },
  {
    name: "with_branch",
    url: "fillial",
  },
  {
    name: "with_brigada",
    url: "brigada",
  },
  {
    name: "with_brigada_category",
    url: "brigade_categ",
  },
  {
    name: "with_consumption",
    url: "consumptions",
  },
  {
    name: "with_service_level",
    url: "service_level",
  },
];

export const MarketingStatsRoutes = [
  {
    name: "with_service_level",
    url: "service_level",
  },
  {
    name: "direction_report",
    url: "department",
  },
  {
    name: "with_category",
    url: "category",
  },
];
export const ITStatsRoutes = [
  {
    name: "with_service_level",
    url: "service_level",
  },
  // {
  //   name: "direction_report",
  //   url: "department",
  // },
  // {
  //   name: "with_category",
  //   url: "category",
  // },
];

export const InventoryStatsRoutes = [
  {
    name: "with_service_level",
    url: "service_level",
  },
];
