import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";

interface Body {
  id: string;
  origin: number;
}

const branchDepartmentMutation = () => {
  return useMutation({
    mutationKey: ["expenditure_sync"],
    mutationFn: (body: Body) =>
      baseApi
        .put("/deparment/update", body)
        .then((data) => data)
        .catch((e: Error) => errorToast(e.message)),
  });
};
export default branchDepartmentMutation;
