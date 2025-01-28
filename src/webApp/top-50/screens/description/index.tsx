import React from "react";
import Top50Header from "../../components/header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Flex } from "antd";
import { dateMonthYear } from "@/utils/keys";
import dayjs from "dayjs";

const Description = () => {
  return (
    <>
      <Top50Header />
      <h1 className="w-full py-5 bg-[#F2F2F2] text-center">ТОП-50</h1>
      <WebAppContainer className="pt-0">
        <Flex className="my-6" justify="space-between">
          <h3 className="text-lg">Количество задач: 50</h3>
          <h3 className="text-lg">{dayjs().format(dateMonthYear)}</h3>
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

export default Description;
