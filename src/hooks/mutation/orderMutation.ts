import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

interface Body {
  product?: string;
  description: string;
  size?: string;
  category_id: number;
  fillial_id: string;
  files?: any[];
  factory?: boolean;
  arrival_date?: string;
  bread_size?: number;
  cat_prod?: { [key: string | number]: number };
  expenditure?: { [key: string]: [number, string] };
  vidfrom?: string;
  vidto?: string;
}

const requestMutation = () => {
  const contentType = "multipart/form-data";

  const config = { timeout: 100000 };

  return useMutation({
    mutationKey: ["create_order"],
    mutationFn: async (body: Body) => {
      const formData = new FormData();
      Object.entries(body).forEach((item) => {
        switch (item[0]) {
          case "cat_prod":
            formData.append(item[0], JSON.stringify(item[1]));
            break;
          case "expenditure":
            formData.append(item[0], JSON.stringify(item[1]));
            break;

          case "files":
            body.files?.forEach((item) => {
              formData.append("files", item.file);
            });
            break;

          default:
            formData.append(item[0], item[1]);
            break;
        }
      });
      const { data } = await apiClient.post({
        url: "/request",
        body: formData,
        params: { size: body.size },
        config,
        contentType,
      });
      return data;
    },

    onError: (e: Error) => errorToast(e.message),
  });
};
export default requestMutation;
