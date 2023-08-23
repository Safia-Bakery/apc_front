import { useMutation } from "@tanstack/react-query";
import { FileItem } from "src/components/FileUpload";
import apiClient from "src/main";

interface RegisterTypes {
  request_id: number;
  files?: FileItem[];
}

const uploadFileMutation = () => {
  const contentType = "multipart/form-data";

  const config = { timeout: 100000 };
  return useMutation(["register"], ({ request_id, files }: RegisterTypes) => {
    const formData = new FormData();
    formData.append("request_id", String(request_id));
    files?.forEach((item) => {
      formData.append("files", item.file, item.file.name);
    });
    return apiClient
      .post({ url: "/v1/upload/file", body: formData, contentType, config })
      .then(({ data }) => data);
  });
};
export default uploadFileMutation;
