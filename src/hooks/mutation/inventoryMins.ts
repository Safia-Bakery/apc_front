import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

const inventoryMinsMutation = () => {
  return useMutation({
    mutationKey: ["tools_for_order"],
    mutationFn: () =>
      apiClient.post({ url: "/toolsorder" }).then(({ data }) => data),
  });
};
export default inventoryMinsMutation;
