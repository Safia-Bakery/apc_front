import { useNavigate } from "react-router-dom";
import cl from "classnames";
import ArrowIcon from "../../assets/arrow";
import { Flex, Typography } from "antd";

type Props = { clasName?: string };

const Top50Header = ({ clasName }: Props) => {
  const navigate = useNavigate();
  return (
    <header
      className={cl(
        "sticky top-0 left-0 right-0 px-2 py-3 bg-white flex items-center justify-between",
        clasName
      )}
    >
      <Flex onClick={() => navigate(-1)} gap={2} align={"center"}>
        <div className="rotate-180">
          <ArrowIcon color="#4E9CFF" />
        </div>
        <Typography color={"#4E9CFF"}>Назад</Typography>
      </Flex>

      <Flex align={"center"} vertical>
        <Typography color={"black"} className="text-xs">
          мини-приложение
        </Typography>
      </Flex>

      <div className="w-16">
        <img src="/icons/info.svg" className=" float-end" alt="info" />
      </div>
    </header>
  );
};

export default Top50Header;
