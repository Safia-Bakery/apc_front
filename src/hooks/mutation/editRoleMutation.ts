import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";

const editRoleMutation = () => {
  return useMutation(["edit_role"], (body: { name: string; id: number }) =>
    apiClient.put("/user/roles", body).then(({ data }) => data)
  );
};
export default editRoleMutation;
