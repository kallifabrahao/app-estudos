import { ref } from "vue";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useModal } from "@/components/modal/useModal";
import { useLoading } from "@/components/loading/useLoading";
import type { IFrases, IRespostaFrases } from "./interfaces";
import type { AxiosResponse } from "node_modules/axios/index.d.cts";

const { ativarLoading, desativarLoading } = useLoading();
const { abrirModal } = useModal();
const dataFrases = ref<IRespostaFrases>({ frases: [], audioUrl: null });
const idEstudoAtual = ref<string>("");
const tipoAcao = ref<"criar" | "editar">("criar");
const idConteudoAtual = ref<string>("");
const conteudo = ref<{
  frase: string;
  inicioAudio: number;
  fimAudio: number;
  audio: File | null;
  traducao?: string;
}>({
  frase: "",
  audio: null,
  inicioAudio: 0,
  fimAudio: 0,
  traducao: "",
});
const audioUrl = ref<string | null>(null);
const audioLoading = ref(false);
const abrirModalEditarAudio = ref(false);

const setarInfoParaEditarConteudo = (item: IFrases) => {
  idConteudoAtual.value = item._id;
  conteudo.value.frase = item.frase;
  conteudo.value.inicioAudio = item.inicioAudio;
  conteudo.value.fimAudio = item.fimAudio;
  conteudo.value.traducao = item.traducao || "";
};

const toggleModal = (
  acao: "criar" | "editar",
  idConteudo?: string,
  texto?: string,
) => {
  abrirModal.value = !abrirModal.value;
  tipoAcao.value = acao;
  if (idConteudo) idConteudoAtual.value = idConteudo;

  if (acao === "editar") conteudo.value.frase = texto || "";
};

const obterConteudo = async (obterFrases: () => Promise<IRespostaFrases>) => {
  const frases = await obterFrases();
  dataFrases.value = frases;
};

const criarConteudo = async (
  criarFrase: () => Promise<AxiosResponse>,
  obterFrases?: () => Promise<IRespostaFrases>,
) => {
  try {
    ativarLoading();

    await criarFrase();

    await manipularRespostaCriacaoConteudo(true, obterFrases);
  } catch (error) {
    desativarLoading();
  }
};

const manipularRespostaCriacaoConteudo = async (
  executarCallback: boolean = false,
  obterFrases?: () => Promise<IRespostaFrases>,
) => {
  abrirModal.value = false;

  useRespostaApi(201);

  conteudo.value = {
    frase: "",
    inicioAudio: 0,
    fimAudio: 0,
    audio: null,
  };

  if (executarCallback) {
    await obterConteudo(obterFrases!);
  }

  desativarLoading();
};

const selecionarAudio = (event: File) => {
  const file = event;

  if (!file) return;

  conteudo.value.audio = file;
};

function formatarDialogo(texto: string) {
  if (!texto) return "";

  const comQuebras = texto.replace(/([.!?])\s+/g, "$1\n");

  const linhas = comQuebras
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const resultado = [];
  for (let i = 0; i < linhas.length; i++) {
    resultado.push(linhas[i]);

    if ((i + 1) % 2 === 0) {
      resultado.push("");
    }
  }

  return resultado.join("\n");
}

export const useConteudo = () => {
  return {
    dataFrases,
    idEstudoAtual,
    conteudo,
    tipoAcao,
    idConteudoAtual,
    audioUrl,
    audioLoading,
    abrirModalEditarAudio,
    setarInfoParaEditarConteudo,
    formatarDialogo,
    criarConteudo,
    selecionarAudio,
    obterConteudo,
    toggleModal,
    manipularRespostaCriacaoConteudo,
  };
};
