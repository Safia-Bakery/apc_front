import { errorToast } from "@/utils/toast";
import axios from "axios";

const axiosInstance = axios.create();
let cancelToken: any;

axiosInstance.interceptors.request.use(
  (config) => {
    if (cancelToken) {
      cancelToken.cancel("Canceling previous request");
    }

    config.cancelToken = new axios.CancelToken((c) => {
      cancelToken = c;
    });

    return config;
  },
  (error) => errorToast(error)
);

export default axiosInstance;
