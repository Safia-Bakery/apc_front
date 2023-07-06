import { useQuery } from "@tanstack/react-query";
import apiClient from "src/api/baseAxios";
import { tokenSelector } from "src/redux/reducers/authReducer";
import { useAppSelector } from "src/redux/utils/types";
import { MeTypes } from "src/utils/types";

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
