<template>
  <ModalTema
    :abrir-modal="abrirModal"
    :salvar="
      () =>
        tipoAcao === 'criar' ? criarEstudo() : atualizarEstudo(idEstudoAtual)
    "
    @fechar-modal="toggleModal()"
  >
    <FormConteudo
      :titulo="tipoAcao === 'criar' ? 'Criar novo estudo' : 'Editar estudo'"
      v-model="estudo"
    />
  </ModalTema>

  <div
    class="w-full min-h-screen h-full bg-slate-100 flex flex-col items-center py-10"
  >
    <div class="flex flex-col justify-center w-1/2 gap-3 sm:w-full sm:px-2">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Seus estudos</h1>

      <div class="flex flex-row items-center gap-2">
        <Button
          variant="outline"
          v-for="(item, index) in filtroEstudo"
          :key="index"
          @click="
            () => {
              idBtnStatusEstudo = item.id;
              buscarEstudos(item.value);
            }
          "
          :class="
            idBtnStatusEstudo === item.id ? '!bg-cyan-500 !text-slate-900' : ''
          "
        >
          {{ item.label }}
        </Button>
      </div>

      <SemConteudo
        v-if="dataEstudos.length === 0"
        :fn="() => toggleModal('criar')"
        label="Criar novo estudo"
        texto="Crie um novo estudo para começar a adicionar seus conteúdos."
        titulo="Nenhum estudo encontrado!"
        :mostrarBotao="false"
      />

      <div class="flex flex-col gap-4 w-full">
        <div
          v-for="estudo in dataEstudos"
          :key="estudo.idTema"
          class="bg-white p-4 rounded-lg shadow-md w-full flex flex-col items-start justify-between"
        >
          <div class="flex flex-row justify-between w-full">
            <h2 class="text-lg font-semibold text-slate-900">
              {{ estudo.titulo }}
            </h2>

            <div class="flex flex-row items-end gap-2">
              <button
                @click="
                  router.push(
                    `/temas/${idTemaAtual}/estudos/${estudo._id}/conteudo`,
                  )
                "
              >
                <svg-icon
                  type="mdi"
                  :path="mdiMagnify"
                  class="text-slate-500 w-6 h-6 cursor-pointer"
                ></svg-icon>
              </button>
              <button
                @click="
                  () => {
                    setarEstudo(estudo.titulo, estudo.descricao, estudo._id);
                    toggleModal('editar');
                  }
                "
              >
                <svg-icon
                  type="mdi"
                  :path="mdiPencil"
                  class="text-slate-500 w-6 h-6 cursor-pointer"
                ></svg-icon>
              </button>
              <button @click="deletarEstudo(estudo._id)">
                <svg-icon
                  type="mdi"
                  :path="mdiTrashCanOutline"
                  class="text-slate-500 w-6 h-6 cursor-pointer"
                ></svg-icon>
              </button>
            </div>
          </div>

          <span class="text-slate-600 mt-1">{{ estudo.descricao }}</span>

          <div
            class="flex flex-row sm:flex-col justify-between w-full mt-2 sm:gap-2"
          >
            <div class="flex flex-row items-center gap-2">
              <span class="text-slate-600">Status: </span>
              <Badge
                :status="
                  estudo.status == 'estudando'
                    ? 'info'
                    : estudo.status == 'revisao'
                      ? 'warn'
                      : 'success'
                "
                >{{
                  estudo.status == "estudando"
                    ? "Estudando"
                    : estudo.status == "revisao"
                      ? "Revisão"
                      : "Concluídos"
                }}</Badge
              >
            </div>

            <Button
              class="!w-auto p-2"
              @click="
                () => {
                  atualizarStatusEstudo(
                    estudo._id,
                    estudo.status === 'estudando'
                      ? 'revisao'
                      : estudo.status === 'revisao'
                        ? 'concluidos'
                        : 'estudando',
                  );
                }
              "
            >
              Mudar para
              {{
                estudo.status === "estudando"
                  ? "revisão"
                  : estudo.status === "revisao"
                    ? "Concluídos"
                    : "Estudando"
              }}
            </Button>
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
          Criar novo estudo
        </Button>

        <Button variant="outline" @click="() => router.back()">Voltar</Button>
      </div>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "temas-uuid",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import { onMounted } from "vue";
import ModalTema from "@/components/modal/index.vue";
import SemConteudo from "@/components/semConteudo/index.vue";
import FormConteudo from "@/components/formConteudo/index.vue";
import { useEstudos } from "./useEstudos";
import { useApiEstudos } from "./useApiEstudos";
import { useRoute } from "vue-router";
import { useModal } from "@/components/modal/useModal";
import Button from "@/components/botao/index.vue";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify, mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import { useRouter } from "vue-router";
import Badge from "@/components/badge/index.vue";

defineProps<{
  _id: string;
}>();

const router = useRouter();

const { abrirModal, tipoAcao, toggleModal } = useModal();
const {
  dataEstudos,
  idTemaAtual,
  filtroEstudo,
  estudo,
  idEstudoAtual,
  idBtnStatusEstudo,
  setarEstudo,
} = useEstudos();
const {
  buscarEstudos,
  criarEstudo,
  atualizarEstudo,
  deletarEstudo,
  atualizarStatusEstudo,
} = useApiEstudos();

onMounted(async () => {
  idBtnStatusEstudo.value = 1;
  const route = useRoute();
  idTemaAtual.value = route.params._id as string;
  await buscarEstudos();
});
</script>
