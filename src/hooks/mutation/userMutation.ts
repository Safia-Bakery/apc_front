import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";
import { errorToast } from "src/utils/toast";
import { UserTypes } from "src/utils/types";

interface Body {
  password: string;
  username: string;
  full_name: string;
  email?: string;
  status: number;
  phone_number: number;
  group_id: number;
  brigada_id?: number;
  telegram_id?: number;
  user_id?: number;
}

const userMutation = () => {
  return useMutation(
    ["create_update_user"],
    (body: Body) => {
      if (body.user_id)
        return apiClient
          .put({ url: "/users", body })
          .then((res) => {
            if (res.status === 200) return res;
          })
          .catch((e) => errorToast(e.message));
      return apiClient
        .post({
          url: "/register",
          body,
        })
        .then((res) => {
          if (res.status === 200) return res;
        });
      // .catch((e: Error) => errorToast(e.message));
    },
    {
      onError: (e: any) =>
        errorToast(
          e.response?.data.detail ? e.response?.data.detail : e.message
        ),
    }
  );
};
export default userMutation;
