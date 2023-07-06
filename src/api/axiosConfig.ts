import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import { Store } from "redux";
import { RootState } from "src/redux/rootConfig";

class BaseAPIClient {
  private axiosInstance: AxiosInstance;
  private cancelTokenSource: CancelTokenSource;
  private store?: Store<RootState>;

  constructor(baseURL: string, store?: Store<RootState>) {
    this.cancelTokenSource = axios.CancelToken.source();
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 5000, // Set your desired timeout value
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

  private handleRequestError = (error: any): Promise<never> => {
    return Promise.reject(error);
  };

  public get<T>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get<T>(url, config);
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public cancelRequest(message?: string): void {
    this.cancelTokenSource.cancel(message);
  }
}

export default BaseAPIClient;
