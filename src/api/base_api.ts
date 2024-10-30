import axios, { AxiosInstance, AxiosResponse } from "axios";
import { store } from "@/store/rootConfig";
import { logoutHandler } from "@/store/reducers/auth";
import { baseURL } from "@/store/baseUrl";
import { EPresetTimes } from "@/utils/types";

const logoutObj: { [key: number]: boolean } = {
  401: true,
  403: true, // do not wait too many times when users token has been expired
};

const baseApi: AxiosInstance = axios.create({
  baseURL,
  timeout: EPresetTimes.MINUTE * 2,
});

baseApi.interceptors.request.use(
  (config) => {
    const token = store.getState()?.auth.token;

    if (config.headers) {
      const defaultHeaders: any = {
        ["Access-Control-Allow-Origin"]: "*",
        ...(!!token && { Authorization: `Bearer ${token}` }),
      };
      config.headers = { ...config.headers, ...defaultHeaders };
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

baseApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (
      logoutObj[error?.response?.status] &&
      !window.location.pathname.includes("/tg/")
    ) {
      store?.dispatch(logoutHandler());
    }

    if (
      logoutObj[error.response.status!] &&
      window.location.pathname.includes("/tg/")
    )
      window.location.replace("/tg/unauthorized");

    return Promise.reject(error);
  }
);

export default baseApi;
