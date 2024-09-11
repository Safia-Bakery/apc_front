import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";
import { EPresetTimes } from "@/utils/types";

const syncExpenditure = () => {
  return useMutation({
    mutationKey: ["expenditure_sync"],
    mutationFn: (body: { request_id: number }) =>
      apiClient
        .put({
          url: "/v1/expanditure/iiko",
          body,
          config: { timeout: EPresetTimes.MINUTE * 5 },
        })
        .then((data) => data)
        .catch((e: Error) => errorToast(e.message)),
  });
};
export default syncExpenditure;
