import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

interface LoginTypes {
  access_token: string;
  token_type: string;
  status_user: string;
  success: boolean;
}

const loginMutation = () => {
  const contentType = "application/x-www-form-urlencoded";

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (body: { username: string; password: string }) =>
      apiClient
        .post({ url: "/login", body, contentType })
        .then(({ data }) => data as unknown as LoginTypes),

    onError: (e) => errorToast(e.message),
    retry: 3,
    retryDelay: 1000,
  });
};
export default loginMutation;
