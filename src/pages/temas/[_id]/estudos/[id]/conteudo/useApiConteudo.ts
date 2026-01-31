import { useClient } from "@/client";
import { useConteudo } from "./useConteudo";
import type { AxiosResponse } from "axios";
import { useLoading } from "@/components/loading/useLoading";

export const useApiConteudo = () => {
  const {
    idEstudoAtual,
    conteudo,
    idConteudoAtual,
    manipularRespostaCriacaoConteudo,
  } = useConteudo();

  const { ativarLoading, desativarLoading } = useLoading();

  const obterFrases = async () => {
    const response = await useClient.get(`/frases/${idEstudoAtual.value}`);
    return response.data;
  };

  const deletarFrase = async (idFrase: string) => {
    ativarLoading();
    await useClient.delete(`/frases/${idFrase}`);
    await manipularRespostaCriacaoConteudo(true, obterFrases);
  };

  const atualizarFrases = async () => {
    try {
      ativarLoading();
      const formData = new FormData();

      formData.append("frase", conteudo.value.frase);
      formData.append("inicioAudio", String(conteudo.value.inicioAudio));
      formData.append("fimAudio", String(conteudo.value.fimAudio));

      if (conteudo.value.audio) {
        formData.append("audio", conteudo.value.audio);
      }

      await useClient.put(`/frases/${idConteudoAtual.value}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await manipularRespostaCriacaoConteudo(true, obterFrases);
    } catch (error) {
      desativarLoading();
    }
  };

  const criarFrase = async (): Promise<AxiosResponse> => {
    const formData = new FormData();

    formData.append("idLicao", idEstudoAtual.value);
    formData.append("frase", conteudo.value.frase);

    if (conteudo.value.audio) {
      formData.append("audio", conteudo.value.audio);
    }

    const resposta: AxiosResponse = await useClient.post("/frases", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return resposta;
  };

  const carregarAudio = async (audioUrl: string) => {
    const response = await useClient.get(audioUrl, {
      responseType: "blob",
    });

    const blob = await response.data;
    return URL.createObjectURL(blob);
  };

  return {
    deletarFrase,
    atualizarFrases,
    criarFrase,
    obterFrases,
    carregarAudio,
  };
};
