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
import { computed } from "vue";

const props = defineProps<{
  titulo: string;
  modelValue?: {
    titulo: string;
    descricao: string;
  };
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: { titulo: string; descricao: string }): void;
}>();

const conteudo = computed({
  get() {
    return (
      props.modelValue ?? {
        titulo: "",
        descricao: "",
      }
    );
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
