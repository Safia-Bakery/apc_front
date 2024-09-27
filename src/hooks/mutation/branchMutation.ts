import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";

type Body = {
  name: string;
  longtitude: number;
  id?: string;
  latitude: number;
  country?: string;
  status: number;
  is_fabrica?: boolean;
};

const branchMutation = () => {
  return useMutation({
    mutationKey: ["handle_branch"],
    mutationFn: (body: Body) => {
      if (!body.id)
        return baseApi.post("/fillials", body).then(({ data }) => data);
      else return baseApi.put("/fillials", body).then(({ data }) => data);
    },
    onError: (e) => errorToast(e.message),
  });
};
export default branchMutation;
