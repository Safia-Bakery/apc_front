import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

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
      apiClient.post({ url: "/v1/comments", body }).then(({ data }) => data),
  });
};
export default commentMutation;
