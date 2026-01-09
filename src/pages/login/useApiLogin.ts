import { useLogin } from "./useLogin";
import { useClient } from "@/client/index";
import { useSessao } from "@/utils/sessao";

export const useApiLogin = () => {
  const { usuario } = useLogin();
  const { setToken } = useSessao();

  const login = async () => {
    const resposta = await useClient("/login", {
      data: usuario.value,
      method: "post",
    });

    if (resposta.status === 200) {
      setToken(resposta.data.token);
    }
  };

  return {
    login,
  };
};
