import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Create a proper mock for axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HTTP utilities', () => {
  let mockInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock instance
    mockInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
      },
    } as any;

    mockedAxios.create.mockReturnValue(mockInstance);
  });

  describe('createHttpClient', () => {
    it('should create axios instance with default config', () => {
      const { createHttpClient } = require('../http');
      createHttpClient({ baseURL: 'https://api.example.com' });

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.example.com',
        })
      );
    });

    it('should create axios instance without interceptors', () => {
      const { createHttpClient } = require('../http');
      createHttpClient({ baseURL: 'https://api.example.com' });

      expect(mockInstance.interceptors.request.use).not.toHaveBeenCalled();
      expect(mockInstance.interceptors.response.use).not.toHaveBeenCalled();
    });

    it('should setup request interceptors when provided', () => {
      const { createHttpClient } = require('../http');
      const onRequest = jest.fn((config) => config);
      const onRequestError = jest.fn();

      createHttpClient({ onRequest, onRequestError });

      expect(mockInstance.interceptors.request.use).toHaveBeenCalledWith(
        onRequest,
        onRequestError
      );
    });

    it('should setup only request interceptor without error handler', () => {
      const { createHttpClient } = require('../http');
      const onRequest = jest.fn((config) => config);

      createHttpClient({ onRequest });

      expect(mockInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('should setup response interceptors when provided', () => {
      const { createHttpClient } = require('../http');
      const onResponse = jest.fn((response) => response);
      const onResponseError = jest.fn();

      createHttpClient({ onResponse, onResponseError });

      expect(mockInstance.interceptors.response.use).toHaveBeenCalledWith(
        onResponse,
        onResponseError
      );
    });

    it('should setup only response interceptor without error handler', () => {
      const { createHttpClient } = require('../http');
      const onResponse = jest.fn((response) => response);

      createHttpClient({ onResponse });

      expect(mockInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });
});
