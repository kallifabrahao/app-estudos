<template>
  <ModalEstudos
    :abrir-modal="abrirModal"
    :salvar="() => (tipoAcao === 'criar' ? criarTema() : atualizarTema(id))"
    @fechar-modal="toggleModal()"
  >
    <FormConteudo
      :titulo="tipoAcao === 'criar' ? 'Criar novo tema' : 'Editar tema'"
      :modelValue="conteudo"
      @update:modelValue="(novoValor) => (conteudo = novoValor)"
    />
  </ModalEstudos>

  <div class="w-full h-screen bg-slate-100 flex flex-col items-center py-10">
    <SemConteudo
      v-if="dataTemas.length === 0"
      :fn="() => toggleModal('criar')"
      label="Criar novo tema"
      texto="Crie um novo tema para começar a adicionar seus estudos."
      titulo="Nenhum tema encontrado!"
    />

    <div v-else class="flex flex-col justify-center w-1/2 sm:w-full sm:px-2">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Seus temas</h1>
      <div class="flex flex-col gap-4 w-full">
        <div
          v-for="tema in dataTemas"
          :key="tema._id"
          class="bg-white p-4 rounded-lg shadow-md w-full flex items-start justify-between"
        >
          <div class="flex flex-col">
            <h2 class="text-lg font-semibold text-slate-900">
              {{ tema.titulo }}
            </h2>
            <span class="text-slate-600">{{ tema.descricao }}</span>
          </div>

          <div class="flex flex-row items-end gap-2">
            <button @click="router.push(`/temas/${tema._id}/estudos`)">
              <svg-icon
                type="mdi"
                :path="mdiMagnify"
                class="text-slate-500 w-6 h-6 cursor-pointer"
              ></svg-icon>
            </button>
            <button
              @click="
                toggleModal('editar');
                setarTema(tema.titulo, tema.descricao, tema._id);
              "
            >
              <svg-icon
                type="mdi"
                :path="mdiPencil"
                class="text-slate-500 w-6 h-6 cursor-pointer"
              ></svg-icon>
            </button>
            <button @click="deletarTema(tema._id)">
              <svg-icon
                type="mdi"
                :path="mdiTrashCanOutline"
                class="text-slate-500 w-6 h-6 cursor-pointer"
              ></svg-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <Button
          @click="
            () => {
              toggleModal('criar');
              setarEstadoInicial();
            }
          "
        >
          Criar novo tema
        </Button>
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
import ModalEstudos from "@/components/modal/index.vue";
import { useTemas } from "./useTemas";
import Button from "@/components/botao/index.vue";
import FormConteudo from "@/components/formConteudo/index.vue";
import { onMounted } from "vue";
import { useApiTemas } from "./useApiTemas";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify, mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import { useRouter } from "vue-router";
import SemConteudo from "@/components/semConteudo/index.vue";
import { useModal } from "@/components/modal/useModal";

const router = useRouter();
const { dataTemas, conteudo, id, setarTema, setarEstadoInicial } = useTemas();
const { obterTemas, criarTema, deletarTema, atualizarTema } = useApiTemas();
const { abrirModal, tipoAcao, toggleModal } = useModal();

onMounted(async () => {
  await obterTemas();
});
</script>

<style scoped></style>
