<template>
  <div class="flex flex-col gap-2">
    <h2 class="text-slate-900 text-xl font-semibold mb-4">{{ titulo }}</h2>

    <div class="flex flex-col gap-4">
      <Input
        label="Título"
        placeholder="Digite o título"
        estilo="light"
        v-model="conteudo.titulo"
      />
      <Input
        label="Descrição"
        placeholder="Digite a descrição"
        estilo="light"
        v-model="conteudo.descricao"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/input/index.vue";
import { ref, watch } from "vue";

const conteudo = ref<{ titulo: string; descricao: string }>({
  titulo: "",
  descricao: "",
});

const props = defineProps({
  titulo: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object as () => { titulo: string; descricao: string },
    required: false,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: { titulo: string; descricao: string }): void;
}>();

watch(
  () => props.modelValue,
  (novoValor) => {
    if (novoValor) {
      conteudo.value = { ...novoValor };
    }
  },
  { immediate: true }
);

watch(
  conteudo,
  (novoValor) => {
    emit("update:modelValue", novoValor);
  },
  { deep: true }
);
</script>
