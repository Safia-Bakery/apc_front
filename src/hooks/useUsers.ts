import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { cachedUsers } from "src/redux/reducers/cacheResources";
import { useAppDispatch } from "src/redux/utils/types";
import { UsersTypes } from "src/utils/types";

export const useUsers = ({
  enabled = true,
  size = 20,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ["users"],
    queryFn: () =>
      apiClient
        .get(`/users?size=${size}&page=${page}`)
        .then(({ data: response }) => {
          dispatch(cachedUsers(response as UsersTypes));
          return response as UsersTypes;
        }),
    enabled,
    refetchOnMount: true,
  });
};
export default useUsers;
