import { ref } from "vue";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useModal } from "@/components/modal/useModal";

import type { IRespostaFrases, IRespostaTextos } from "./interfaces";

const { abrirModal } = useModal();
const dataFrases = ref<IRespostaFrases[]>([]);
const dataTextos = ref<IRespostaTextos[]>([]);
const idEstudoAtual = ref<string>("");
const tipoAcao = ref<"criar" | "editarFrase" | "editarTexto">("criar");
const idConteudoAtual = ref<string>("");
const conteudo = ref<{
  frase: string;
  audioCurto: File | null;
  texto: string;
  audioLongo: File | null;
}>({
  frase: "",
  audioCurto: null,
  texto: "",
  audioLongo: null,
});
const audioCurtoUrls = ref<Record<string, string>>({});
const audioLongoUrl = ref<Record<string, string>>({});

const toggleModal = (
  acao: "criar" | "editarFrase" | "editarTexto",
  idConteudo?: string
) => {
  abrirModal.value = !abrirModal.value;
  tipoAcao.value = acao;
  if (idConteudo) idConteudoAtual.value = idConteudo;
};

const obterConteudo = async (
  obterFrases: () => Promise<IRespostaFrases[]>,
  obterTextos: () => Promise<IRespostaTextos[]>
) => {
  const [frases, textos] = await Promise.all([obterFrases(), obterTextos()]);
  dataFrases.value = frases;
  dataTextos.value = textos;
};

const criarConteudo = async (
  criarFrase: () => Promise<void>,
  criarTexto: () => Promise<void>,
  obterFrases: () => Promise<IRespostaFrases[]>,
  obterTextos: () => Promise<IRespostaTextos[]>
) => {
  await Promise.all([
    criarFrase(),
    criarTexto(),
    obterConteudo(obterFrases, obterTextos),
  ]);

  manipularRespostaCriacaoConteudo();
};

const manipularRespostaCriacaoConteudo = async (
  executarCallback: boolean = false,
  obterFrases?: () => Promise<IRespostaFrases[]>,
  obterTextos?: () => Promise<IRespostaTextos[]>
) => {
  abrirModal.value = false;
  useRespostaApi(201);

  conteudo.value = {
    frase: "",
    audioCurto: null,
    texto: "",
    audioLongo: null,
  };

  if (executarCallback) {
    await obterConteudo(obterFrases!, obterTextos!);
  }
};

const selecionarAudio = (event: File, tipo: "curto" | "longo") => {
  const file = event;

  if (!file) return;

  if (tipo === "curto") {
    conteudo.value.audioCurto = file;
    return;
  }

  conteudo.value.audioLongo = file;
};

export const useConteudo = () => {
  return {
    dataFrases,
    dataTextos,
    idEstudoAtual,
    conteudo,
    tipoAcao,
    idConteudoAtual,
    audioCurtoUrls,
    audioLongoUrl,
    criarConteudo,
    selecionarAudio,
    obterConteudo,
    toggleModal,
    manipularRespostaCriacaoConteudo,
  };
};
