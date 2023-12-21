import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

interface Body {
  id: string;
  origin: number;
}

const branchDepartmentMutation = () => {
  return useMutation(["expenditure_sync"], (body: Body) =>
    apiClient
      .put({ url: "/deparment/update", body })
      .then((data) => data)
      .catch((e: Error) => errorToast(e.message))
  );
};
export default branchDepartmentMutation;
