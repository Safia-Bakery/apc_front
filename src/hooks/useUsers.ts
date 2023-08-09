import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { UsersTypes } from "src/utils/types";

interface BodyTypes {
  full_name?: string;
  username?: string;
  phone_number?: string;
  role_id?: number;
  user_status?: number;
}

export const useUsers = ({
  enabled = true,
  size,
  page,
  body,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  body?: BodyTypes;
}) => {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () =>
      apiClient
        .get(`/users`, { page, size, ...body })
        .then(({ data: response }) => {
          return response as UsersTypes;
        }),
    enabled,
    refetchOnMount: true,
  });
};
export default useUsers;
