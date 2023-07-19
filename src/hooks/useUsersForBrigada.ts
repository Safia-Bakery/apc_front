import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { cachedUsers } from "src/redux/reducers/cacheResources";
import { useAppDispatch } from "src/redux/utils/types";
import { UsersType } from "src/utils/types";

export const useUsersForBrigada = ({
  enabled = true,
  id,
}: {
  enabled?: boolean;
  id: number;
}) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["users_for_brigada"],
    queryFn: () =>
      apiClient.get(`/users/for/brigada/${id}`).then(({ data: response }) => {
        dispatch(cachedUsers(response as UsersType[]));
        return response as UsersType[];
      }),
    enabled,
    refetchOnMount: true,
  });
};
export default useUsersForBrigada;
