import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";

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
        return apiClient.post("/fillials", body).then(({ data }) => data);
      else return apiClient.put("/fillials", body).then(({ data }) => data);
    }
  );
};
export default branchMutation;
