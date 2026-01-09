import axios, { type AxiosInstance } from "axios";
import { useLoading } from "@/components/loading/useLoading";
import { useRespostaApi } from "@/utils/manipularRespotasApi";

const { ativarLoading, desativarLoading } = useLoading();

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  ativarLoading();
  return config;
});

api.interceptors.response.use(
  (response) => {
    desativarLoading();
    return response;
  },
  (error) => {
    useRespostaApi(error.response?.status, error);
    desativarLoading();

    return Promise.reject(error);
  }
);

export const useClient = api;
