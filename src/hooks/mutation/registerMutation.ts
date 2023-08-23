import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";

interface RegisterTypes {
  id: number | string;
  username: string;
  full_name: string;
  success: boolean;
}

const registerMutation = () => {
  return useMutation(
    ["register"],
    (body: { username: string; password: string; full_name: string }) =>
      apiClient
        .post({ url: "/register", body })
        .then(({ data }) => data as unknown as RegisterTypes)
  );
};
export default registerMutation;
