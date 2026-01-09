import { useClient } from "@/client";
import { useEstudos } from "./useEstudos";
import type { IRespostaEstudos } from "./interfaces";
import { useNotificacoes } from "@/utils/notificacoes";

export const useApiEstudos = () => {
  const { notificar } = useNotificacoes();

  const { dataEstudos, idTemaAtual, estudo, manipularRespostaCriacaoEstudo } =
    useEstudos();

  const buscarEstudos = async (status = "estudando") => {
    const resposta: IRespostaEstudos = await useClient.get(
      `/licoes/${idTemaAtual.value}`,
      {
        params: {
          status,
        },
      }
    );

    if (resposta.data.length > 0) {
      dataEstudos.value = resposta.data;

      return;
    }

    notificar("ERROR", 5000, "Não há dados para exibir");
    dataEstudos.value = [];
  };

  const criarEstudo = async () => {
    await useClient.post("/licoes", {
      idTema: idTemaAtual.value,
      titulo: estudo.value.titulo,
      descricao: estudo.value.descricao,
    });

    await manipularRespostaCriacaoEstudo(buscarEstudos);
  };

  const atualizarEstudo = async (idEstudo: string) => {
    await useClient.put(`/licoes/${idEstudo}`, {
      titulo: estudo.value.titulo,
      descricao: estudo.value.descricao,
    });

    await manipularRespostaCriacaoEstudo(buscarEstudos);
  };

  const atualizarStatusEstudo = async (idEstudo: string, status: string) => {
    await useClient.patch(`/licoes/${idEstudo}/status`, {
      status,
    });

    await buscarEstudos();
  };

  const deletarEstudo = async (idEstudo: string) => {
    await useClient.delete(`/licoes/${idEstudo}`);
    await manipularRespostaCriacaoEstudo(buscarEstudos);
  };

  return {
    buscarEstudos,
    criarEstudo,
    atualizarEstudo,
    deletarEstudo,
    atualizarStatusEstudo,
  };
};
