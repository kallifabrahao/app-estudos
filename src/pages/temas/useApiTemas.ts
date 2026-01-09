import { useClient } from "@/client";
import { useTemas } from "./useTemas";

export const useApiTemas = () => {
  const { dataTemas, conteudo, manipularRespostaCriacaoTema } = useTemas();

  const obterTemas = async () => {
    const resposta = await useClient.get("/temas");

    dataTemas.value = resposta.data;
  };

  const criarTema = async () => {
    await useClient.post("/temas", conteudo.value);

    await manipularRespostaCriacaoTema(obterTemas);
  };

  const deletarTema = async (idTema: string) => {
    await useClient.delete(`/temas/${idTema}`);
    await manipularRespostaCriacaoTema(obterTemas);
  };

  const atualizarTema = async (idTema: string) => {
    await useClient.put(`/temas/${idTema}`, conteudo.value);
    await manipularRespostaCriacaoTema(obterTemas);
  };

  return {
    obterTemas,
    criarTema,
    deletarTema,
    atualizarTema,
  };
};
