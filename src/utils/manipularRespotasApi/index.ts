import type { AxiosError } from "axios";
import { useNotificacoes } from "@/utils/notificacoes";
import { useSessao } from "../sessao";

interface IError {
  detail: string;
}

export const useRespostaApi = (statusCode: number, res?: AxiosError) => {
  const { notificar } = useNotificacoes();
  const { limparSessao } = useSessao();
  const respostasApi = {
    201: () => {
      notificar("SUCCESS", 3000, "Operação realizada com sucesso");
    },

    400: () => {
      ///@ts-ignore
      if (res?.response?.data?.detail?.message == "HAND_NOT_RECOGNIZED") {
        notificar("ERROR", 5000, "Imagem não reconhecida, tente novamente.");
        return;
      }

      notificar("ERROR", 5000, "Esse email já está cadastrado");
    },

    401: () => {
      const error = res?.response?.data as IError;

      const mensagemErro =
        error.detail == "Incorrect email or password"
          ? "E-mail ou senha incorretos"
          : "Usuário não autenticado";

      notificar("ERROR", 5000, mensagemErro);

      if (mensagemErro == "Usuário não autenticado") {
        setTimeout(() => {
          limparSessao();
        }, 2000);
      }
    },

    403: () => {
      notificar(
        "ERROR",
        5000,
        "Credienciais inválidas, por favor, verifique o e-mail e senha digitados."
      );
    },

    500: () => {
      notificar(
        "ERROR",
        5000,
        "Erro interno do servidor, tente novamente mais tarde"
      );
    },

    default: () => {
      notificar("ERROR", 5000, "Algo deu errado, tente novamente mais tarde");
    },
  };

  const respostas =
    statusCode in respostasApi
      ? respostasApi[statusCode as keyof typeof respostasApi]
      : respostasApi.default;

  if (respostas) respostas();
};
