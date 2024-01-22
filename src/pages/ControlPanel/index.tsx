import dayjs from "dayjs";
import styles from "./index.module.scss";
import useToken from "@/hooks/useToken";
import Card from "@/components/Card";
import { Link } from "react-router-dom";
import Container from "@/components/Container";
import cl from "classnames";
import useMainStats from "@/hooks/useMainStats";
import { Departments, MainPermissions, Sphere } from "@/utils/types";
import Chart from "react-apexcharts";
import { useMemo } from "react";
import Loading from "@/components/Loader";
import { handleDepartment } from "@/utils/helpers";

const options = {
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
  dataLabels: {
    enabled: false,
  },
} as any;

interface DepTypes {
  [key: number]: { dep: Departments; sphere?: Sphere };
}

const mainDeps: DepTypes = {
  [MainPermissions.get_requests_apc]: {
    dep: Departments.apc,
    sphere: Sphere.retail,
  },
  [MainPermissions.get_fabric_requests]: {
    dep: Departments.apc,
    sphere: Sphere.fabric,
  },
  [MainPermissions.get_it_requests]: {
    dep: Departments.it,
  },
  [MainPermissions.get_requests_inventory]: {
    dep: Departments.inventory,
  },
  [MainPermissions.get_design_request]: {
    dep: Departments.marketing,
  },
  [MainPermissions.get_locmar_requests]: {
    dep: Departments.marketing,
  },
  [MainPermissions.get_promo_requests]: {
    dep: Departments.marketing,
  },
  [MainPermissions.get_pos_requests]: {
    dep: Departments.marketing,
  },
  [MainPermissions.get_complect_requests]: {
    dep: Departments.marketing,
  },
  [MainPermissions.get_nostandard_requests]: {
    dep: Departments.marketing,
  },
  [MainPermissions.get_stock_env_requests]: {
    dep: Departments.marketing,
  },
  [MainPermissions.get_log_requests]: {
    dep: Departments.logystics,
  },
  [MainPermissions.get_staff_requests]: {
    dep: Departments.staff,
  },
};

const ControlPanel = () => {
  const { data: user } = useToken({ enabled: false });

  const perms = new Set(user?.permissions);
  const mainDep = Object.entries(mainDeps).find((item) =>
    perms.has(+item[0])
  )?.[1];

  const { data: stats, isLoading } = useMainStats({
    department: mainDep?.dep!,
    ...(mainDep?.sphere && { sphere_status: mainDep?.sphere }),
    enabled: !!mainDep?.dep,
  });

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

  if (isLoading) return <Loading absolute />;

  return (
    <>
      <Card className={cl(styles.card, "!mb-2")}>
        <div className="header text-center">
          <h4 className="title m-0">Добро пожаловать {user?.full_name}</h4>
          <p className={styles.category}>{user?.role?.toString()}</p>

          <p>{handleDepartment({ dep: mainDep.dep })}</p>
        </div>

        <div className="mt-6">
          <p className={styles.category}>{dayjs().format("DD-MM-YYYY")}</p>
        </div>
      </Card>
      <div className="h-full -mt-4">
        <Container>
          <div className="flex flex-[6] gap-2 ">
            <div className={cl(styles.blockItem)}>
              <h3 className="text-center mb-4">Моя команда</h3>

              {series?.serie && (
                <Chart
                  options={{
                    ...options,
                    xaxis: { categories: series.categories },
                  }}
                  series={[series.serie]}
                  type="bar"
                  // width={380}
                  height={300}
                />
              )}

              <div className="w-full flex justify-end">
                <Link to={""} className="flex text-gray-400">
                  Перейти{" "}
                  <img
                    src="/assets/icons/arrowBlack.svg"
                    alt=""
                    className="rotate-90"
                    width={15}
                    height={15}
                  />
                </Link>
              </div>

              <hr className={styles.hr} />

              <p className="">
                Количество заявок в обработке:{" "}
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
                <div className={cl(styles.blockItem, "flex-1 justify-between")}>
                  <h3 className="text-base h-12">
                    Заявки без исполнителя Новые
                  </h3>
                  <h2 className="text-center mt-2">{stats?.new_requests}</h2>

                  <div className="w-full flex justify-end">
                    <Link to={""} className="flex text-gray-400 text-xs mt-3">
                      открыть список{" "}
                      <img
                        src="/assets/icons/arrowBlack.svg"
                        alt=""
                        className="rotate-90"
                        width={15}
                        height={15}
                      />
                    </Link>
                  </div>
                </div>

                <div className={cl(styles.blockItem, "flex-1 justify-between")}>
                  <h3 className="text-base h-12">Средний рейтинг</h3>
                  <h2 className="text-center mt-2">{stats?.avg_rating}</h2>

                  <div className="w-full flex justify-end">
                    <Link to={""} className="flex text-gray-400 text-xs mt-3">
                      открыть все оценки{" "}
                      <img
                        src="/assets/icons/arrowBlack.svg"
                        alt=""
                        className="rotate-90"
                        width={15}
                        height={15}
                      />
                    </Link>
                  </div>
                </div>

                <div className={cl(styles.blockItem, "flex-1 justify-between")}>
                  <h3 className="text-base h-12">Среднее время обработки</h3>
                  <div className="text-center flex items-center justify-center mt-2">
                    {stats?.avg_time && (
                      <h3 className="text-lg">
                        {Math.floor(stats?.avg_time / 60)} ч.{" "}
                        {stats?.avg_time % 60} мин
                      </h3>
                    )}{" "}
                    /<p className="text-xs"> 1 заяка</p>
                  </div>

                  <div className="mt-3 h-4" />
                </div>

                <div className={cl(styles.blockItem, "flex-1 justify-between")}>
                  <h3 className="text-base h-12">
                    Обработано за текущий месяц
                  </h3>
                  <div className="text-center flex items-center justify-center mt-2">
                    <h3 className="text-lg">786 заявок</h3>
                  </div>

                  <div className="mt-3 h-4" />
                </div>
              </div>
              {/* ========================================================================= */}

              <div className={cl(styles.blockItem, "h-64")}>
                <h3 className="text-base">Январь</h3>
                <p className="text-xl">Статистика по заказам</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ControlPanel;
