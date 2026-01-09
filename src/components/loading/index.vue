<template>
  <div
    v-if="mostraLoading"
    class="w-full h-full bg-black/80 backdrop-blur text-white fixed left-0 top-0 z-30 flex flex-col gap-2 items-center justify-center"
  >
    <img src="/memora.png" alt="icone aion" class="animate-pulseSoft" />

    <h1>CARREGANDO</h1>
  </div>
</template>

<script lang="ts" setup>
import { useLoading } from "./useLoading";

const { mostraLoading } = useLoading();
</script>
