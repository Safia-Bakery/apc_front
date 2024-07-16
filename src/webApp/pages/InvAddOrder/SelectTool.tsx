import WebAppContainer from "@/webApp/components/WebAppContainer";
import EmptyList from "@/components/EmptyList";
import useDebounce from "@/hooks/custom/useDebounce";
import { selectTool } from "@/store/reducers/webInventory";
import { useAppDispatch } from "@/store/utils/types";
import { ToolItemType } from "@/utils/types";
import InvInput from "@/webApp/components/InvInput";
import { useEffect, useState } from "react";
import useTools from "@/hooks/useTools";
import toolIcon from "/assets/icons/tool.svg";
import arrow from "/assets/icons/arrowBlack.svg";
import CustomLink from "@/webApp/components/CustomLink";

type Props = {};

const SelectTool = (props: Props) => {
  const dispatch = useAppDispatch();
  const [toolsPage, $toolsPage] = useState(1);
  const [tools, $tools] = useState<ToolItemType[]>([]);
  const [toolsSearch, $toolsSearch] = useDebounce("");
  const { data, isLoading: toolsLoading } = useTools({
    page: toolsPage,
    ...(toolsSearch && { name: toolsSearch }),
  });

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !toolsSearch) {
      $toolsPage((prev) =>
        data?.total && data?.pages > prev ? prev + 1 : prev
      );
    }
  };

  const handleTool = (tool: ToolItemType) => {
    dispatch(selectTool({ name: tool.name, id: tool.id }));
  };

  useEffect(() => {
    if (!!data?.items?.length && !toolsSearch)
      $tools((prev) => [...prev, ...data.items]);

    if (toolsSearch && data?.items) $tools(data.items || []);
  }, [data?.items, toolsLoading, toolsSearch]);

  return (
    <WebAppContainer>
      <InvInput
        placeholder="Поиск товаров"
        wrapperClassName="bg-white mb-5"
        onChange={(e) => $toolsSearch(e.target?.value)}
      />

      <ul
        className="h-[60vh] overflow-y-auto flex flex-1 flex-col pr-2"
        onScroll={handleScroll}
      >
        {!!tools?.length &&
          tools.map((tool, idx) => (
            <li
              key={idx + tool.id + tool.name}
              onClick={() => handleTool(tool)}
            >
              <CustomLink
                to={`/tool/${tool.id}`}
                className="flex justify-between items-center border-t border-[#E4E4E4] py-3"
              >
                <label className="flex text-black">
                  <img
                    src={toolIcon}
                    height={20}
                    width={20}
                    alt="tool-icon"
                    className="mr-2"
                  />
                  {tool.name}
                </label>
                <img src={arrow} alt="select" className="rotate-90" />
              </CustomLink>
            </li>
          ))}

        {toolsLoading && <span>loading...</span>}

        {!tools.length && <EmptyList />}
      </ul>
    </WebAppContainer>
  );
};

export default SelectTool;
