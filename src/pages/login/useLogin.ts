import { ref } from "vue";

const usuario = ref({
  email: "",
  senha: "",
});

const showPassword = ref(false);
const loading = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

export function useLogin() {
  return {
    usuario,
    showPassword,
    loading,
    togglePassword,
  };
}
