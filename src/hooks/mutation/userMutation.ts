import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";

interface Body {
  password?: string;
  username?: string;
  full_name?: string;
  email?: string;
  status?: number;
  phone_number?: number;
  group_id?: number;
  brigada_id?: number;
  telegram_id?: number;
  user_id?: number;
  sphere_status?: number;
}

const userMutation = () => {
  return useMutation({
    mutationKey: ["create_update_user"],
    mutationFn: (body: Body) => {
      if (body.user_id)
        return baseApi.put("/users", body).then((res) => {
          return res;
        });
      return baseApi.post("/register", body).then((res) => {
        if (res.status === 200) return res;
      });
    },
    retry: 3,
    retryDelay: 2000,
    onError: (e: any) =>
      errorToast(e.response?.data.detail ? e.response?.data.detail : e.message),
  });
};
export default userMutation;
