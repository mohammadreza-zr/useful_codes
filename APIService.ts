import { setUser, store } from "@store";
import { mapDataToSelectData } from "@utilities";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

type requestType = { type: "get" | "post" | "put" | "delete" | "patch" };

export interface IRes<R> {
  statusCode: number;
  status: boolean;
  message: string;
  data?: R;
  error?: any;
  loading: boolean;
  abortController: AbortController;
  header: any;
  selectOptions?: { label: string; value: string }[];
}

interface APIConfig extends AxiosRequestConfig {
  addToUrl?: string[];
  selectOptions?: [label: any, value: any];
  hideErrorMessage?: boolean;
  throwError?: boolean;
  /**
   * give body and process it and return
   * @param body
   * @returns returned function
   */
  beforeFunc?: (body: any) => any;
  /**
   * give response process it and return processed data
   * @param data server response
   * @returns processed data
   */
  afterFunc?: (data: any) => any;
  /**
   * give response process it and return processed data
   * @param data server response
   * @returns processed data
   */
  beforeSelectOptions?: (data: any) => any;
}

interface requestProps<T = any> {
  requestType: requestType;
  url: string;
  body?: T;
  config?: APIConfig;
}

class FetchError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}

export class API {
  private fetchingToken = false;
  private newAccessToken = "";
  private True = true;
  public dispatch = store.dispatch;
  public baseURL = import.meta.env.VITE_APP_BASE_URL + "/api/";
  public headers = {
    "Content-Type": "application/json",
    token: JSON.parse(localStorage.getItem("auth") || "{}")?.token || undefined,
    businessId: JSON.parse(localStorage.getItem("auth") || "{}")?.user?.businessId || undefined,
  };
  private head = {
    // withCredentials: true,
    baseURL: this.baseURL,
    headers: this.headers,
  };
  //Global Config. first one this configuration has been use.
  public axiosInstance: AxiosInstance = axios.create(this.head);

  constructor() {
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          const refreshToken =
            JSON.parse(localStorage.getItem("auth") || "{}")?.refreshToken || undefined;
          originalRequest._retry = true;
          if (refreshToken) {
            if (!this.fetchingToken) {
              this.fetchingToken = true;
              try {
                const response = await axios.post(this.baseURL + "authentication/refreshToken", {
                  refreshToken: refreshToken,
                });
                originalRequest.headers.token = response.data?.data?.token;
                this.newAccessToken = response.data?.data?.token;
                this.headers.token = response.data?.data?.token;
                this.dispatch(setUser(response.data?.data));
                this.fetchingToken = false;
                return this.axiosInstance(originalRequest);
              } catch (error) {
                localStorage.clear();
                window.location.href = "/auth/login";
              }
            } else {
              // wait for send other requests to give new access token
              while (this.True) {
                if (!this.fetchingToken) {
                  originalRequest.headers.token = this.newAccessToken;
                  return this.axiosInstance(originalRequest);
                }
                await new Promise((resolve) => setTimeout(resolve, 200));
              }
            }
          } else {
            localStorage.clear();
            window.location.href = "/auth/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async sendRequest<R, B = any>({
    requestType,
    url,
    body,
    config,
  }: requestProps<B>): Promise<IRes<R>> {
    let result: IRes<R> = {
      abortController: new AbortController(),
      loading: true,
      error: undefined,
      message: "",
      status: true,
      statusCode: 200,
      data: undefined as R,
      header: undefined,
      selectOptions: undefined,
    };

    try {
      this.headers.token = JSON.parse(localStorage.getItem("auth") || "{}")?.token || undefined;
      this.headers.businessId =
        JSON.parse(localStorage.getItem("auth") || "{}")?.user?.businessId || undefined;

      config = {
        ...this.head,
        ...config,
        headers: {
          ...this.headers,
          ...config?.headers,
        },
        signal: result.abortController.signal,
      };

      if (config.beforeFunc) {
        body = config.beforeFunc(body);
      }

      //body or config, because second parameter in [get,delete] is undefined and axios don't give it.
      body = body ? body : (config as any);

      //add more path to url like this: `/url/${path1}/${path2}`
      url = config.addToUrl ? `${url.replace(/\/$/, "")}/${config.addToUrl.join("/")}` : url;

      const data = await this.axiosInstance[requestType.type](url, body, config);

      let selectOptionsData = data?.data?.data ? data?.data?.data : data?.data || "";
      if (config.beforeSelectOptions) {
        selectOptionsData = config.beforeSelectOptions(selectOptionsData);
      }

      const selectOptions =
        config.selectOptions && config.selectOptions.length > 0
          ? mapDataToSelectData<R>(
              selectOptionsData?.list
                ? selectOptionsData?.list
                : selectOptionsData
                ? selectOptionsData
                : [],
              ...config.selectOptions
            )
          : [];

      let resultData = data?.data?.data ? data?.data?.data : data?.data || "";
      if (config?.afterFunc) {
        resultData = config.afterFunc(resultData);
      }

      result = {
        ...result,
        statusCode: data?.data?.statusCode || 400,
        status: data?.data?.status,
        message: data?.data?.message || "",
        data: resultData,
        loading: false,
        header: data?.headers,
        selectOptions: selectOptions,
      };
    } catch (error: any) {
      let errorMessage: string =
        error.response?.data?.message ?? error?.message ?? "Error from the Server!";
      const statusCode: number =
        error?.response?.data?.statusCode ?? error?.request?.statusCode ?? 500;

      if (errorMessage === "Network Error") {
        errorMessage = "خطا در ارتباط با شبکه";
      }

      if (!config?.hideErrorMessage && statusCode !== 401) toast.error(errorMessage);

      result = {
        ...result,
        statusCode: statusCode,
        status: false,
        message: errorMessage,
        loading: false,
        error: error,
        header: error?.response?.headers,
      };
    }

    if (result.statusCode >= 500 && config?.throwError) {
      throw new FetchError(result.message, result.statusCode);
    }

    return result;
  }

  /**
   * Get Request
   * @param {string} url - first for URL
   * @param {APIConfig} config - second for more config, optional!
   * @returns {Promise<IRes<R>>} anything server returned
   */
  public async get<R = any>(url: string, config?: APIConfig): Promise<IRes<R>> {
    return this.sendRequest<R>({
      requestType: { type: "get" },
      url,
      config,
    });
  }

  /**
   * Post Request
   * @param {string} url - first for URL
   * @param {B} body - second for body
   * @param {APIConfig} config - third for more config, optional!
   * @returns {Promise<IRes<R>>} anything server returned
   */
  public async post<R = any, B = any>(url: string, body: B, config?: APIConfig): Promise<IRes<R>> {
    return this.sendRequest<R, B>({
      requestType: { type: "post" },
      url,
      body,
      config,
    });
  }

  /**
   * Put Request
   * @param {string} url - first for URL
   * @param {B} body - second for body
   * @param {APIConfig} config - third for more config, optional!
   * @returns {Promise<IRes<R>>} anything server returned
   */
  public async put<R = any, B = any>(url: string, body: B, config?: APIConfig): Promise<IRes<R>> {
    return this.sendRequest<R, B>({
      requestType: { type: "put" },
      url,
      body,
      config,
    });
  }

  /**
   * Patch Request
   * @param {string} url - first for URL
   * @param {B} body - second for body
   * @param {APIConfig} config - third for more config, optional!
   * @returns {Promise<IRes<R>>} anything server returned
   */
  public async patch<R = any, B = any>(url: string, body: B, config?: APIConfig): Promise<IRes<R>> {
    return this.sendRequest<R, B>({
      requestType: { type: "patch" },
      url,
      body,
      config,
    });
  }

  /**
   * Delete Request
   * @param {string} url - first for URL
   * @param {APIConfig} config - third for more config, optional!
   * @returns {Promise<IRes<R>>} anything server returned
   */
  public async delete<R = any>(url: string, config?: APIConfig): Promise<IRes<R>> {
    return this.sendRequest<R>({
      requestType: { type: "delete" },
      url,
      config,
    });
  }
}

export const apiService = new API();
