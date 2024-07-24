import WebAppContainer from "@/webApp/components/WebAppContainer";
import useDebounce from "@/hooks/custom/useDebounce";
import { branchSelector, selectTool } from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { InventoryTools, ToolItemType, ToolsFolderType } from "@/utils/types";
import InvInput from "@/webApp/components/InvInput";
import { useRef, useState } from "react";
import toolIcon from "/assets/icons/tool.svg";
import arrow from "/assets/icons/arrowBlack.svg";
import CustomLink from "@/webApp/components/CustomLink";
import useToolsIerarch from "@/hooks/useToolsIerarch";
import { useParams } from "react-router-dom";
import ToolCard from "@/webApp/components/ToolCard";
import { useVirtualizer } from "@tanstack/react-virtual";

const SelectTool = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [toolsPage, $toolsPage] = useState(1);
  const selectedBranch = useAppSelector(branchSelector);
  const [tools, $tools] = useState<ToolItemType[]>([]);
  const [toolsSearch, $toolsSearch] = useDebounce("");
  const { data, isLoading: toolsLoading } = useToolsIerarch({
    // page: toolsPage,
    ...(toolsSearch && !!selectedBranch?.id && { name: toolsSearch }),
    ...(id && !!selectedBranch?.id && { parent_id: id }),
    enabled: false,
  });

  const parentRef = useRef<any>();

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: data?.tools?.length!,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130,
    gap: 20,
  });

  // const handleScroll = (e: any) => {
  //   const bottom =
  //     e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  //   if (bottom && !toolsSearch && !!selectedBranch?.id) {
  //     $toolsPage((prev) =>
  //       data?.total && data?.pages > prev ? prev + 1 : prev
  //     );
  //   }
  // };

  const handleTool = (tool: ToolsFolderType) => {
    !!selectedBranch?.id &&
      dispatch(selectTool({ name: tool.name, id: tool.id }));
  };

  // useEffect(() => {
  //   if (!!data?.items?.length && !toolsSearch)
  //     $tools((prev) => [...prev, ...data.items]);

  //   if (toolsSearch && data?.items) $tools(data.items || []);
  // }, [data?.items, toolsLoading, toolsSearch]);

  return (
    <WebAppContainer className="h-full overflow-y-auto">
      <InvInput
        disabled={!selectedBranch?.id}
        placeholder="Поиск товаров"
        wrapperClassName="bg-white mb-5"
        onChange={(e) => $toolsSearch(e.target?.value)}
      />

      <ul
        className="overflow-y-auto flex flex-col"
        // onScroll={handleScroll}
      >
        {!!data?.folders?.length &&
          data?.folders.map((tool, idx) => (
            <li
              key={idx + tool.id + tool.name}
              onClick={() => handleTool(tool)}
            >
              <CustomLink
                disabled={!selectedBranch?.id}
                to={`tool/${tool.id}`}
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

        {/* {!data?.folders?.length && <EmptyList />} */}
        <div ref={parentRef} className="mt-3">
          <div
            className="flex flex-col gap-4"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {!!data?.tools?.length &&
              // rowVirtualizer.getVirtualItems()
              data.tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  // style={{
                  //   position: "absolute",
                  //   top: 0,
                  //   left: 0,
                  //   // width: "100%",
                  //   height: `${tool.size}px`,
                  //   transform: `translateY(${tool.start}px)`,
                  // }}
                />
              ))}
          </div>
        </div>
      </ul>
    </WebAppContainer>
  );
};

export default SelectTool;
