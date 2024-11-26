import WebAppContainer from "@/webApp/components/WebAppContainer";
import useDebounce from "@/hooks/custom/useDebounce";
import { branchSelector } from "@/store/reducers/webInventory";
import { useAppSelector } from "@/store/utils/types";
import InvInput from "@/webApp/components/InvInput";
import toolIcon from "/icons/tool.svg";
import arrow from "/icons/arrowBlack.svg";
import CustomLink from "@/webApp/components/CustomLink";
import { useParams } from "react-router-dom";
import ToolCard from "@/webApp/components/ToolCard";
import useCategories from "@/hooks/useCategories";
import Loading from "@/components/Loader";
import EmptyList from "@/components/EmptyList";
import useQueryString from "@/hooks/custom/useQueryString";
import InvPagination from "../InvPagination";
import { deptSelector } from "@/store/reducers/auth";
import { getInvFactoryCategoriesTools } from "@/hooks/factory";

const SelectCategoryToolFactory = () => {
  const { id } = useParams();

  const selectedBranch = useAppSelector(branchSelector);
  const page = useQueryString("page");
  const department = useAppSelector(deptSelector);
  const [toolsSearch, $toolsSearch] = useDebounce("");

  const { data: categories, isLoading: categoryLoading } = useCategories({
    category_status: 1,
    department,
    enabled: false,
  });
  const { data, isLoading: toolsLoading } = getInvFactoryCategoriesTools({
    ...(toolsSearch && !!selectedBranch?.id && { name: toolsSearch }),
    ...(page && { page: +page }),
    ...(id && !!selectedBranch?.id && { category_id: +id }),
    enabled: !!selectedBranch?.id && (!!toolsSearch || !!id),
  });

  return (
    <WebAppContainer className="h-full overflow-y-auto">
      <InvInput
        disabled={!selectedBranch?.id}
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

        <div className="mt-3 pb-6">
          <div className="flex flex-col gap-4">
            {!!data?.items?.length &&
              data.items.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={{
                    image: tool.file,
                    name: tool.name,
                    id: tool.id,
                    count: 0,
                  }}
                />
              ))}
            {!!data && <InvPagination totalPages={data?.pages} />}
          </div>
        </div>
      </ul>
      {!data?.items?.length && !!id && <EmptyList />}
    </WebAppContainer>
  );
};

export default SelectCategoryToolFactory;
