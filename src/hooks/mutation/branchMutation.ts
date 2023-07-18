import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { errorToast } from "src/utils/toast";

const branchMutation = () => {
  return useMutation(
    ["handle_branch"],
    (body: {
      name: string;
      longtitude: number;
      id?: number;
      latitude: number;
      country?: string;
      status: number;
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
