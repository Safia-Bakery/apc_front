import Top50Header from "../../components/header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Button, Flex } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useKruCategory } from "@/hooks/kru";
import useQueryString from "@/hooks/custom/useQueryString";
import Loading from "@/components/Loader";
import { useEffect } from "react";

const DescriptionDailyTasks = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { search } = useLocation();
  const tg_id = useQueryString("tg_id");
  const {
    data: category,
    isLoading,
    refetch,
  } = useKruCategory({
    id: Number(id),
    enabled: !!id,
    tg_id: Number(tg_id),
  });

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <Top50Header showPopover />
      <h1 className="w-full py-5 bg-[#F2F2F2] text-center text-base">
        {category?.name}
      </h1>
      <WebAppContainer className="pt-0 ">
        <Flex className="my-6" justify="space-between">
          <h3 className="text-sm">
            Количество задач: {category?.tasks_count || 0}
          </h3>
          <h3 className="text-sm">
            {category?.start_time?.slice(0, 5)} -{" "}
            {category?.end_time?.slice(0, 5)}
          </h3>
        </Flex>

        <div className="text-sm">
          <span className="font-bold text-inherit">Описание: </span>
          {category?.description}
        </div>

        <img
          src="/images/safia.jpg"
          alt="safia-logo"
          width={120}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-40"
        />

        <Button
          disabled={!category?.tasks_count}
          onClick={() => navigate(`/tg/top-50/questions-daily/${id}` + search)}
          className="bg-[#009D6E] rounded-xl absolute right-2 left-2 bottom-2 text-white h-12"
        >
          Начать выполнять задачи
        </Button>
      </WebAppContainer>
    </>
  );
};

export default DescriptionDailyTasks;
