import React from "react";
import Top50Header from "../../components/header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Button, Flex } from "antd";
import { dateMonthYear } from "@/utils/keys";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useKruCategory } from "@/hooks/kru";

const Description = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: category, isLoading } = useKruCategory({
    id: Number(id),
    enabled: !!id,
  });
  return (
    <>
      <Top50Header />
      <h1 className="w-full py-5 bg-[#F2F2F2] text-center"></h1>
      <WebAppContainer className="pt-0">
        <Flex className="my-6" justify="space-between">
          <h3 className="text-sm">Количество задач: 50</h3>
          <h3 className="text-sm">
            {dayjs(category?.start_time, "HH:mm").format("HH:mm")} -{" "}
            {dayjs(category?.end_time, "HH:mm").format("HH:mm")}
          </h3>
        </Flex>

        <div className="text-sm">
          <span className="font-bold text-inherit">Описание: </span>
          {category?.description}
        </div>

        <img
          src="/images/safia.jpg"
          alt="safia-logo"
          width={50}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-50"
        />
        <Button className="bg-[#009D6E] w-full rounded-xl absolute">
          Начать выполнять задачи
        </Button>
      </WebAppContainer>
    </>
  );
};

export default Description;
