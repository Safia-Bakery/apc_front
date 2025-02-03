import { dateMonthYear } from "@/utils/keys";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Flex } from "antd";
import dayjs from "dayjs";
import Top50Header from "../../components/header";
import { useKruCategories } from "@/hooks/kru";
import { useLocation, useNavigate } from "react-router-dom";
import useQueryString from "@/hooks/custom/useQueryString";
import { dailyTasksId, top50id } from "@/utils/tg-helper";
import Loading from "@/components/Loader";

const Tasker = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const tg_id = useQueryString("tg_id");
  const { data, isLoading } = useKruCategories({
    page: 1,
    tg_id: Number(tg_id),
  });
  const dailytaskItem = data?.items.find((item) => item.id === dailyTasksId);
  const top50Item = data?.items.find((item) => item.id === top50id);

  if (isLoading) return <Loading />;

  return (
    <>
      <Top50Header />
      <h1 className="w-full py-5 bg-[#F2F2F2] text-center">Tasker</h1>
      <WebAppContainer className="pt-0">
        <Flex className="my-6" justify="space-between">
          <h3 className="text-lg">Задачи</h3>
          <h3 className="text-lg">{dayjs().format(dateMonthYear)}</h3>
        </Flex>

        <Flex gap={20} vertical>
          <Flex // top 50 item
            onClick={() =>
              !!top50Item?.products_count &&
              navigate(`/tg/top-50/description/${top50id}` + search)
            }
            flex={1}
            vertical
            className="min-h-32 rounded-2xl relative overflow-hidden p-4"
          >
            <span className="z-10 font-bold opacity-60">
              {top50Item?.start_time?.slice(0, 5)} -{" "}
              {top50Item?.end_time?.slice(0, 5)}
            </span>

            {!top50Item?.products_count && (
              <span className="z-10 font-bold opacity-60">
                Задачи завершены
              </span>
            )}
            <img
              src={`/images/top-50.png`}
              alt="top-50-tasks"
              className="w-full h-full absolute inset-0"
            />
          </Flex>

          <Flex // daily tasks
            onClick={() =>
              navigate(`/tg/top-50/sub-tasks/${dailyTasksId}` + search)
            }
            flex={1}
            vertical
            className="min-h-32 rounded-2xl relative overflow-hidden p-4"
          >
            <span className="z-10 font-bold opacity-60">
              {dailytaskItem?.start_time?.slice(0, 5)} -{" "}
              {dailytaskItem?.end_time?.slice(0, 5)}
            </span>

            <img
              src={`/images/dailytasks.png`} // checking whether it is top-50
              alt="top-50-tasks"
              className="w-full h-full absolute inset-0"
            />
          </Flex>
        </Flex>

        <img
          src="/images/safia.jpg"
          alt="safia-logo"
          width={120}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-50 -z-10"
        />
      </WebAppContainer>
    </>
  );
};

export default Tasker;
