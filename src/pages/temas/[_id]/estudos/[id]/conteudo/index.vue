<template>
  <Modal
    :abrir-modal="abrirModal"
    :salvar="
      () => {
        tipoAcao === 'criar'
          ? criarConteudo(criarFrase, obterFrases)
          : atualizarFrases();
      }
    "
    @fechar-modal="toggleModal('criar')"
  >
    <div class="flex flex-col gap-2">
      <div class="flex flex-row justify-between w-full">
        <h2 class="text-slate-900 text-xl font-semibold mb-4 whitespace-nowrap">
          {{ tipoAcao === "criar" ? "Criar Conteúdo" : "Editar Conteúdo" }}
        </h2>
      </div>

      <div class="flex flex-col gap-4">
        <CortarAudio @cortado="(file: File) => (conteudo.audio = file)" />

        <textarea
          v-model="conteudo.frase"
          class="w-full px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-slate-900"
          rows="4"
          placeholder="Texto completo"
        ></textarea>
      </div>
    </div>
  </Modal>

  <Modal
    :abrir-modal="abrirModalEditarAudio"
    @fechar-modal="abrirModalEditarAudio = false"
    :salvar="
      () => {
        atualizarFrases();
        abrirModalEditarAudio = false;
      }
    "
  >
    <textarea
      v-model="conteudo.frase"
      class="w-full px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-slate-900"
      rows="4"
      placeholder="Texto completo"
    ></textarea>

    <CortarAudio
      emitir-tempo-cortado
      :audio="audioUrl"
      @tempo="
        (tempos: { inicioAudio: number; fimAudio: number }) => {
          conteudo.inicioAudio = tempos.inicioAudio;
          conteudo.fimAudio = tempos.fimAudio;
        }
      "
    />
  </Modal>

  <div
    class="w-full min-h-screen h-full bg-slate-100 flex flex-col items-center py-10"
  >
    <SemConteudo
      v-if="dataFrases.frases.length === 0"
      :fn="() => toggleModal('criar')"
      label="Criar novo conteúdo"
      texto="Crie um novo conteúdo e comece a estudar."
      titulo="Nenhum conteúdo encontrado!"
      :mostrarVoltar="true"
    />

    <div v-else class="flex flex-col justify-center w-1/2 sm:w-full sm:px-2">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Seus conteúdos</h1>
      <div class="flex flex-row items-center gap-2">
        <button class="p-2 rounded-full bg-[#0891B2]" @click="router.back()">
          <svg-icon
            type="mdi"
            :path="mdiKeyboardBackspace"
            class="text-white w-6 h-6 cursor-pointer"
          ></svg-icon>
        </button>
        <button
          class="p-2 rounded-full bg-[#0891B2]"
          @click="toggleModal('criar')"
        >
          <svg-icon
            type="mdi"
            :path="mdiPlus"
            class="text-white w-6 h-6 cursor-pointer"
          ></svg-icon>
        </button>
      </div>
      <div class="flex flex-col gap-4 w-full">
        <h1 class="font-semibold text-[#424242] text-lg mt-6">
          Texto e áudio completo
        </h1>

        <div
          class="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2"
          v-for="(item, index) in dataFrases.frases"
          :key="index"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-lg font-semibold text-slate-900 ml-1 whitespace-pre-line"
            >
              {{ formatarDialogo(item.frase) }}
            </p>

            <div class="flex items-center gap-2">
              <button v-if="item.inicioAudio > 0">
                <svg-icon
                  type="mdi"
                  :path="mdiPlay"
                  class="text-slate-500 w-6 h-6 cursor-pointer"
                  @click="tocarTrecho(item.inicioAudio, item.fimAudio)"
                ></svg-icon>
              </button>

              <button @click="() => abrirEditarAudio(item)">
                <svg-icon
                  type="mdi"
                  :path="mdiPencil"
                  class="text-slate-500 w-6 h-6 cursor-pointer"
                ></svg-icon>
              </button>
            </div>
          </div>
        </div>
        <div class="relative w-full">
          <CarregandoAudio v-if="audioLoading" />

          <audio
            ref="audioPlayer"
            :src="String(audioUrl)"
            controls
            preload="metadata"
            class="w-full"
            @loadstart="audioLoading = true"
            @canplay="audioLoading = false"
            @loadeddata="audioLoading = false"
            @error="audioLoading = false"
          ></audio>
        </div>
      </div>
      <div class="mt-6 flex flex-col items-center gap-2">
        <Button
          v-if="dataFrases.frases.length === 0"
          @click="
            () => {
              toggleModal('criar');
            }
          "
        >
          Criar novo conteúdo
        </Button>

        <Button variant="outline" @click="() => router.back()">Voltar</Button>
      </div>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "inicio",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import Modal from "@/components/modal/index.vue";
import { useConteudo } from "./useConteudo";
import Button from "@/components/botao/index.vue";
import { onMounted, ref, watch } from "vue";
import { useApiConteudo } from "./useApiConteudo";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiKeyboardBackspace, mdiPlus, mdiPlay } from "@mdi/js";
import { useRoute, useRouter } from "vue-router";
import SemConteudo from "@/components/semConteudo/index.vue";
import { useModal } from "@/components/modal/useModal";
import { useLoading } from "@/components/loading/useLoading";
import CortarAudio from "@/components/cortarAudio/index.vue";
import CarregandoAudio from "@/components/carregandoAudio/index.vue";
import type { IFrases } from "./interfaces";

const { ativarLoading, desativarLoading } = useLoading();

defineProps<{
  id: string;
  _id: string;
}>();

const route = useRoute();
const router = useRouter();

const {
  dataFrases,
  conteudo,
  idEstudoAtual,
  tipoAcao,
  audioLoading,
  audioUrl,
  idConteudoAtual,
  formatarDialogo,
  criarConteudo,
  obterConteudo,
  toggleModal,
} = useConteudo();

const {
  criarFrase,
  obterFrases,
  carregarAudio,
  atualizarFrases,
} = useApiConteudo();

const { abrirModal } = useModal();

onMounted(async () => {
  idEstudoAtual.value = route.params.id as string;

  ativarLoading();
  await obterConteudo(obterFrases);
});

const abrirModalEditarAudio = ref(false);
const audioPlayer = ref<HTMLAudioElement | null>(null);

const abrirEditarAudio = (item: IFrases) => {
  idConteudoAtual.value = item._id;
  conteudo.value.frase = item.frase;
  conteudo.value.inicioAudio = item.inicioAudio;
  conteudo.value.fimAudio = item.fimAudio;
  abrirModalEditarAudio.value = true;
};

const tocarTrecho = (inicio: number, fim: number) => {
  if (!audioPlayer.value) return;

  const player = audioPlayer.value;

  player.currentTime = inicio;
  player.play();

  const pararNoFim = () => {
    if (player.currentTime >= fim) {
      player.pause();
      player.removeEventListener("timeupdate", pararNoFim);
    }
  };

  player.addEventListener("timeupdate", pararNoFim);
};

watch(
  () => dataFrases.value,
  async (novoValor) => {
    if (!novoValor.audioUrl) return;

    audioUrl.value = await carregarAudio(novoValor.audioUrl);

    desativarLoading();
  },
  { immediate: true },
);
</script>
