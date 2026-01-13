import { computed, ref } from "vue";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useModal } from "@/components/modal/useModal";
import { useLoading } from "@/components/loading/useLoading";
import type { IRespostaFrases, IRespostaTextos } from "./interfaces";
import type { AxiosResponse } from "node_modules/axios/index.d.cts";

const { ativarLoading, desativarLoading } = useLoading();
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
  idConteudo?: string,
  texto?: string
) => {
  abrirModal.value = !abrirModal.value;
  tipoAcao.value = acao;
  if (idConteudo) idConteudoAtual.value = idConteudo;

  if (acao === "editarTexto") conteudo.value.texto = texto || "";
  if (acao === "editarFrase") conteudo.value.frase = texto || "";
};

const obterConteudo = async (
  obterFrases: () => Promise<IRespostaFrases[]>,
  obterTextos: () => Promise<IRespostaTextos[]>
) => {
  const [frases, textos] = await Promise.all([obterFrases(), obterTextos()]);
  dataFrases.value = frases;
  dataTextos.value = textos;
};

const temTextoCompleto = computed(() => {
  return dataTextos.value.length > 0;
});

const criarConteudo = async (
  criarFrase: () => Promise<AxiosResponse>,
  criarTexto: () => Promise<AxiosResponse>,
  obterFrases?: () => Promise<IRespostaFrases[]>,
  obterTextos?: () => Promise<IRespostaTextos[]>
) => {
  try {
    ativarLoading();

    const fraseCriada = await criarFrase();

    console.log("frase", fraseCriada);
    console.log("tem", temTextoCompleto.value);

    if (!temTextoCompleto.value) {
      console.log("aqui");

      await criarTexto();
    }

    await manipularRespostaCriacaoConteudo(true, obterFrases, obterTextos);
  } catch (error) {
    desativarLoading();
  }
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

  desativarLoading();
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
    dataTextos,
    idEstudoAtual,
    conteudo,
    tipoAcao,
    idConteudoAtual,
    audioCurtoUrls,
    audioLongoUrl,
    temTextoCompleto,
    formatarDialogo,
    criarConteudo,
    selecionarAudio,
    obterConteudo,
    toggleModal,
    manipularRespostaCriacaoConteudo,
  };
};
