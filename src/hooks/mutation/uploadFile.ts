import { useMutation } from "@tanstack/react-query";
import { FileItem } from "@/components/FileUpload";
import baseApi from "@/api/base_api";
import { EPresetTimes } from "@/utils/types";

interface RegisterTypes {
  request_id: number;
  files?: FileItem[];
}

export const uploadFileMutation = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: ({ request_id, files }: RegisterTypes) => {
      const formData = new FormData();
      formData.append("request_id", String(request_id));
      files?.forEach((item) => {
        formData.append("files", item.file, item.file.name);
      });
      return baseApi
        .post("/v1/upload/file", formData, {
          timeout: EPresetTimes.MINUTE * 5,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(({ data }) => data);
    },
  });
};

export const uploadFileMutationV2 = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async ({ files }: { files: any[] }) => {
      // console.log(files, "files");
      const formData = new FormData();
      files?.forEach((item) => {
        formData.append("files", item, item?.name);
      });
      const { data } = await baseApi.post("/file/upload", formData, {
        timeout: EPresetTimes.MINUTE * 10,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
  });
};
