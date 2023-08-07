import { useMutation } from "@tanstack/react-query";
import { FileItem } from "src/components/FileUpload";
import { apiClient } from "src/main";
import { errorToast } from "src/utils/toast";

interface Body {
  amount: number;
  request_id: number;
  tool_id: number;
  comment: string;
  files?: FileItem[];
}

const usedItems = () => {
  const contentType = "multipart/form-data";

  const config = { timeout: 100000 };

  return useMutation(
    ["create_order"],
    ({ amount, request_id, tool_id, comment, files }: Body) => {
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
    { onError: (e: Error) => errorToast(e.message) }
  );
};
export default usedItems;
