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
const tipoAcao = ref<
  "criarFrase" | "criarTexto" | "editarFrase" | "editarTexto"
>("criarFrase");
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
const audioLoading = ref<Record<string, boolean>>({});
const podeCriarFrase = ref<boolean>(true);
const voices = ref<SpeechSynthesisVoice[]>([]);
const vozSelecionada = ref<string | null>(null);
const idiomaLeitura = ref<"pt-BR" | "en-US">("pt-BR");

const toggleModal = (
  acao: "criarFrase" | "criarTexto" | "editarFrase" | "editarTexto",
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

    if (tipoAcao.value === "criarFrase") await criarFrase();

    if (!temTextoCompleto.value) {
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

function extrairTexto(frase: string) {
  if (idiomaLeitura.value === "en-US") {
    return (frase.split("Filho:")[0] ?? "")
      .replace(/Son:/gi, "")
      .replace(/Mother:/gi, "")
      .trim();
  }

  return frase.split("Filho:")[1]?.replace(/Mãe:/gi, "").trim();
}

function lerTexto(texto: string) {
  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = idiomaLeitura.value;

  // 1️⃣ tenta voz escolhida pelo usuário
  const vozCustom = escolherVozCustom();
  if (vozCustom) {
    utterance.voice = vozCustom;
  }
  // 2️⃣ fallback automático por idioma
  else {
    const vozAuto = escolherVoz(idiomaLeitura.value);
    if (vozAuto) utterance.voice = vozAuto;
  }

  utterance.rate = 0.9;
  utterance.pitch = 1;

  speechSynthesis.speak(utterance);
}

function tocarFrase(frase: string) {
  const texto = extrairTexto(frase);

  if (texto) {
    lerTexto(texto);
  }
}

function escolherVoz(idioma: "pt-BR" | "en-US") {
  return (
    voices.value.find((v) => v.lang === idioma) ||
    voices.value.find((v) =>
      v.lang.startsWith(String(idioma).split("-")[0]!)
    ) ||
    null
  );
}

function escolherVozCustom() {
  if (!vozSelecionada.value) return null;
  return voices.value.find((v) => v.name === vozSelecionada.value) || null;
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
    audioLoading,
    podeCriarFrase,
    idiomaLeitura,
    voices,
    vozSelecionada,
    tocarFrase,
    formatarDialogo,
    criarConteudo,
    selecionarAudio,
    obterConteudo,
    toggleModal,
    manipularRespostaCriacaoConteudo,
  };
};
