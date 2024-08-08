import WebAppContainer from "@/webApp/components/WebAppContainer";
import useDebounce from "@/hooks/custom/useDebounce";
import { branchSelector } from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import { Departments } from "@/utils/types";
import InvInput from "@/webApp/components/InvInput";
import { useRef } from "react";
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
import useQueryString from "@/hooks/custom/useQueryString";
import InvPagination from "../InvPagination";

const SelectCategoryTool = () => {
  const { id } = useParams();

  const selectedBranch = useAppSelector(branchSelector);
  const page = useQueryString("page");
  const [toolsSearch, $toolsSearch] = useDebounce("");

  const { data: categories, isLoading: categoryLoading } = useCategories({
    category_status: 1,
    department: Departments.inventory,
    enabled: false,
  });
  const { data, isLoading: toolsLoading } = useInvTools({
    ...(toolsSearch && !!selectedBranch?.id && { name: toolsSearch }),
    ...(page && { page: +page }),
    ...(id && !!selectedBranch?.id && { category_id: +id }),
    enabled: !!selectedBranch?.id || !!toolsSearch,
  });

  const parentRef = useRef<any>();

  const rowVirtualizer = useVirtualizer({
    count: data?.items?.length!,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130,
    gap: 20,
  });

  return (
    <WebAppContainer className="h-full overflow-y-auto ">
      <InvInput
        // disabled={!data?.items?.length}
        placeholder="Поиск товаров"
        wrapperClassName="bg-white mb-5"
        onChange={(e) => $toolsSearch(e.target?.value)}
      />

      <ul className="overflow-y-auto flex flex-col mb-4">
        {!id &&
          !!categories?.items?.length &&
          categories?.items.map((category, idx) => (
            <li key={idx + category.id + category.name}>
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

        <div ref={parentRef} className="mt-3 pb-6">
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
            {!!data && <InvPagination totalPages={data?.pages} />}
          </div>
        </div>
      </ul>
      {!data?.items?.length && <EmptyList />}
    </WebAppContainer>
  );
};

export default SelectCategoryTool;
