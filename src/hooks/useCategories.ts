import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { cachedCategories } from "src/redux/reducers/cacheResources";
import { useAppDispatch } from "src/redux/utils/types";
import { CategoryTypes } from "src/utils/types";

export const useCategories = ({
  enabled = true,
  size,
  page,
  body,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  body?: { name?: string; category_status?: number };
}) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiClient
        .get("/category", { size, page, ...body })
        .then(({ data: response }) => {
          dispatch(cachedCategories(response as CategoryTypes));
          return response as CategoryTypes;
        }),
    enabled,
  });
};
export default useCategories;
