import { useMutation } from "@tanstack/react-query";
import { FileItem } from "@/components/FileUpload";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";
import { EPresetTimes } from "@/utils/types";

interface Body {
  amount: number;
  request_id: number;
  tool_id: number;
  comment: string;
  files?: FileItem[];
}

const usedItems = () => {
  const contentType = "multipart/form-data";

  const config = { timeout: EPresetTimes.MINUTE * 2 };

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

      return apiClient
        .post({
          url: "/v1/expenditure",
          body: formData,
          config,
          contentType,
        })
        .then(({ data }) => data);
    },
    onError: (e: Error) => errorToast(e.message),
  });
};
export default usedItems;
