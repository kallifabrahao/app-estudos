import { toast, type ToastType, type ToastOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface ITypeToasts {
  SUCCESS: ToastType;
  ERROR: ToastType;
  WARNING: ToastType;
  INFO: ToastType;
}

const notificar = (types: string, time: number, msg: string) => {
  const typeToast: ITypeToasts = {
    SUCCESS: toast.TYPE?.SUCCESS,
    WARNING: toast.TYPE.WARNING,
    ERROR: toast.TYPE.ERROR,
    INFO: toast.TYPE.INFO,
  };

  toast(msg, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: time,
    type: typeToast[types as keyof ITypeToasts],
  } as ToastOptions);
};
export const useNotificacoes = () => {
  return {
    notificar,
  };
};
