<template>
  <div class="flex flex-col items-center justify-center sm:text-center">
    <div class="w-full">
      <Vue3Lottie :animationData="NaoEncontradoJSON" :height="200" />
    </div>
    <h1 class="text-xl font-bold text-slate-800">
      {{ titulo }}
    </h1>
    <span class="text-slate-600 mb-6 break-words">
      {{ texto }}
    </span>

    <Button v-if="mostrarBotao" @click="() => fn()"> {{ label }} </Button>
  </div>
</template>

<script setup lang="ts">
import NaoEncontradoJSON from "@/assets/naoEncontrado.json";
import { Vue3Lottie } from "vue3-lottie";
import Button from "@/components/botao/index.vue";

defineProps({
  fn: {
    type: Function,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  texto: {
    type: String,
    required: false,
  },
  titulo: {
    type: String,
    required: true,
  },
  mostrarBotao: {
    type: Boolean,
    required: false,
    default: true,
  },
});
</script>
