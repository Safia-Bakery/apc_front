import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { UserTypes } from "src/utils/types";

const userMutation = () => {
  return useMutation(["create_update_user"], (body: UserTypes) => {
    if (body.id)
      return apiClient
        .put("/register", body)
        .then((res) => {
          if (res.status === 200) return res.data;
        })
        .catch((e) => e.message);
    return apiClient
      .post({
        url: "/register",
        body,
      })
      .then((res) => {
        if (res.status === 200) return res.data;
        else throw new Error("error");
      })
      .catch((e) => e.message);
  });
};
export default userMutation;
