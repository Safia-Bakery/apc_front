import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { UserTypes } from "src/utils/types";

const userMutation = () => {
  return useMutation(["create_user"], (body: UserTypes) =>
    apiClient
      .post({ url: `/brigada/vs/user`, body })
      .then(({ data }) => data)
      .catch((e) => e.message)
  );
};
export default userMutation;
