import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

interface Body {
  request_id: number;
  comment: string;
  rating: number;
  user_id: number;
}

const commentMutation = () => {
  return useMutation({
    mutationKey: ["post_comment"],
    mutationFn: (body: Body) =>
      baseApi.post("/v1/comments", body).then(({ data }) => data),
  });
};
export default commentMutation;
