import { ref } from "vue";

const abrirModal = ref(false);
const tipoAcao = ref<"criar" | "editar">("criar");

const toggleModal = (acao?: "criar" | "editar") => {
  abrirModal.value = !abrirModal.value;
  if (acao) tipoAcao.value = acao;
};

export const useModal = () => {
  return {
    abrirModal,
    tipoAcao,
    toggleModal,
  };
};
