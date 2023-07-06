import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelTokenSource,
} from "axios";

interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  message: string;
  code: number;
}

class APIClient {
  private api: AxiosInstance;
  private cancelTokenSource: CancelTokenSource;
  private token: string | undefined;

  constructor(baseURL: string, token: string | undefined) {
    this.api = axios.create({ baseURL });
    this.cancelTokenSource = axios.CancelToken.source();
    this.token = token;
    //@ts-ignore
    this.api.interceptors.request.use((config) =>
      this.addTokenToHeaders(config)
    );
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(
      url,
      this.addCancelTokenToConfig(config)
    );
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(
      url,
      data,
      this.addCancelTokenToConfig(config)
    );
    return response.data;
  }

  private addCancelTokenToConfig(
    config?: AxiosRequestConfig
  ): AxiosRequestConfig {
    return {
      ...config,
      cancelToken: this.cancelTokenSource.token,
    };
  }

  private addTokenToHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${this.token}`,
    };
    return config;
  }

  cancelRequest(): void {
    this.cancelTokenSource.cancel("Request canceled by user.");
    this.cancelTokenSource = axios.CancelToken.source();
  }
}

export default APIClient;
