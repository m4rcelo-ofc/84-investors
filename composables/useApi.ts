import axios, { type AxiosInstance } from "axios";

let apiInstance: AxiosInstance | null = null;

export const useApi = () => {
  const config = useRuntimeConfig();

  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: config.public.apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para adicionar token de autenticação
    apiInstance.interceptors.request.use((requestConfig) => {
      if (import.meta.client) {
        const token = localStorage.getItem("access_token");
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }
      return requestConfig;
    });
  }

  return apiInstance;
};
