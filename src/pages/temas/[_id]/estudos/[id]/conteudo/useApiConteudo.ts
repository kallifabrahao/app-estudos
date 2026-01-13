import { useClient } from "@/client";
import { useConteudo } from "./useConteudo";
import type { AxiosResponse } from "axios";
import { useLoading } from "@/components/loading/useLoading";

export const useApiConteudo = () => {
  const {
    dataFrases,
    dataTextos,
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

  const obterTextos = async () => {
    const response = await useClient.get(`/texto/${idEstudoAtual.value}`);
    return response.data;
  };

  const deletarFrase = async (idFrase: string) => {
    ativarLoading();
    await useClient.delete(`/frases/${idFrase}`);
    await manipularRespostaCriacaoConteudo(true, obterFrases, obterTextos);
  };

  const deletarTexto = async (idTexto: string) => {
    ativarLoading();
    await useClient.delete(`/texto/${idTexto}`);
    await manipularRespostaCriacaoConteudo(true, obterFrases, obterTextos);
  };

  const atualizarTexto = async () => {
    try {
      ativarLoading();
      const formData = new FormData();
      formData.append("texto", conteudo.value.texto);

      if (conteudo.value.audioLongo) {
        formData.append("audio", conteudo.value.audioLongo);
      }

      await useClient.put(`/texto/${idConteudoAtual.value}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await manipularRespostaCriacaoConteudo(true, obterFrases, obterTextos);
    } catch (error) {
      desativarLoading();
    }
  };

  const atualizarFrases = async () => {
    try {
      ativarLoading();
      const formData = new FormData();

      formData.append("frase", conteudo.value.frase);

      if (conteudo.value.audioCurto) {
        formData.append("audio", conteudo.value.audioCurto);
      }

      await useClient.put(`/frases/${idConteudoAtual.value}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await manipularRespostaCriacaoConteudo(true, obterFrases, obterTextos);
    } catch (error) {
      desativarLoading();
    }
  };

  const criarFrase = async (): Promise<AxiosResponse> => {
    const formData = new FormData();

    formData.append("idLicao", idEstudoAtual.value);
    formData.append("frase", conteudo.value.frase);

    if (conteudo.value.audioCurto) {
      formData.append("audio", conteudo.value.audioCurto);
    }

    const resposta: AxiosResponse = await useClient.post("/frases", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return resposta;
  };

  const criarTexto = async (): Promise<AxiosResponse> => {
    const formData = new FormData();

    if (conteudo.value.audioLongo) {
      formData.append("audio", conteudo.value.audioLongo);
    }

    formData.append("idLicao", idEstudoAtual.value);
    formData.append("texto", conteudo.value.texto);

    const resposta: AxiosResponse = await useClient.post("/texto", formData, {
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
    dataFrases,
    dataTextos,
    idEstudoAtual,
    deletarTexto,
    deletarFrase,
    atualizarTexto,
    atualizarFrases,
    criarFrase,
    criarTexto,
    obterFrases,
    obterTextos,
    carregarAudio,
  };
};
