<template>
  <Modal
    :abrir-modal="abrirModal"
    :salvar="
      () => {
        tipoAcao === 'criar'
          ? criarConteudo(criarFrase, criarTexto, obterFrases, obterTextos)
          : tipoAcao === 'editarFrase'
          ? atualizarFrases()
          : atualizarTexto();
      }
    "
    @fechar-modal="toggleModal('criar')"
  >
    <div class="flex flex-col gap-2">
      <h2 class="text-slate-900 text-xl font-semibold mb-4">Criar Conteúdo</h2>

      <div class="flex flex-col gap-4">
        <Input
          label="Frase"
          placeholder="Digite a frase"
          estilo="light"
          v-model="conteudo.frase"
          v-if="tipoAcao == 'criar' || tipoAcao == 'editarFrase'"
        />
        <Input
          label="Audio Curto"
          placeholder="Selecione o áudio curto"
          estilo="light"
          @update:model-value="(file) => selecionarAudio(file as File, 'curto')"
          type="file"
          v-if="tipoAcao == 'criar' || tipoAcao == 'editarFrase'"
        />

        <textarea
          v-model="conteudo.texto"
          class="w-full px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-slate-900"
          rows="4"
          placeholder="Texto completo"
          v-if="tipoAcao == 'criar' || tipoAcao == 'editarTexto'"
        ></textarea>

        <Input
          label="Audio Completo"
          placeholder="Selecione o áudio completo"
          estilo="light"
          @update:model-value="(file) => selecionarAudio(file as File, 'longo')"
          type="file"
          v-if="tipoAcao == 'criar' || tipoAcao == 'editarTexto'"
        />
      </div>
    </div>
  </Modal>

  <div class="w-full h-screen bg-slate-100 flex flex-col items-center py-10">
    <SemConteudo
      v-if="dataFrases.length === 0 || dataTextos.length === 0"
      :fn="() => toggleModal('criar')"
      label="Criar novo conteúdo"
      texto="Crie um novo conteúdo e comece a estudar."
      titulo="Nenhum conteúdo encontrado!"
    />

    <div v-else class="flex flex-col justify-center w-1/2 sm:w-full sm:px-2">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Seus conteúdos</h1>
      <div class="flex flex-col gap-4 w-full">
        <h1 class="font-semibold text-[#424242] text-lg">Frases e áudios</h1>
        <div
          v-for="tema in dataFrases"
          :key="tema._id"
          class="p-4 rounded-lg w-full flex items-start justify-between bg-white shadow-md sm:flex-col sm:gap-4"
        >
          <div class="flex flex-col gap-2 sm:gap-4">
            <h2 class="text-lg font-semibold text-slate-900 ml-1">
              {{ tema.frase }}
            </h2>

            <audio
              :src="audioCurtoUrls[tema._id]"
              controls
              preload="metadata"
            ></audio>
          </div>

          <div class="flex flex-row items-end gap-2">
            <button @click="toggleModal('editarFrase', tema._id)">
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

        <h1 class="font-semibold text-[#424242] text-lg mt-6">
          Texto e áudio completo
        </h1>

        <div
          v-for="tema in dataTextos"
          :key="tema._id"
          class="p-4 rounded-lg w-full flex items-start justify-between bg-white shadow-md sm:flex-col sm:gap-4"
        >
          <div class="flex flex-col gap-2 sm:gap-4">
            <h2 class="text-lg font-semibold text-slate-900 ml-1">
              {{ tema.texto }}
            </h2>

            <audio
              :src="audioLongoUrl[tema._id]"
              controls
              preload="metadata"
            ></audio>
          </div>

          <div class="flex flex-row items-end gap-2">
            <button @click="toggleModal('editarTexto', tema._id)">
              <svg-icon
                type="mdi"
                :path="mdiPencil"
                class="text-slate-500 w-6 h-6 cursor-pointer"
              ></svg-icon>
            </button>
            <button @click="deletarTexto(tema._id)">
              <svg-icon
                type="mdi"
                :path="mdiTrashCanOutline"
                class="text-slate-500 w-6 h-6 cursor-pointer"
              ></svg-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-col items-center gap-2">
        <Button
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
import { onMounted, watch } from "vue";
import Input from "@/components/input/index.vue";
import { useApiConteudo } from "./useApiConteudo";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import { useRoute, useRouter } from "vue-router";
import SemConteudo from "@/components/semConteudo/index.vue";
import { useModal } from "@/components/modal/useModal";

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
  criarConteudo,
  selecionarAudio,
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
  deletarTexto,
} = useApiConteudo();

const { abrirModal } = useModal();

onMounted(async () => {
  idEstudoAtual.value = route.params.id as string;
  await obterConteudo(obterFrases, obterTextos);
});

watch(
  () => dataFrases.value,
  async (newVal) => {
    for (const tema of newVal) {
      audioCurtoUrls.value[tema._id] = await carregarAudio(tema.audioUrl);
    }
  },
  { immediate: true }
);

watch(
  () => dataTextos.value,
  async (newVal) => {
    for (const tema of newVal) {
      audioLongoUrl.value[tema._id] = await carregarAudio(tema.audioUrl);
    }
  },
  { immediate: true }
);
</script>
