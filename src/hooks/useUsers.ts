import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { UsersTypes } from "@/utils/types";

interface BodyTypes {
  full_name?: string;
  username?: string;
  phone_number?: string;
  role_id?: string;
  user_status?: string;
}

export const useUsers = ({
  enabled = true,
  size,
  page,
  body,
  position,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  position?: boolean;
  body?: BodyTypes;
}) => {
  return useQuery({
    queryKey: ["users", page, position, body],
    queryFn: () =>
      apiClient
        .get({ url: "/users", params: { page, size, ...body, position } })
        .then(({ data: response }) => {
          return response as UsersTypes;
        }),
    enabled,
    refetchOnMount: true,
  });
};
export default useUsers;
