import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";
import { EPresetTimes } from "@/utils/types";

const syncExpenditure = () => {
  return useMutation({
    mutationKey: ["expenditure_sync"],
    mutationFn: (body: { request_id: number }) =>
      baseApi
        .put("/v1/expanditure/iiko", body, { timeout: EPresetTimes.MINUTE * 4 })
        .then((data) => data)
        .catch((e) => errorToast(e.message)),
  });
};
export default syncExpenditure;
