import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

interface RegisterTypes {
  id: number | string;
  username: string;
  full_name: string;
  success: boolean;
}

const registerMutation = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (body: {
      username: string;
      password: string;
      full_name: string;
    }) =>
      baseApi
        .post("/register", body)
        .then(({ data }) => data as unknown as RegisterTypes),
  });
};
export default registerMutation;
