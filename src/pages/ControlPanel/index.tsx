import dayjs from "dayjs";
import styles from "./index.module.scss";
import useToken from "@/hooks/useToken";
import Card from "@/components/Card";
import { Link } from "react-router-dom";
import Container from "@/components/Container";
import cl from "classnames";
import useMainStats from "@/hooks/useMainStats";
import { Departments, MarketingSubDep, Sphere } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Chart from "react-apexcharts";
import { ChangeEvent, useMemo, useState } from "react";
import Loading from "@/components/Loader";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import { Months } from "@/utils/keys";
import { useTranslation } from "react-i18next";

const options = {
  legend: {
    show: false,
  },
  chart: {
    type: "bar",
    height: 300,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
      barHeight: "40%",
    },
  },
  tooltip: {
    enabled: false,
  },
} as any;

type DepType = {
  dep: Departments;
  sphere?: Sphere;
  sub_id?: MarketingSubDep;
  ratingUrl?: string;
};
interface DepTypes {
  [key: number]: DepType;
}

const btnArr = [
  {
    title: "news",
    url: "/marketing-all-requests?request_status=0",
  },
  {
    title: "receiveds",
    url: "/marketing-all-requests?request_status=1",
    className: "table-primary",
  },
  {
    title: "sent_to_clients",
    url: "/marketing-all-requests?request_status=2",
    className: "table-warning",
  },
];

const mainDeps: DepTypes = {
  [MainPermissions.get_requests_apc]: {
    dep: Departments.APC,
    sphere: Sphere.retail,
  },
  [MainPermissions.get_fabric_requests]: {
    dep: Departments.APC,
    sphere: Sphere.fabric,
  },
  [MainPermissions.get_it_requests]: {
    dep: Departments.IT,
  },
  [MainPermissions.get_requests_inventory_retail]: {
    dep: Departments.inventory_retail,
  },
  [MainPermissions.get_design_request]: {
    dep: Departments.marketing,
    sub_id: MarketingSubDep.designers,
  },
  [MainPermissions.get_locmar_requests]: {
    dep: Departments.marketing,
    sub_id: MarketingSubDep.local_marketing,
  },
  [MainPermissions.get_promo_requests]: {
    dep: Departments.marketing,
    sub_id: MarketingSubDep.promo_production,
  },
  [MainPermissions.get_pos_requests]: {
    dep: Departments.marketing,
    sub_id: MarketingSubDep.pos,
  },
  [MainPermissions.get_complect_requests]: {
    dep: Departments.marketing,
    sub_id: MarketingSubDep.complects,
  },
  [MainPermissions.get_nostandard_requests]: {
    dep: Departments.marketing,
    sub_id: MarketingSubDep.ter_managers,
  },
  [MainPermissions.get_stock_env_requests]: {
    dep: Departments.marketing,
    sub_id: MarketingSubDep.branch_env,
  },
  [MainPermissions.get_log_requests]: {
    dep: Departments.car_requests,
  },
  [MainPermissions.get_staff_requests]: {
    dep: Departments.request_for_food,
  },
  [MainPermissions.get_requests_cctv]: {
    dep: Departments.cctv,
  },
};

enum MonthVals {
  last_30 = "last_30",
  last_month = "last_month",
}

const ControlPanel = () => {
  const { t } = useTranslation();
  const [upload, $upload] = useState(false);
  const { data: user } = useToken({ enabled: false });
  const perms = new Set(user?.permissions);
  const mainDep: DepType = Object.entries(mainDeps).find((item) =>
    perms.has(+item[0])
  )?.[1];
  const mainPerms = useAppSelector(permissionSelector);
  const [selectMonth, $selectMonth] = useState(MonthVals.last_month);

  const isMarkAdmin = mainPerms?.has(MainPermissions.marketing_all_requests);

  const handleMonth = (e: ChangeEvent<HTMLSelectElement>) =>
    $selectMonth(e.target.value as MonthVals);

  const { data: stats, isLoading } = useMainStats({
    department: mainDep?.dep!,
    ...(mainDep?.sphere && { sphere_status: mainDep?.sphere }),
    ...(mainDep?.sub_id &&
      !isMarkAdmin && {
        sub_id: mainDep?.sub_id,
      }),
    enabled: upload && !!mainDep?.dep,
  });

  const renderDep = useMemo(() => {
    if (mainDep)
      switch (mainDep.dep) {
        case Departments.APC:
          if (mainDep.sphere === Sphere.fabric)
            return {
              title: "apc_fabric",
              teamUrl: "/statistics-apc-fabric/brigada",
              newOrders: "/requests-apc-fabric?request_status=0",
              ratingUrl: "/requests-apc-fabric?rate=1",
            };
          else
            return {
              title: "apc_retail",
              teamUrl: "/statistics-apc-retail/brigada",
              newOrders: "/requests-apc-retail?request_status=0",
              ratingUrl: "/requests-apc-retail?rate=1",
            };
        case Departments.inventory_retail:
          return {
            title: "inventory",
            newOrders: "/requests-inventory?request_status=0",
          };
        case Departments.marketing:
          if (isMarkAdmin)
            return {
              title: "marketing",
              ratingUrl: "/marketing-all-requests?rate=1",
            };
          if (mainDep.sub_id === MarketingSubDep.branch_env)
            return {
              title: "marketing_branch_env",
              newOrders: "/marketing-branchEnv?request_status=0",
              ratingUrl: "/marketing-branchEnv?rate=1",
            };
          if (mainDep.sub_id === MarketingSubDep.complects)
            return {
              title: "marketing_complects",
              newOrders: "/marketing-complects?request_status=0",
              ratingUrl: "/marketing-complects?rate=1",
            };
          if (mainDep.sub_id === MarketingSubDep.designers)
            return {
              title: "marketing_project_works",
              newOrders: "/marketing-designers?request_status=0",
              ratingUrl: "/marketing-designers?rate=1",
            };
          if (mainDep.sub_id === MarketingSubDep.local_marketing)
            return {
              title: "local_marketing",
              newOrders: "/marketing-local_marketing?request_status=0",
              ratingUrl: "/marketing-local_marketing?rate=1",
            };
          if (mainDep.sub_id === MarketingSubDep.ter_managers)
            return {
              title: "marketing_ter_managers",
              newOrders: "/marketing-nonstandartAdv?request_status=0",
              ratingUrl: "/marketing-nonstandartAdv?rate=1",
            };
          if (mainDep.sub_id === MarketingSubDep.pos)
            return {
              title: "marketing_pos",
              newOrders: "/marketing-pos?request_status=0",
              ratingUrl: "/marketing-pos?rate=1",
            };
          if (mainDep.sub_id === MarketingSubDep.promo_production)
            return {
              title: "marketing_promo_production",
              newOrders: "/marketing-promo_production?request_status=0",
              ratingUrl: "/marketing-promo_production?rate=1",
            };
          else return { title: "marketing" };
        case Departments.IT:
          if (mainDep.sphere === Sphere.purchase)
            return {
              title: "it_purchase",
              newOrders: `/requests-it/${Sphere.purchase}?request_status=0`,
              ratingUrl: `/requests-it/${Sphere.purchase}?rate=1`,
            };
          else
            return {
              title: "it_support",
              newOrders: `/requests-it/${Sphere.fix}?request_status=0`,
              ratingUrl: `/requests-it/${Sphere.fix}?rate=1`,
            };
        case Departments.car_requests:
          return {
            title: "car_requests",
            newOrders: "/requests-logystics?request_status=0",
          };
        case Departments.request_for_food:
          return { title: "request_for_food", newOrders: "/requests-staff" };

        case Departments.cctv:
          return {
            title: "cctv",
            newOrders: "/requests-cctv?request_status=0",
          };
        default:
          break;
      }
  }, [mainDep]);

  const series = useMemo(() => {
    if (!!stats?.brage_requests)
      return {
        serie: {
          data: Object.entries(stats?.brage_requests)?.map(
            (item) => item[1][1]
          ),
        },
        categories: Object.entries(stats?.brage_requests)?.map(
          (item) => item[0]
        ),
      };
  }, [stats?.brage_requests]);

  const renderChart = useMemo(() => {
    if (series?.serie)
      return (
        <Chart
          options={{
            ...options,
            xaxis: { categories: series.categories },
          }}
          series={[series.serie]}
          type="bar"
          height={300}
        />
      );
  }, [series]);

  const renderMarketingContent = useMemo(() => {
    if (isMarkAdmin && mainDep.dep === Departments.marketing)
      return (
        <div className="flex gap-2">
          {btnArr.map((item) => (
            <Link
              to={item.url}
              className={cl(
                styles.blockItem,
                item.className,
                "flex-1 justify-between items-center text-black"
              )}
              key={item.title}
            >
              <div className="flex"></div>
              <div className="text-base font-bold flex items-center justify-center text-center">
                {t(item.title)}
              </div>

              <div className="w-full flex justify-end mt-3">
                {t("open_list")}{" "}
                <img
                  src="/icons/arrowBlack.svg"
                  alt=""
                  className="rotate-90"
                  width={15}
                  height={15}
                />
              </div>
            </Link>
          ))}
        </div>
      );
  }, [user?.permissions]);

  if (isLoading && !!mainDep?.dep) return <Loading />;

  return (
    <>
      <Card className={cl(styles.card, "!mb-2 !min-h-fit")}>
        <div className="header text-center">
          <h4 className="title m-0">
            {t("welcome")} {user?.full_name}
          </h4>
          <p className={styles.category}>{user?.role?.toString()}</p>

          <p>{t(renderDep?.title || "")}</p>
        </div>

        <div className="w-full flex justify-between items-center">
          <p className={styles.category}>{dayjs().format("DD-MM-YYYY")}</p>

          <button className="btn btn-info" onClick={() => $upload(true)}>
            {t("upload_stats")}
          </button>
        </div>
      </Card>
      {mainDep?.dep && upload && (
        <div className="h-full -mt-4">
          <Container>
            <div className="flex flex-[6] gap-2 ">
              <div className={cl(styles.blockItem)}>
                <h3 className="text-center mb-4">{t("my_team")}</h3>
                {renderChart}

                <div className="w-full flex justify-end">
                  {renderDep?.teamUrl && (
                    <Link
                      to={renderDep?.teamUrl}
                      className="flex text-gray-400"
                    >
                      {t("go")}{" "}
                      <img
                        src="/icons/arrowBlack.svg"
                        alt=""
                        className="rotate-90"
                        width={15}
                        height={15}
                      />
                    </Link>
                  )}
                </div>

                <hr className={styles.hr} />

                <p>
                  {t("request_qnt_in_process")}:{" "}
                  <span className="text-xl text-blue-500">
                    {stats?.in_progress}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {/* main block */}

                {/* ========================================================================= */}
                <div className="flex gap-2 flex-[4]">
                  {/* top row content */}
                  <div
                    className={cl(styles.blockItem, "flex-1 justify-between")}
                  >
                    <h3 className="text-base h-12">
                      {t("not_assigned_requests")}
                    </h3>
                    <h2 className="text-center mt-2">{stats?.new_requests}</h2>

                    <div className="w-full flex justify-end mt-3">
                      {renderDep?.newOrders && !isMarkAdmin && (
                        <Link
                          to={renderDep?.newOrders}
                          className="flex text-gray-400 text-xs"
                        >
                          {t("open_list")}{" "}
                          <img
                            src="/icons/arrowBlack.svg"
                            alt=""
                            className="rotate-90"
                            width={15}
                            height={15}
                          />
                        </Link>
                      )}
                    </div>
                  </div>

                  {!!stats?.avg_rating && (
                    <div
                      className={cl(styles.blockItem, "flex-1 justify-between")}
                    >
                      <h3 className="text-base h-12">{t("avg_rating")}</h3>
                      <h2 className="text-center mt-2">{stats?.avg_rating}</h2>

                      <div className="w-full flex justify-end mt-3">
                        {renderDep?.ratingUrl && (
                          <Link
                            to={renderDep?.ratingUrl}
                            className="flex text-gray-400 text-xs "
                          >
                            {t("open_all_rtates")}{" "}
                            <img
                              src="/icons/arrowBlack.svg"
                              alt=""
                              className="rotate-90"
                              width={15}
                              height={15}
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className={cl(styles.blockItem, "flex-1 justify-between")}
                  >
                    <h3 className="text-base h-12">{t("avg_time")}</h3>
                    <div className="text-center flex items-center justify-center mt-2">
                      {stats?.avg_time && (
                        <h3 className="text-lg">
                          {Math.floor(stats?.avg_time / 60)} {t("h")}.{" "}
                          {stats?.avg_time % 60} {t("minutes")}
                        </h3>
                      )}{" "}
                      /<p className="text-xs"> 1 {t("request")}</p>
                    </div>

                    <div className="mt-3 h-4" />
                  </div>

                  <div
                    className={cl(styles.blockItem, "flex-1 justify-between")}
                  >
                    <h3 className="text-base h-12">
                      <select onChange={handleMonth} value={selectMonth}>
                        <option value={MonthVals.last_month}>
                          {t("handled_curr_month")}
                        </option>
                        <option value={MonthVals.last_30}>
                          {t("handled_last_30")}
                        </option>
                      </select>
                    </h3>
                    <div className="text-center flex items-center justify-center mt-2">
                      <h3 className="text-lg">
                        {stats?.[selectMonth]} {t("requests")}
                      </h3>
                    </div>

                    <div className="mt-3 h-4" />
                  </div>
                </div>
                {/* ========================================================================= */}

                <div className={cl(styles.blockItem, "h-64")}>
                  <h3 className="text-base capitalize">
                    {Months[dayjs().get("M")]}
                  </h3>
                  <p className="text-xl">{t("request_stats")}</p>
                </div>
                {renderMarketingContent}
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default ControlPanel;
