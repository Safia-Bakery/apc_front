import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import { Store } from "redux";
import { RootState } from "src/redux/rootConfig";

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
      timeout: 3000,
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
    config.cancelToken = this.cancelTokenSource.token;
    return config;
  };

  private handleRequestError = (e: Error): Promise<never> => {
    return Promise.reject(e);
  };

  public get<T>(url: string, params?: object, config?: AxiosRequestConfig) {
    const fullUrl = this.buildUrlWithParams(url, params);
    return this.axiosInstance.get<T>(fullUrl, config);
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

  public put<T>({
    url,
    body,
    params,
    config,
    contentType = "application/json",
  }: BaseUrlParams) {
    const fullUrl = this.buildUrlWithParams(url, params);
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
      .filter(([_, value]) => value !== undefined) // Exclude undefined parameters
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
