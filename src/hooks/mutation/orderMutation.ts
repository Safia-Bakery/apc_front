import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";
import { errorToast } from "src/utils/toast";

interface Body {
  product?: string;
  description: string;
  size?: string;
  category_id: number;
  fillial_id: string;
  files: any;
  factory?: boolean;
  arrival_date?: string;
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
    }: Body) =>
      apiClient
        .post({
          url: "/request",
          body: files,
          params: {
            product,
            description,
            category_id,
            fillial_id,
            factory,
            size,
            arrival_date,
          },
          config,
          contentType,
        })
        .then(({ data }) => data),
    { onError: (e: Error) => errorToast(e.message) }
  );
};
export default requestMutation;
