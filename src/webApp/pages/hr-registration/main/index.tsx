import { Flex, Image } from "antd";
import React from "react";

const HrRegisteryMain = () => {
  return (
    <div className="p-2">
      <Flex justify="space-between" align="center" gap={10}>
        <div className="">
          <h1 className="text-xl">Мои заяки</h1>
          <p className="text-[#A3A3A3] text-[10px]">2 заявки в работе</p>
        </div>

        <div className="">
          <img src="/icons/archive.svg" alt="archive" height={17} width={15} />
          <h3 className="text-[10px]">Архив</h3>
        </div>
      </Flex>

      <Flex className="w-full mt-4 overflow-x-auto py-1" gap={10}>
        {[...Array(6)].map((_, idx) => (
          <Flex
            className="rounded-lg overflow-hidden min-w-[150px]"
            key={idx}
            vertical
          >
            <div className="px-1 pt-2">
              <p className="text-[10px]">№123456</p>
              <p className="text-[10px] my-1">12.01.2024 9:30</p>
              <p className="text-[10px] line-clamp-2">Имя Фамилия</p>
            </div>

            <Flex
              className="w-full bg-[#46B72F] text-white"
              align="center"
              justify="center"
            >
              Оформлено
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Flex
        className="h-24 w-full z-10 rounded-lg relative overflow-hidden mt-4"
        align="center"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 20.1%, rgba(0, 0, 0, 0.65) 35.98%, rgba(0, 0, 0, 0.55) 43.44%, rgba(0, 0, 0, 0.45) 52.53%, rgba(60, 60, 60, 0.35) 64.6%, rgba(60, 60, 60, 0.35) 73.69%)",
        }}
      >
        <img
          src="/images/registery.png"
          alt="registery-image"
          height={96}
          width={"100%"}
          className="!absolute object-fill inset-0 z-0"
        />
        <h2 className="text-white">Подать заявку</h2>
      </Flex>
    </div>
  );
};

export default HrRegisteryMain;
