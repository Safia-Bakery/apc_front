import { dateMonthYear } from "@/utils/keys";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Flex } from "antd";
import dayjs from "dayjs";
import Top50Header from "../../components/header";
import { useKruCategories } from "@/hooks/kru";
import { useNavigate } from "react-router-dom";

const Tasker = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch, isFetching } = useKruCategories({
    page: 1,
  });
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
          {data?.items?.map((item) => (
            <Flex
              onClick={() => navigate(`/tg/top-50/description/${item.id}`)}
              key={item.id}
              flex={1}
              className="min-h-32 rounded-2xl relative overflow-hidden p-4"
            >
              <span className="z-10 font-bold opacity-60">
                {dayjs(item.start_time, "HH:mm").format("HH:mm")} -{" "}
                {dayjs(item.end_time, "HH:mm").format("HH:mm")}
              </span>
              <img
                src={`/images/${item.id === 25 ? "top-50" : "dailytasks"}.png`}
                alt="top-50-tasks"
                className="w-full h-full absolute inset-0"
              />
            </Flex>
          ))}
        </Flex>

        <img
          src="/images/safia.jpg"
          alt="safia-logo"
          width={50}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-50"
        />
      </WebAppContainer>
    </>
  );
};

export default Tasker;
