import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

const inventoryMinsMutation = () => {
  return useMutation(["tools_for_order"], () =>
    apiClient.post({ url: "/toolsorder" }).then(({ data }) => data)
  );
};
export default inventoryMinsMutation;
