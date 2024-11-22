import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { EPresetTimes } from "@/utils/types";

const imageUpload = () => {
  return useMutation({
    mutationKey: ["image_upload"],
    mutationFn: async (body: any) => {
      const { data } = await baseApi.post("/v1/image/upload", body, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: EPresetTimes.MINUTE * 4,
      });
      return data;
    },
  });
};
export default imageUpload;
