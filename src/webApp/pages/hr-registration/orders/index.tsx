import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import HrOrderItem from "../hr-order-item";
import { Empty, Flex } from "antd";
import { getMyAppointments } from "@/hooks/hr-registration";
import Loading from "@/components/Loader";
import cl from "classnames";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { dateTimeFormat } from "@/utils/keys";
import { useNavigate } from "react-router-dom";
import { statusClassName } from "../main";
import { titleObj } from "@/utils/hr-registry";

const HrOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, refetch, isRefetching } = getMyAppointments({});

  if (isLoading) return <Loading />;

  return (
    <div>
      <InvHeader title="Архив" sticky goBack />

      <WebAppContainer>
        <Flex vertical gap={15}>
          {!!data?.archive.length &&
            data?.archive?.map((item) => (
              // <HrOrderItem
              //   id={item.id}
              //   key={item.id}
              //   title={item?.user?.full_name}
              //   description={t(RequestStatus[item.status])}
              // />
              <Flex
                onClick={() => navigate(`/tg/hr-registery/orders/${item.id}`)}
                className="rounded-lg overflow-hidden min-w-[150px] bg-[#F6F6F6]"
                key={item.id}
                vertical
              >
                <div className="px-1 pt-2">
                  <p className="text-xs">№{item.id}</p>
                  <p className="text-xs my-1">
                    {dayjs(item.time_slot).format(dateTimeFormat)}
                  </p>
                  <p className="text-xs line-clamp-2">
                    {item.employee_name || "Не задано"}
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
                  {titleObj[item.status]}
                </Flex>
              </Flex>
            ))}

          {!data?.archive?.length && <Empty description={t("empty_list")} />}
        </Flex>
      </WebAppContainer>
    </div>
  );
};

export default HrOrders;
