<template>
  <div class="">
    <div
      class="fixed bg-[#020617] p-2 flex items-center justify-between w-full h-16 top-0 left-0 z-30"
    >
      <div class="flex flex-row items-center gap-3">
        <img src="/memora-logo.png" alt="Memora" class="w-40 sm:w-28" />

        <button
          class="text-white font-medium text-lg"
          @click="router.push('/temas')"
        >
          Pagina Inicial
        </button>
      </div>

      <button @click="limparSessao()">
        <svg-icon
          type="mdi"
          :path="mdiLogout"
          class="text-white w-6 h-6 cursor-pointer"
        ></svg-icon>
      </button>
    </div>

    <div class="w-full h-full flex items-center justify-center mt-10">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLogout } from "@mdi/js";
import { useRouter } from "vue-router";
import { useSessao } from "@/utils/sessao";

const router = useRouter();
const { limparSessao } = useSessao();
</script>
