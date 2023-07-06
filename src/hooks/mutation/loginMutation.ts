import { useMutation } from "@tanstack/react-query";
import apiClient from "src/api/baseAxios";

const loginMutation = () => {
  return useMutation(
    ["login"],
    ({ username, password }: { username: string; password: string }) =>
      apiClient
        .post("/login", { username, password })
        .then((data) => data as unknown as { access_token: string })
  );
};
export default loginMutation;
