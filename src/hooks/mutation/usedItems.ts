import { useMutation } from "@tanstack/react-query";
import { FileItem } from "@/components/FileUpload";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";
import { EPresetTimes } from "@/utils/types";

interface Body {
  amount: number;
  request_id: number;
  tool_id: number;
  comment: string;
  files?: FileItem[];
}

const usedItems = () => {
  return useMutation({
    mutationKey: ["create_order"],
    mutationFn: ({ amount, request_id, tool_id, comment, files }: Body) => {
      const formData = new FormData();
      formData.append("amount", String(amount));
      formData.append("request_id", String(request_id));
      formData.append("tool_id", String(tool_id));
      formData.append("comment", comment);
      files?.forEach((item) => {
        formData.append("files", item.file, item.file.name);
      });

      return baseApi
        .post("/v1/expenditure", formData, {
          timeout: EPresetTimes.MINUTE * 2,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(({ data }) => data);
    },
    onError: (e: Error) => errorToast(e.message),
  });
};
export default usedItems;
