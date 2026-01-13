<template>
  <Modal
    :abrir-modal="abrirModal"
    :salvar="
      () => {
        tipoAcao === 'criarFrase' || tipoAcao === 'criarTexto'
          ? criarConteudo(criarFrase, criarTexto, obterFrases, obterTextos)
          : tipoAcao === 'editarFrase'
          ? atualizarFrases()
          : atualizarTexto();
      }
    "
    @fechar-modal="toggleModal(temTextoCompleto ? 'criarFrase' : 'criarTexto')"
  >
    <div class="flex flex-col gap-2">
      <h2 class="text-slate-900 text-xl font-semibold mb-4">
        {{
          tipoAcao === "criarFrase" || tipoAcao === "criarTexto"
            ? "Criar Conteúdo"
            : tipoAcao === "editarFrase"
            ? "Editar Frase"
            : "Editar Texto"
        }}
      </h2>

      <div class="flex flex-col gap-4">
        <Input
          label="Frase"
          placeholder="Digite a frase"
          estilo="light"
          v-model="conteudo.frase"
          v-if="
            (tipoAcao == 'criarFrase' || tipoAcao == 'editarFrase') &&
            temTextoCompleto
          "
        />

        <CortarAudio
          @cortado="(file: File) => (conteudo.audioCurto = file)"
          v-if="
            (tipoAcao == 'criarFrase' || tipoAcao == 'editarFrase') &&
            temTextoCompleto
          "
        />

        <textarea
          v-model="conteudo.texto"
          class="w-full px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-slate-900"
          rows="4"
          placeholder="Texto completo"
          v-if="
            (tipoAcao == 'criarTexto' && !temTextoCompleto) ||
            tipoAcao == 'editarTexto'
          "
        ></textarea>

        <CortarAudio
          @cortado="(file: File) => (conteudo.audioLongo = file)"
          v-if="
            (tipoAcao == 'criarTexto' && !temTextoCompleto) ||
            tipoAcao == 'editarTexto'
          "
        />
      </div>
    </div>
  </Modal>

  <div
    class="w-full min-h-screen h-full bg-slate-100 flex flex-col items-center py-10"
  >
    <SemConteudo
      v-if="dataFrases.length === 0 && dataTextos.length === 0"
      :fn="() => toggleModal(temTextoCompleto ? 'criarFrase' : 'criarTexto')"
      label="Criar novo conteúdo"
      texto="Crie um novo conteúdo e comece a estudar."
      titulo="Nenhum conteúdo encontrado!"
      :mostrarVoltar="true"
    />

    <div v-else class="flex flex-col justify-center w-1/2 sm:w-full sm:px-2">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Seus conteúdos</h1>
      <div class="flex flex-col gap-4 w-full">
        <h1 class="font-semibold text-[#424242] text-lg">Frases e áudios</h1>
        <div
          v-for="tema in dataFrases"
          :key="tema._id"
          class="p-4 rounded-lg w-full flex flex-col gap-4 items-start justify-between bg-white shadow-md sm:flex-col sm:gap-4"
        >
          <div
            class="flex flex-row gap-2 sm:gap-4 w-full justify-between items-start"
          >
            <p
              class="text-lg font-semibold text-slate-900 ml-1 whitespace-pre-line"
            >
              {{ formatarDialogo(tema.frase) }}
            </p>

            <div class="flex flex-row items-end gap-2 sm:justify-end sm:w-full">
              <button @click="toggleModal('editarFrase', tema._id, tema.frase)">
                <svg-icon
                  type="mdi"
                  :path="mdiPencil"
                  class="text-slate-500 w-6 h-6 cursor-pointer"
                ></svg-icon>
              </button>
              <button @click="deletarFrase(tema._id)">
                <svg-icon
                  type="mdi"
                  :path="mdiTrashCanOutline"
                  class="text-slate-500 w-6 h-6 cursor-pointer"
                ></svg-icon>
              </button>
            </div>
          </div>

          <div class="relative w-full">
            <CarregandoAudio v-if="audioLoading[tema._id]" />

            <audio
              :src="audioCurtoUrls[tema._id]"
              controls
              preload="metadata"
              class="w-full"
              @loadstart="audioLoading[tema._id] = true"
              @canplay="audioLoading[tema._id] = false"
              @loadeddata="audioLoading[tema._id] = false"
              @error="audioLoading[tema._id] = false"
            ></audio>
          </div>
        </div>

        <h1 class="font-semibold text-[#424242] text-lg mt-6">
          Texto e áudio completo
        </h1>

        <ce-collapse :items="dataTextos" variant="compact" direction="column">
          <template #header="{ item: tema }">
            <div class="w-full flex justify-between items-center">
              <h2 class="text-lg font-semibold text-[#0891B2]">
                {{ tema.texto.substring(0, 30) + "..." }}
              </h2>
              <button @click="toggleModal('editarTexto', tema._id, tema.texto)">
                <svg-icon
                  type="mdi"
                  :path="mdiPencil"
                  class="text-slate-500 w-6 h-6 cursor-pointer"
                ></svg-icon>
              </button>
            </div>
          </template>

          <template #content="{ item: tema }">
            <div
              class="p-4 rounded-lg w-full flex flex-col gap-4 items-start justify-between bg-white shadow-md sm:flex-col sm:gap-4"
            >
              <p
                class="text-lg font-semibold text-slate-900 ml-1 whitespace-pre-line"
              >
                {{ formatarDialogo(tema.texto) }}
              </p>

              <div class="relative w-full">
                <CarregandoAudio v-if="audioLoading[tema._id]" />

                <audio
                  :src="audioLongoUrl[tema._id]"
                  controls
                  preload="metadata"
                  class="w-full"
                  @loadstart="audioLoading[tema._id] = true"
                  @canplay="audioLoading[tema._id] = false"
                  @loadeddata="audioLoading[tema._id] = false"
                  @error="audioLoading[tema._id] = false"
                ></audio>
              </div>
            </div>
          </template>
        </ce-collapse>
      </div>
      <div class="mt-6 flex flex-col items-center gap-2">
        <Button
          @click="
            () => {
              toggleModal(temTextoCompleto ? 'criarFrase' : 'criarTexto');
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
import { onMounted, watch } from "vue";
import Input from "@/components/input/index.vue";
import { useApiConteudo } from "./useApiConteudo";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import { useRoute, useRouter } from "vue-router";
import SemConteudo from "@/components/semConteudo/index.vue";
import { useModal } from "@/components/modal/useModal";
import { useLoading } from "@/components/loading/useLoading";
import CortarAudio from "@/components/cortarAudio/index.vue";
import { CeCollapse } from "@comercti/vue-components-hmg";
import CarregandoAudio from "@/components/carregandoAudio/index.vue";

const { ativarLoading, desativarLoading } = useLoading();

defineProps<{
  id: string;
  _id: string;
}>();

const route = useRoute();
const router = useRouter();

const {
  dataFrases,
  dataTextos,
  conteudo,
  idEstudoAtual,
  tipoAcao,
  audioCurtoUrls,
  audioLongoUrl,
  temTextoCompleto,
  audioLoading,
  formatarDialogo,
  criarConteudo,
  obterConteudo,
  toggleModal,
} = useConteudo();

const {
  criarFrase,
  criarTexto,
  obterFrases,
  obterTextos,
  carregarAudio,
  atualizarTexto,
  atualizarFrases,
  deletarFrase,
} = useApiConteudo();

const { abrirModal } = useModal();

onMounted(async () => {
  idEstudoAtual.value = route.params.id as string;

  ativarLoading();
  await obterConteudo(obterFrases, obterTextos);
  desativarLoading();
});

watch(
  () => dataFrases.value,
  async (novoValor) => {
    for (const tema of novoValor) {
      audioLoading.value[tema._id] = true;
      audioCurtoUrls.value[tema._id] = await carregarAudio(tema.audioUrl);
    }
  },
  { immediate: true }
);

watch(
  () => dataTextos.value,
  async (novoValor) => {
    for (const tema of novoValor) {
      audioLoading.value[tema._id] = true;
      audioLongoUrl.value[tema._id] = await carregarAudio(tema.audioUrl);
    }
  },
  { immediate: true }
);
</script>
