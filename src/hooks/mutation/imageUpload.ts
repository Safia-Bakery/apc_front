import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { EPresetTimes } from "@/utils/types";

const imageUpload = () => {
  const contentType = "multipart/form-data";
  const config = { timeout: EPresetTimes.MINUTE * 5 };
  return useMutation({
    mutationKey: ["image_upload"],
    mutationFn: async (body: any) => {
      const { data } = await apiClient.post({
        url: "/v1/image/upload",
        body,
        config,
        contentType,
      });
      return data;
    },
  });
};
export default imageUpload;
