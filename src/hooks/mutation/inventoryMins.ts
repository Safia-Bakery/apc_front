import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

const inventoryMinsMutation = () => {
  return useMutation({
    mutationKey: ["tools_for_order"],
    mutationFn: () => baseApi.post("/toolsorder").then(({ data }) => data),
  });
};
export default inventoryMinsMutation;
