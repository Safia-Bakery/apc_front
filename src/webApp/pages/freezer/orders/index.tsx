import { dateTimeFormat } from "@/utils/keys";
import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Empty, Flex } from "antd";
import dayjs from "dayjs";
import cl from "classnames";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getFreezerMyOrders } from "@/hooks/freezer";
import Loading from "@/components/Loader";
import { RequestStatus } from "@/utils/types";
import useQueryString from "@/hooks/custom/useQueryString";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";

const statusClassName: { [key: number]: string } = {
  [RequestStatus.received]: "bg-tgPrimary",
  [RequestStatus.new]: "bg-tgSelected",
  [RequestStatus.closed_denied]: "bg-[#FF0000]",
  [RequestStatus.denied]: "bg-[#FF0000]",
};

const FreezerOrders = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { t } = useTranslation();
  const history = useQueryString("history");
  const navigateParams = useNavigateParams();

  const { data, isLoading } = getFreezerMyOrders({});

  if (isLoading) return <Loading />;

  return (
    <>
      <InvHeader
        sticky
        goBack={!!history}
        title={!history ? "Активные заказы" : "История заказов"}
        rightChild={
          !history && (
            <Flex
              align="center"
              vertical
              onClick={() => navigateParams({ history: 1 })}
            >
              <img
                src="/icons/archive-white.svg"
                alt="archive"
                height={17}
                width={15}
              />
              <h3 className="text-xs text-white">Архив</h3>
            </Flex>
          )
        }
      />

      <WebAppContainer className="mt-4 overflow-y-auto mb-2 ">
        <Flex vertical gap={15}>
          {!!data?.[!history ? "active" : "closed"].length &&
            data?.[!history ? "active" : "closed"]?.map((item) => (
              <Flex
                onClick={() =>
                  navigate(`/tg/collector/show-order/${item.id}${search}`)
                }
                className="rounded-lg overflow-hidden min-w-[150px] bg-[#F6F6F6] border border-tgBorder shadow-md"
                key={item.id}
                vertical
              >
                <div className="px-1 pt-2">
                  <p className="text-xs">№{item.id}</p>
                  <p className="text-xs my-1">
                    {dayjs(item.created_at).format(dateTimeFormat)}
                  </p>
                  <p className="text-xs line-clamp-2">
                    {item?.created_user?.full_name || "Не задано"}
                  </p>
                  <p className="text-xs line-clamp-2">
                    {item?.branch?.name || "Не задано"}
                  </p>
                </div>

                <Flex
                  className={cl(
                    statusClassName[item.status],
                    "w-full text-white text-sm"
                  )}
                  align="center"
                  justify="center"
                >
                  {!!item.status ? "Закрыт" : "Новый"}
                </Flex>
              </Flex>
            ))}

          {!data?.[!history ? "active" : "closed"]?.length && (
            <Empty description={t("empty_list")} />
          )}
        </Flex>
      </WebAppContainer>
    </>
  );
};

export default FreezerOrders;
