import WebAppContainer from "@/webApp/components/WebAppContainer";
import { useState } from "react";
import Top50Header from "../../components/header";
import { kruFinishedTasks, useKruAvailableTask } from "@/hooks/kru";
import { useNavigate, useParams } from "react-router-dom";
import useQueryString from "@/hooks/custom/useQueryString";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import { Button } from "antd";
import successToast from "@/utils/successToast";
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
    if (page < availabeTasks?.products?.length! - 1)
      mutate(
        {
          tg_id: Number(tg_id),
          tool_id: Number(currentTool?.id),
          ...(!!answers && {
            answers: Object.entries(answers).map((item) => ({
              task_id: +item[0],
              comment: item[1],
            })),
          }),
        },
        {
          onSuccess: () => {
            successToast("success");
            navigateParams({ page: page + 1 });
            $answers({});
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
          onError: (e) => errorToast(e.message),
        }
      );
    else {
      navigate(`/tg/top-50/success/${id}`);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Top50Header />
      <h1 className="w-full py-5 bg-[#F2F2F2] text-center text-base">
        {currentTool?.name}
      </h1>
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
          disabled={isPending}
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
