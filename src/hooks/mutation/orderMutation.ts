import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { errorToast } from "src/utils/toast";

const orderMutation = () => {
  const contentType = "multipart/form-data";

  return useMutation(
    ["create_order"],
    ({
      urgent,
      product,
      description,
      category_id,
      fillial_id,
      files,
    }: {
      urgent: boolean;
      product: string;
      description: string;
      category_id: number;
      fillial_id: number;
      files: any;
    }) =>
      apiClient
        .post({
          url: "/request",
          body: files,
          params: {
            urgent,
            product,
            description,
            category_id,
            fillial_id,
          },
          contentType,
        })
        .then(({ data }) => data),
    { onError: (e: Error) => errorToast(e.message) }
  );
};
export default orderMutation;