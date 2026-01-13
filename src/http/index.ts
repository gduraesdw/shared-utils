import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

/**
 * Configuration options for the HTTP client.
 */
export interface HttpClientConfig extends AxiosRequestConfig {
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onRequestError?: (error: AxiosError) => Promise<AxiosError>;
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onResponseError?: (error: AxiosError) => Promise<AxiosError>;
}

/**
 * Creates an HTTP client with configurable interceptors.
 * @param config - Configuration options including base URL and interceptors
 * @returns Configured Axios instance
 * @example
 * const client = createHttpClient({
 *   baseURL: 'https://api.example.com',
 *   onRequest: (config) => {
 *     config.headers.Authorization = `Bearer ${token}`;
 *     return config;
 *   }
 * });
 */
export function createHttpClient(config: HttpClientConfig = {}): AxiosInstance {
  const { onRequest, onRequestError, onResponse, onResponseError, ...axiosConfig } = config;

  const instance = axios.create(axiosConfig);

  // Request interceptor
  if (onRequest || onRequestError) {
    instance.interceptors.request.use(
      onRequest || ((config) => config),
      onRequestError || ((error) => Promise.reject(error))
    );
  }

  // Response interceptor
  if (onResponse || onResponseError) {
    instance.interceptors.response.use(
      onResponse || ((response) => response),
      onResponseError || ((error) => Promise.reject(error))
    );
  }

  return instance;
}

/**
 * Default HTTP client instance with common configurations.
 */
export const httpClient = createHttpClient({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * GET request helper.
 * @param url - Request URL
 * @param config - Axios request configuration
 * @returns Promise with response data
 * @example
 * const data = await get<User>('/users/1');
 */
export async function get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await httpClient.get<T>(url, config);
  return response.data;
}

/**
 * POST request helper.
 * @param url - Request URL
 * @param data - Request body data
 * @param config - Axios request configuration
 * @returns Promise with response data
 * @example
 * const user = await post<User>('/users', { name: 'John' });
 */
export async function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.post<T>(url, data, config);
  return response.data;
}

/**
 * PUT request helper.
 * @param url - Request URL
 * @param data - Request body data
 * @param config - Axios request configuration
 * @returns Promise with response data
 * @example
 * const user = await put<User>('/users/1', { name: 'Jane' });
 */
export async function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.put<T>(url, data, config);
  return response.data;
}

/**
 * PATCH request helper.
 * @param url - Request URL
 * @param data - Request body data
 * @param config - Axios request configuration
 * @returns Promise with response data
 * @example
 * const user = await patch<User>('/users/1', { email: 'new@example.com' });
 */
export async function patch<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.patch<T>(url, data, config);
  return response.data;
}

/**
 * DELETE request helper.
 * @param url - Request URL
 * @param config - Axios request configuration
 * @returns Promise with response data
 * @example
 * await del('/users/1');
 */
export async function del<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await httpClient.delete<T>(url, config);
  return response.data;
}
