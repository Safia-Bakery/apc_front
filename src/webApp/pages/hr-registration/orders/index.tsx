import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import HrOrderItem from "../hr-order-item";
import { Empty, Flex } from "antd";
import { getMyAppointments } from "@/hooks/hr-registration";
import Loading from "@/components/Loader";
import { RequestStatus } from "@/utils/types";
import { useTranslation } from "react-i18next";

const HrOrders = () => {
  const { t } = useTranslation();

  const { data, isLoading, refetch, isRefetching } = getMyAppointments({});

  if (isLoading) return <Loading />;

  return (
    <div>
      <InvHeader title="Отменить запись" sticky goBack />

      <WebAppContainer>
        <Flex vertical gap={15}>
          {!!data?.length &&
            data?.map((item) => (
              <HrOrderItem
                id={item.id}
                key={item.id}
                title={item?.user?.full_name}
                description={t(RequestStatus[item.status])}
              />
            ))}

          {!data?.length && <Empty description={t("empty_list")} />}
        </Flex>
      </WebAppContainer>
    </div>
  );
};

export default HrOrders;
