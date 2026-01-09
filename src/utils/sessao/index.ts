import { useClient } from "@/client";
import { jwtDecode } from "jwt-decode";

const estaAutenticado = (): string => {
  return JSON.parse(localStorage.getItem("token") || "[]");
};

const setBearerAuthorization = () => {
  useClient.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${estaAutenticado()}`;
};

const setToken = (token: string) => {
  localStorage.setItem("token", JSON.stringify(token));
  window.location.href = "/temas";
};

const limparSessao = () => {
  localStorage.removeItem("token");
  useClient.defaults.headers.common["Authorization"] = "";
  window.location.href = "/login";
};

const getTokenInfo = () => {
  if (!localStorage.getItem("token")) {
    return {
      email: "",
      exp: 0,
      first_name: "",
      last_name: "",
    };
  }

  const decoded = jwtDecode(estaAutenticado()) as {
    exp: number;
    sub: string;
    first_name: string;
    last_name: string;
  };

  return {
    email: decoded.sub,
    exp: decoded.exp,
    firstName: decoded.first_name,
    lastName: decoded.last_name,
  };
};

const tokenExpirado = (): boolean => {
  const agora = Date.now();
  const expTempo = getTokenInfo().exp * 1000;
  return agora >= expTempo;
};

export const useSessao = () => {
  return {
    setToken,
    estaAutenticado,
    limparSessao,
    tokenExpirado,
    setBearerAuthorization,
    getTokenInfo,
  };
};
