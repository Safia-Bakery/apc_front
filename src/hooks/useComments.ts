import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { CommentTypes } from "src/utils/types";

export const useComments = ({
  enabled = true,
  size,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["comments", page],
    queryFn: () =>
      apiClient
        .get("/v1/comments", { size, page })
        .then(({ data: response }) => response as CommentTypes),
    enabled,
    refetchOnMount: true,
  });
};
export default useComments;
