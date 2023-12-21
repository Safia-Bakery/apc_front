import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { MeTypes } from "@/utils/types";

export const useToken = ({ enabled = true }) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["me_token"],
    queryFn: () =>
      apiClient.get("/me").then(({ data: response }) => response as MeTypes),
    enabled: !!token && enabled,
  });
};

export default useToken;
