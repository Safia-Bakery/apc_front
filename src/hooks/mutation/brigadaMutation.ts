import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";

interface BodyType {
  id?: number;
  name: string;
  description: string;
  status?: number;
  users?: number[];
}

const brigadaMutation = () => {
  return useMutation(
    ["update_brigada"],
    ({ id, name, description, status, users }: BodyType) => {
      if (id)
        return apiClient
          .put(`/brigadas`, { name, id, description, status, users })
          .then(({ data }) => data);
      else
        return apiClient
          .post({ url: `/brigadas`, body: { name, description, status } })
          .then(({ data }) => data);
    }
  );
};
export default brigadaMutation;
