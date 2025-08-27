import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosError,
} from "axios";

// Response wrapper interface
export interface ApiResponse<T = any> {
  status: number | null;
  data: T;
  statusText: string;
  success: boolean;
}

class ApiRequest {
  private baseURL: string;
  private axiosInstance: AxiosInstance;

  constructor(baseURL = "") {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      withCredentials: true, // Enable if needed
    });
  }

  // GET request
  async get<T = any>(
    endpoint: string,
    params: Record<string, any> = {},
    headers: AxiosRequestHeaders = {} as AxiosRequestHeaders,
    authRequired = false
  ): Promise<ApiResponse<T>> {
    if (authRequired) this.addAuthHeader(headers);
    try {
      const response = await this.axiosInstance.get<T>(endpoint, {
        params,
        headers,
      });
      return this.formatResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  // POST request
  async post<T = any>(
    endpoint: string,
    data: any = {},
    headers: AxiosRequestHeaders = {} as AxiosRequestHeaders,
    authRequired = false
  ): Promise<ApiResponse<T>> {
    if (authRequired) this.addAuthHeader(headers);
    try {
      const response = await this.axiosInstance.post<T>(endpoint, data, {
        headers,
      });
      return this.formatResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  // PUT request
  async put<T = any>(
    endpoint: string,
    data: any = {},
    headers: AxiosRequestHeaders = {} as AxiosRequestHeaders,
    authRequired = false
  ): Promise<ApiResponse<T>> {
    if (authRequired) this.addAuthHeader(headers);
    try {
      const response = await this.axiosInstance.put<T>(endpoint, data, {
        headers,
      });
      return this.formatResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  // DELETE request
  async delete<T = any>(
    endpoint: string,
    data: any = {},
    headers: AxiosRequestHeaders = {} as AxiosRequestHeaders,
    authRequired = false
  ): Promise<ApiResponse<T>> {
    if (authRequired) this.addAuthHeader(headers);
    try {
      const response = await this.axiosInstance.delete<T>(endpoint, {
        data,
        headers,
      });
      return this.formatResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  // Add Authorization header if token is available
  private addAuthHeader(headers: AxiosRequestHeaders): void {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Format response data
  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      status: response.status,
      data: response.data,
      statusText: response.statusText,
      success: true,
    };
  }

  // Handle errors and return structured response
  private handleError<T>(error: unknown): ApiResponse<T> {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<T>;
      if (axiosError.response) {
        return {
          status: axiosError.response.status,
          data: axiosError.response.data,
          statusText: axiosError.response.statusText,
          success: false,
        };
      } else if (axiosError.request) {
        return {
          status: null,
          data: axiosError.request as any,
          statusText: "No Response",
          success: false,
        };
      }
    }

    return {
      status: null,
      data: null as any,
      statusText: "Request Error",
      success: false,
    };
  }
}

export const instance = new ApiRequest(process.env.NEXT_PUBLIC_API_URL);
