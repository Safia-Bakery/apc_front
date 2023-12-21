import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

const branchMutation = () => {
  return useMutation(
    ["handle_branch"],
    (body: {
      name: string;
      longtitude: number;
      id?: string;
      latitude: number;
      country?: string;
      status: number;
      is_fabrica?: boolean;
    }) => {
      if (!body.id)
        return apiClient
          .post({ url: "/fillials", body })
          .then(({ data }) => data);
      else
        return apiClient
          .put({ url: "/fillials", body })
          .then(({ data }) => data);
    },
    { onError: (e: Error) => errorToast(e.message) }
  );
};
export default branchMutation;
