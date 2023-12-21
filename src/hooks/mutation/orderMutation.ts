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
}

const requestMutation = () => {
  const contentType = "multipart/form-data";

  const config = { timeout: 100000 };

  return useMutation(
    ["create_order"],
    ({
      product,
      description,
      category_id,
      fillial_id,
      files,
      factory,
      size,
      arrival_date,
      bread_size,
      cat_prod,
    }: Body) => {
      const formData = new FormData();
      !!cat_prod && formData.append("cat_prod", JSON.stringify(cat_prod));
      files?.forEach((item) => {
        formData.append("files", item.file, item.file.name);
      });
      return apiClient
        .post({
          url: "/request",
          body: formData,
          params: {
            product,
            description,
            category_id,
            fillial_id,
            factory,
            size,
            arrival_date,
            bread_size,
          },
          config,
          contentType,
        })
        .then(({ data }) => data);
    },
    { onError: (e: Error) => errorToast(e.message) }
  );
};
export default requestMutation;
