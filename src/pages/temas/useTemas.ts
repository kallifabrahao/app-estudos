import { ref } from "vue";
import type { ITemas } from "./interfaces";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useModal } from "@/components/modal/useModal";

const { abrirModal } = useModal();
const dataTemas = ref<ITemas[]>([]);
const id = ref<string>("");
const estadoInicialTema = { titulo: "", descricao: "" };
const conteudo = ref<{ titulo: string; descricao: string }>({
  ...estadoInicialTema,
});

const setarTema = (titulo: string, descricao: string, _id?: string) => {
  conteudo.value.titulo = titulo;
  conteudo.value.descricao = descricao;
  if (_id) id.value = _id;
};

const setarEstadoInicial = () => {
  conteudo.value = { ...estadoInicialTema };
  id.value = "";
};

const manipularRespostaCriacaoTema = async (callback: () => void) => {
  useRespostaApi(201);
  await callback();
  abrirModal.value = false;
  conteudo.value = { titulo: "", descricao: "" };
  id.value = "";
};

export const useTemas = () => {
  return {
    dataTemas,
    conteudo,
    id,
    setarEstadoInicial,
    manipularRespostaCriacaoTema,
    setarTema,
  };
};
