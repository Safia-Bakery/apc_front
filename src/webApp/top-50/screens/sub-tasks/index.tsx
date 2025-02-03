import useQueryString from "@/hooks/custom/useQueryString";
import { useKruCategories } from "@/hooks/kru";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Flex } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Top50Header from "../../components/header";
import Loading from "@/components/Loader";

const Top50SubTasks = () => {
  const { id } = useParams();
  const page = Number(useQueryString("page")) || 1;
  const navigate = useNavigate();
  const { search } = useLocation();
  const tg_id = useQueryString("tg_id");
  const { data: categoriesChild, isLoading: categoriesChildLoading } =
    useKruCategories({
      page,
      parent: Number(id),
      tg_id: Number(tg_id),
      enabled: !!id,
    });

  if (categoriesChildLoading) return <Loading />;

  return (
    <>
      <Top50Header />
      <WebAppContainer>
        <h1 className="w-full py-5 bg-[#F2F2F2] text-center">
          Ежедневные задачи
        </h1>
        <Flex vertical gap={20}>
          {categoriesChild?.items.map((item) => (
            <Flex
              onClick={() =>
                !!item?.tasks_count &&
                navigate(`/tg/top-50/description-daily/${item.id}` + search)
              }
              key={item.id}
              vertical
              className={`bg-invBtn rounded-2xl py-2 px-3 ${
                !item?.tasks_count ? "opacity-60" : ""
              }`}
            >
              <div className="">{item.name}</div>
              {!item?.tasks_count && (
                <span className="z-10 text-sm opacity-60">
                  Задачи завершены
                </span>
              )}
            </Flex>
          ))}
        </Flex>
      </WebAppContainer>
    </>
  );
};

export default Top50SubTasks;
