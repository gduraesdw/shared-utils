/**
 * Utilitários para requisições de API
 */

/**
 * Opções para requisições HTTP
 */
export interface RequestOptions extends RequestInit {
  timeout?: number;
  retry?: {
    maxRetries: number;
    baseDelay: number;
  };
  baseURL?: string;
}

/**
 * Wrapper para fetch com funcionalidades adicionais
 * @param url - URL da requisição
 * @param options - Opções da requisição
 * @returns Promise com a resposta
 */
export async function request<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeout = 30000, retry, baseURL = '', ...fetchOptions } = options;

  const fullURL = baseURL ? `${baseURL}${url}` : url;

  const executeRequest = async (): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(fullURL, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  if (retry) {
    return retryRequest(executeRequest, retry.maxRetries, retry.baseDelay);
  }

  return executeRequest();
}

/**
 * Retry de requisição com backoff exponencial
 * @param fn - Função de requisição
 * @param maxRetries - Número máximo de tentativas
 * @param baseDelay - Delay base em ms
 * @returns Promise com resultado
 */
async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelay: number
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Cliente HTTP com métodos convenientes
 */
export class HttpClient {
  private baseURL: string;
  private defaultOptions: RequestOptions;

  constructor(baseURL = '', defaultOptions: RequestOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = defaultOptions;
  }

  /**
   * GET request
   */
  async get<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, {
      ...this.defaultOptions,
      ...options,
      method: 'GET',
      baseURL: this.baseURL,
    });
  }

  /**
   * POST request
   */
  async post<T = unknown>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, {
      ...this.defaultOptions,
      ...options,
      method: 'POST',
      baseURL: this.baseURL,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, {
      ...this.defaultOptions,
      ...options,
      method: 'PUT',
      baseURL: this.baseURL,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, {
      ...this.defaultOptions,
      ...options,
      method: 'PATCH',
      baseURL: this.baseURL,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(url, {
      ...this.defaultOptions,
      ...options,
      method: 'DELETE',
      baseURL: this.baseURL,
    });
  }

  /**
   * Define headers padrão
   */
  setDefaultHeaders(headers: HeadersInit): void {
    this.defaultOptions.headers = {
      ...this.defaultOptions.headers,
      ...headers,
    };
  }

  /**
   * Define token de autorização
   */
  setAuthToken(token: string, type = 'Bearer'): void {
    this.setDefaultHeaders({
      Authorization: `${type} ${token}`,
    });
  }
}

/**
 * Constrói query params de um objeto
 * @param params - Objeto com parâmetros
 * @returns String de query params
 */
export function buildQueryParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

/**
 * Parse query params de uma URL
 * @param url - URL com query params
 * @returns Objeto com parâmetros
 */
export function parseQueryParams(url: string): Record<string, string | string[]> {
  const urlObj = new URL(url);
  const params: Record<string, string | string[]> = {};

  urlObj.searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  });

  return params;
}

/**
 * Interceptor de requisição
 */
export type RequestInterceptor = (
  url: string,
  options: RequestOptions
) => [string, RequestOptions] | Promise<[string, RequestOptions]>;

/**
 * Interceptor de resposta
 */
export type ResponseInterceptor = <T>(response: T) => T | Promise<T>;

/**
 * Cliente HTTP com interceptors
 */
export class InterceptableHttpClient extends HttpClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  /**
   * Adiciona interceptor de requisição
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Adiciona interceptor de resposta
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Executa requisição com interceptors
   */
  async request<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    let finalUrl = url;
    let finalOptions = options;

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      [finalUrl, finalOptions] = await interceptor(finalUrl, finalOptions);
    }

    let response = await super.get<T>(finalUrl, finalOptions);

    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    return response;
  }
}
