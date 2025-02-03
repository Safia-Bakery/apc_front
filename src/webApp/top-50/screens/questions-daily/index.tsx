import WebAppContainer from "@/webApp/components/WebAppContainer";
import { useEffect, useState } from "react";
import Top50Header from "../../components/header";
import { kruFinishedTasks, useKruAvailableTask } from "@/hooks/kru";
import { useNavigate, useParams } from "react-router-dom";
import useQueryString from "@/hooks/custom/useQueryString";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import { Button, Flex } from "antd";
import errorToast from "@/utils/errorToast";
import Loading from "@/components/Loader";
import MainInput from "@/components/BaseInputs/MainInput";
import MainDropZone from "@/components/MainDropZone";

const QuestionsDailyTasks = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();
  const [page, $page] = useState(0);
  // const page = Number(useQueryString("page")) || 0;
  const tg_id = useQueryString("tg_id");
  const { mutate, isPending } = kruFinishedTasks();
  const {
    data: availabeTasks,
    isLoading,
    refetch,
  } = useKruAvailableTask({
    category_id: +id!,
    tg_id: Number(tg_id),
    enabled: !!id && !!tg_id,
  });
  const [files, $files] = useState<string[]>([]);
  const [answer, $answer] = useState<string>();
  const currentTool = availabeTasks?.tasks?.[page];

  const handleSubmit = () => {
    mutate(
      {
        tg_id: Number(tg_id),
        // tool_id: Number(currentTool?.id),
        kru_category_id: Number(id),
        ...(!!answer && {
          answers: [
            {
              task_id: currentTool?.id!,
              ...(answer && { comment: answer }),
              ...(files.length && { file: files[0] }),
            },
          ],
        }),
      },
      {
        onSuccess: () => {
          // successToast("success");
          if (page < availabeTasks?.tasks?.length! - 1) {
            // navigateParams({ page: page + 1 });
            $page((prev) => prev + 1);
            $answer("");
            // window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            navigate(`/tg/top-50/success/${id}`);
          }
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    refetch();
  }, []);

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
        } | ${availabeTasks?.tasks?.length}`}</div>
      </Flex>
      <WebAppContainer className="pt-0 h-screen">
        {/* {availabeTasks?.tasks?.map((item) => (
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
        ))} */}
        <div>
          <h3 className="mb-3 text-sm">{currentTool?.name}</h3>
          <Flex className="">
            <MainInput
              value={answer}
              placeholder={"Ваш Ответ..."}
              onChange={(e) => $answer(e.target.value)}
            />
            {/* <button className="w-9 h-9">
              <PaperClipOutlined className="text-2xl" /> */}
            {/* </button> */}
          </Flex>
          <MainDropZone setData={$files} btnClassName={"!w-full"} />
        </div>

        <Button
          disabled={isPending || (!answer && !files.length)}
          onClick={handleSubmit}
          className="bg-[#009D6E] rounded-xl absolute right-2 left-2 bottom-2 text-white h-12"
        >
          Далее
        </Button>
      </WebAppContainer>
    </>
  );
};

export default QuestionsDailyTasks;
