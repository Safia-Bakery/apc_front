import WebAppContainer from "@/webApp/components/WebAppContainer";
import { useState } from "react";
import Top50Header from "../../components/header";
import { kruFinishedTasks, useKruAvailableTask } from "@/hooks/kru";
import { useNavigate, useParams } from "react-router-dom";
import useQueryString from "@/hooks/custom/useQueryString";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import { Button, Flex } from "antd";
import errorToast from "@/utils/errorToast";
import cl from "classnames";
import Loading from "@/components/Loader";

const Questions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();
  const page = Number(useQueryString("page")) || 0;
  const tg_id = useQueryString("tg_id");
  const { mutate, isPending } = kruFinishedTasks();
  const { data: availabeTasks, isLoading } = useKruAvailableTask({
    category_id: +id!,
    tg_id: Number(tg_id),
    enabled: !!id && !!tg_id,
  });
  const [answers, $answers] = useState<{ [key: number]: string }>({});
  const currentTool = availabeTasks?.products?.[page];

  const handleSubmit = () => {
    mutate(
      {
        tg_id: Number(tg_id),
        tool_id: Number(currentTool?.id),
        kru_category_id: Number(id),
        ...(!!answers && {
          answers: Object.entries(answers).map((item) => ({
            task_id: +item[0],
            comment: item[1],
          })),
        }),
      },
      {
        onSuccess: () => {
          // successToast("success");
          if (page < availabeTasks?.products?.length! - 1) {
            navigateParams({ page: page + 1 });
            $answers({});
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            navigate(`/tg/top-50/success/${id}`);
          }
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Top50Header />
      <Flex justify="space-between" align="center">
        <h1 className="w-full m-auto py-5 bg-[#F2F2F2] text-center text-base max-w-[270px] overflow-hidden whitespace-nowrap text-ellipsis">
          {currentTool?.name}
        </h1>
        <div className="bg-[#D9D9D9] rounded-full text-sm text-center py-1 px-2 flex absolute z-0 right-3">{`${
          page + 1
        } | ${availabeTasks?.products?.length}`}</div>
      </Flex>
      <WebAppContainer className="pt-0 h-screen">
        {availabeTasks?.tasks?.map((item) => (
          <div className="mb-10" key={item.id}>
            <h3 className="mb-3 text-sm">{item.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              {item?.answers?.map((answer) => (
                <button
                  onClick={() =>
                    $answers((prev) => ({ ...prev, [item.id]: answer }))
                  }
                  className={cl(
                    "bg-[#C0C0C0] transition-colors rounded-md p-4",
                    {
                      ["!bg-[#009D6E] text-white"]: answers[item.id] === answer,
                    }
                  )}
                  key={answer}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        ))}

        <Button
          disabled={isPending || Object.keys(answers).length < 3}
          onClick={handleSubmit}
          className="bg-[#009D6E] rounded-xl w-full sticky right-2 left-2 bottom-2  text-white"
        >
          Далее
        </Button>
      </WebAppContainer>
    </>
  );
};

export default Questions;
