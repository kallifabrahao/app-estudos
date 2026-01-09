import { ref } from "vue";
import type { IEstudos } from "./interfaces";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useModal } from "@/components/modal/useModal";

const { abrirModal } = useModal();
const dataEstudos = ref<IEstudos[]>([]);
const idTemaAtual = ref<string>("");
const idEstudoAtual = ref<string>("");
const idBtnStatusEstudo = ref<number>(1);
const estudo = ref<{ titulo: string; descricao: string }>({
  titulo: "",
  descricao: "",
});

const filtroEstudo = [
  { label: "Estudando", value: "estudando", id: 1 },
  { label: "Para revisar", value: "revisao", id: 2 },
  { label: "Concluídos", value: "concluidos", id: 3 },
];

const manipularRespostaCriacaoEstudo = async (callback: () => void) => {
  useRespostaApi(201);
  await callback();
  abrirModal.value = false;
  estudo.value = { titulo: "", descricao: "" };
  idEstudoAtual.value = "";
};

const setarEstudo = (titulo: string, descricao: string, _id?: string) => {
  estudo.value.titulo = titulo;
  estudo.value.descricao = descricao;
  if (_id) idEstudoAtual.value = _id;
};

export const useEstudos = () => {
  return {
    dataEstudos,
    idTemaAtual,
    idEstudoAtual,
    estudo,
    filtroEstudo,
    idBtnStatusEstudo,
    setarEstudo,
    manipularRespostaCriacaoEstudo,
  };
};
