import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";
import { errorToast } from "src/utils/toast";
import { Departments } from "src/utils/types";

interface BodyType {
  id?: number;
  name: string;
  description: string;
  status?: number;
  users?: number[];
  sphere_status?: number;
  department?: Departments;
}

const brigadaMutation = () => {
  return useMutation(
    ["update_brigada"],
    ({
      id,
      name,
      description,
      status,
      users,
      sphere_status,
      department,
    }: BodyType) => {
      if (id)
        return apiClient
          .put({
            url: "/brigadas",
            body: {
              name,
              id,
              description,
              status,
              users,
              sphere_status,
              department,
            },
          })
          .then(({ data }) => data);
      else
        return apiClient
          .post({
            url: "/brigadas",
            body: { name, description, status, sphere_status, department },
          })
          .then(({ data }) => data);
    },
    { onError: (e: Error) => errorToast(e.message) }
  );
};
export default brigadaMutation;
