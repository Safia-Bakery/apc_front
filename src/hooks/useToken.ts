import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { MeTypes } from "@/utils/types";
import baseApi from "@/api/base_api";

export const useToken = ({ enabled = true }) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["me_token"],
    queryFn: () =>
      baseApi.get("/me").then(({ data: response }) => response as MeTypes),
    enabled: !!token && enabled,
  });
};

export default useToken;
