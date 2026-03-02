import axios, { type AxiosInstance } from "axios";

let apiInstance: AxiosInstance | null = null;

export const useApi = () => {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    apiInstance.interceptors.request.use((requestConfig) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
      return requestConfig;
    });
  }

  return apiInstance;
};
