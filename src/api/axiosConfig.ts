import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import { Store } from "redux";
import { logoutHandler } from "reducers/auth";
import { RootState } from "@/store/rootConfig";
import { EPresetTimes } from "@/utils/types";

const unauthorizedObj: { [key: number]: boolean } = {
  403: true,
  401: true,
};

interface BaseUrlParams {
  url: string;
  body?: any;
  params?: object;
  config?: AxiosRequestConfig;
  contentType?: string;
}

class BaseAPIClient {
  private axiosInstance: AxiosInstance;
  private cancelTokenSource: CancelTokenSource;
  private store?: Store<RootState>;

  constructor(baseURL: string, store?: Store<RootState>) {
    this.cancelTokenSource = axios.CancelToken.source();
    this.axiosInstance = axios.create({
      baseURL,
      timeout: EPresetTimes.MINUTE,
    });
    this.store = store;

    this.axiosInstance.interceptors.request.use(
      this.handleRequestSuccess,
      this.handleRequestError
    );
  }

  private handleRequestSuccess = (config: any): any => {
    const state = this.store?.getState();
    const token = state?.auth.token;

    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
    // this.store?.dispatch(logoutHandler());
    config.cancelToken = this.cancelTokenSource.token;
    return config;
  };

  private handleRequestError = (error: AxiosError): Promise<never> => {
    if (axios.isAxiosError(error) && error.response) {
      if (
        unauthorizedObj[error.response.status!] &&
        window.location.pathname.includes("/tg/")
      )
        window.location.replace("/tg/unauthorized");

      if (
        unauthorizedObj[error.response.status!] &&
        !window.location.pathname.includes("/tg/")
      )
        this.store?.dispatch(logoutHandler());
    }

    // Reject the promise with the error
    return Promise.reject(error);
  };
  private addAuthorizationHeader(
    config: AxiosRequestConfig
  ): AxiosRequestConfig {
    const state = this.store?.getState();
    const token = state?.auth.token;

    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  }

  public async get<T>({ url, params, config }: BaseUrlParams) {
    try {
      const fullUrl = this.buildUrlWithParams(url, params);
      config = config || {};
      config = this.addAuthorizationHeader(config);

      const response = await this.axiosInstance.get<T>(fullUrl, config);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (
          unauthorizedObj[error.response.status!] &&
          !window.location.pathname.includes("/tg/")
        ) {
          this.store?.dispatch(logoutHandler());
        }

        if (
          unauthorizedObj[error.response.status!] &&
          window.location.pathname.includes("/tg/")
        )
          window.location.replace("/tg/unauthorized");
      }
      throw error;
    }
  }

  public post<T>({
    url,
    body,
    params,
    config,
    contentType = "application/json",
  }: BaseUrlParams) {
    const fullUrl = this.buildUrlWithParams(url, params);
    config = config || {};
    config.headers = {
      ...(config.headers || {}),
      "Content-Type": contentType,
    };
    return this.axiosInstance.post<T>(fullUrl, body, config);
  }

  public delete<T>({ url, body, params }: BaseUrlParams) {
    const fullUrl = this.buildUrlWithParams(url, params);
    return this.axiosInstance.delete<T>(fullUrl, body);
  }

  public put<T>({
    url,
    body,
    params,
    config,
    contentType = "application/json",
  }: BaseUrlParams) {
    const fullUrl = this.buildUrlWithParams(url, params);
    config = config || {};
    config.headers = {
      ...(config.headers || {}),
      "Content-Type": contentType,
    };
    return this.axiosInstance.put<T>(fullUrl, body, config);
  }

  public cancelRequest(message?: string): void {
    this.cancelTokenSource.cancel(message);
  }

  private buildUrlWithParams(url: string, params?: object): string {
    if (!params) {
      return url;
    }

    const queryParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    if (url.includes("?")) {
      return `${url}&${queryParams}`;
    } else {
      return `${url}?${queryParams}`;
    }
  }
}

export default BaseAPIClient;
