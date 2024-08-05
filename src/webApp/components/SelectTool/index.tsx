import WebAppContainer from "@/webApp/components/WebAppContainer";
import useDebounce from "@/hooks/custom/useDebounce";
import { branchSelector, selectTool } from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import {
  Category,
  Departments,
  InventoryTools,
  ToolItemType,
  ToolsFolderType,
} from "@/utils/types";
import InvInput from "@/webApp/components/InvInput";
import { useRef, useState } from "react";
import toolIcon from "/assets/icons/tool.svg";
import arrow from "/assets/icons/arrowBlack.svg";
import CustomLink from "@/webApp/components/CustomLink";
import { useParams } from "react-router-dom";
import ToolCard from "@/webApp/components/ToolCard";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInvTools } from "@/hooks/useInvTools";
import useCategories from "@/hooks/useCategories";
import Loading from "@/components/Loader";
import EmptyList from "@/components/EmptyList";
import Pagination from "@/components/Pagination";

const SelectTool = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const selectedBranch = useAppSelector(branchSelector);
  const [toolsSearch, $toolsSearch] = useDebounce("");
  // const [toolsPage, $toolsPage] = useState(1);
  // const [tools, $tools] = useState<ToolItemType[]>([]);

  const { data: categories, isLoading: categoryLoading } = useCategories({
    category_status: 1,
    department: Departments.inventory,
  });
  const { data, isLoading: toolsLoading } = useInvTools({
    // page: toolsPage,
    ...(toolsSearch && !!selectedBranch?.id && { name: toolsSearch }),
    ...(id && !!selectedBranch?.id && { category_id: +id }),
    enabled: !!id && !!selectedBranch?.id,
  });

  const parentRef = useRef<any>();

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: data?.items?.length!,
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

  const handleCategory = (category: Category) => {
    !!selectedBranch?.id &&
      dispatch(selectTool({ name: category.name, id: category.id.toString() }));
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
        {!id &&
          !!categories?.items?.length &&
          categories?.items.map((category, idx) => (
            <li
              key={idx + category.id + category.name}
              onClick={() => handleCategory(category)}
            >
              <CustomLink
                disabled={!selectedBranch?.id}
                to={`tool/${category.id}`}
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
                  {category.name}
                </label>
                <img src={arrow} alt="select" className="rotate-90" />
              </CustomLink>
            </li>
          ))}

        {(toolsLoading || categoryLoading) && <Loading />}

        <div ref={parentRef} className="mt-3">
          <div
            className="flex flex-col gap-4"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {!!data?.items?.length &&
              data.items.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        </div>
      </ul>
      {!data?.items?.length && <EmptyList />}
      {!!data && <Pagination totalPages={data?.pages} />}
    </WebAppContainer>
  );
};

export default SelectTool;
