import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

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
        return apiClient
          .post({ url: "/fillials", body })
          .then(({ data }) => data);
      else
        return apiClient
          .put({ url: "/fillials", body })
          .then(({ data }) => data);
    },
    onError: (e) => errorToast(e.message),
  });
};
export default branchMutation;
