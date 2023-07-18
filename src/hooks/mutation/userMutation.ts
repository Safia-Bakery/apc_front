import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { errorToast } from "src/utils/toast";
import { UserTypes } from "src/utils/types";

const userMutation = () => {
  return useMutation(
    ["create_update_user"],
    (body: UserTypes) => {
      if (body.id)
        return apiClient
          .put({ url: "/register", body })
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
          if (res.status === 200) return res;
        })
        .catch((e: Error) => errorToast(e.message));
    },
    { onError: (e: Error) => errorToast(e.message) }
  );
};
export default userMutation;
