import Top50Header from "../../components/header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Button, Flex } from "antd";
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useKruAvailableTask, useKruCategory } from "@/hooks/kru";
import useQueryString from "@/hooks/custom/useQueryString";
import Loading from "@/components/Loader";
import { useEffect } from "react";

const Description = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { search } = useLocation();
  const tg_id = useQueryString("tg_id");
  const { data: category, isLoading } = useKruCategory({
    id: Number(id),
    enabled: !!id,
  });
  const {
    data: availabeTasks,
    isLoading: availableLoading,
    refetch,
  } = useKruAvailableTask({
    category_id: +id!,
    tg_id: Number(tg_id),
    enabled: !!id && !!tg_id,
  });

  useEffect(() => {
    refetch();
  }, []);

  if (availableLoading || isLoading) return <Loading />;

  return (
    <>
      <Top50Header />
      <h1 className="w-full py-5 bg-[#F2F2F2] text-center text-base">
        {category?.name}
      </h1>
      <WebAppContainer className="pt-0 ">
        <Flex className="my-6" justify="space-between">
          <h3 className="text-sm">
            Количество задач: {availabeTasks?.products?.length || 0}
          </h3>
          <h3 className="text-sm">
            {category?.start_time.slice(0, 5)} -{" "}
            {category?.end_time.slice(0, 5)}
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
          disabled={!availabeTasks?.products?.length}
          onClick={() => navigate(`/tg/top-50/questions/${id}` + search)}
          className="bg-[#009D6E] rounded-xl absolute right-2 left-2 bottom-2 text-white"
        >
          Начать выполнять задачи
        </Button>
      </WebAppContainer>
    </>
  );
};

export default Description;
