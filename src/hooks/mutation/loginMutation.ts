import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";

interface LoginTypes {
  access_token: string;
  token_type: string;
  status_user: string;
  success: boolean;
}

const loginMutation = () => {
  return useMutation(
    ["login"],
    ({ username, password }: { username: string; password: string }) =>
      apiClient
        .post("/login", { username, password })
        .then(({ data }) => data as unknown as LoginTypes)
  );
};
export default loginMutation;
