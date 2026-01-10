import axios, { type AxiosInstance } from "axios";
import { useLoading } from "@/components/loading/useLoading";
import { useRespostaApi } from "@/utils/manipularRespotasApi";

const { ativarLoading, desativarLoading } = useLoading();

const obterPathname = (url?: string): string => {
  if (!url) return "";

  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

const isRotaIgnorada = (url?: string): boolean => {
  if (!url) return false;

  const pathname = obterPathname(url);

  const rotasIgnoradas = [
    /^\/texto$/,
    /^\/frases$/,
    /^\/texto\/[^/]+$/,
    /^\/frases\/[^/]+$/,
    /^\/audios\/[^/]+$/,
  ];

  return rotasIgnoradas.some((regex) => regex.test(pathname));
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const ignorarLoading = isRotaIgnorada(config.url);

  if (!ignorarLoading) {
    ativarLoading();
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const ignorarLoading = isRotaIgnorada(response.config.url);

    if (!ignorarLoading) desativarLoading();

    return response;
  },
  (error) => {
    useRespostaApi(error.response?.status, error);

    const ignorarLoading = isRotaIgnorada(error.config?.url);

    if (!ignorarLoading) desativarLoading();

    return Promise.reject(error);
  }
);

export const useClient = api;
