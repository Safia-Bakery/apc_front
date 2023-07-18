import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { errorToast } from "src/utils/toast";

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
          .put({
            url: "/brigadas",
            body: { name, id, description, status, users },
          })
          .then(({ data }) => data);
      else
        return apiClient
          .post({ url: "/brigadas", body: { name, description, status } })
          .then(({ data }) => data);
    },
    { onError: (e: Error) => errorToast(e.message) }
  );
};
export default brigadaMutation;
