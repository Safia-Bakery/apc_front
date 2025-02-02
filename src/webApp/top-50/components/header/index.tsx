import {
  useLocation,
  useNavigate,
  useParams,
  useRoutes,
} from "react-router-dom";
import cl from "classnames";
import ArrowIcon from "../../assets/arrow";
import { Flex, Popover, Typography } from "antd";

type Props = { clasName?: string; showPopover?: boolean };

const Top50Header = ({ clasName, showPopover = false }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { search } = useLocation();
  return (
    <header
      className={cl(
        "sticky top-0 left-0 z-10 right-0 px-2 py-3 bg-white flex items-center justify-between",
        clasName
      )}
    >
      <Flex onClick={() => navigate(-1)} gap={10} align={"center"}>
        <div className="rotate-180">
          <ArrowIcon color="#4E9CFF" />
        </div>
        <Typography className="text-[#4E9CFF]">Назад</Typography>
      </Flex>

      <Flex align={"center"} vertical>
        <Typography className="text-xs text-[#898989]">
          мини-приложение
        </Typography>
      </Flex>

      <div className="w-16">
        <Popover
          content={
            showPopover && (
              <div className="p-1">
                <button
                  onClick={() => navigate(`/tg/top-50/reports/${id}${search}`)}
                >
                  Загрузить отчёты
                </button>
              </div>
            )
          }
          title="Меню"
          trigger="click"
        >
          <img src="/icons/info.svg" className=" float-end" alt="info" />
        </Popover>
      </div>
    </header>
  );
};

export default Top50Header;
