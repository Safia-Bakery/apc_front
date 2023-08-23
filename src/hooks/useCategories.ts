import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { cachedCategories } from "src/redux/reducers/cache";
import { useAppDispatch } from "src/redux/utils/types";
import { CategoryTypes } from "src/utils/types";

export const useCategories = ({
  enabled = true,
  size,
  page = 1,
  body,
  department,
  sub_id,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  department?: number | string;
  sub_id?: number | string;
  body?: { name?: string; category_status?: string };
}) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["categories", page, department, sub_id],
    queryFn: () =>
      apiClient
        .get("/category", { size, page, department, sub_id, ...body })
        .then(({ data: response }) => {
          dispatch(cachedCategories(response as CategoryTypes));
          return response as CategoryTypes;
        }),
    enabled,
    refetchOnMount: true,
  });
};
export default useCategories;
