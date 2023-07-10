import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";

interface LoginTypes {
  access_token: string;
  token_type: string;
  status_user: string;
  success: boolean;
}

const loginMutation = () => {
  const options = {
    headers: { "content-type": "application/x-www-form-urlencoded" },
  };

  return useMutation(
    ["login"],
    (body: { username: string; password: string }) =>
      apiClient
        .post("/login", body, options)
        .then(({ data }) => data as unknown as LoginTypes)
  );
};
export default loginMutation;
