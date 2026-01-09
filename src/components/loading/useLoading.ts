import { ref } from "vue";

const mostraLoading = ref(false);

const ativarLoading = () => {
  mostraLoading.value = true;
};

const desativarLoading = () => {
  mostraLoading.value = false;
};

export const useLoading = () => {
  return {
    mostraLoading,
    ativarLoading,
    desativarLoading,
  };
};
