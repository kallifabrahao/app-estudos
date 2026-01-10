<template>
  <transition name="fade">
    <div
      v-if="abrirModal"
      class="fixed z-20 bg-black/50 flex items-center justify-center w-full h-screen top-0"
    >
      <div
        class="flex flex-col gap-2 bg-white w-1/2 rounded-md p-4 overflow-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold">{{ titulo }}</h2>

          <button
            @click="emit('fecharModal')"
            class="text-slate-400 hover:text-cyan-400 transition"
          >
            ✕
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="salvar">
          <slot />

          <div class="flex justify-end gap-3 pt-4 sm:flex-col sm:items-stretch">
            <button
              type="button"
              @click="emit('fecharModal')"
              class="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
            >
              Fechar
            </button>

            <button
              type="submit"
              class="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { type PropType } from "vue";

const props = defineProps({
  abrirModal: {
    type: Boolean,
    required: true,
  },
  salvar: {
    type: Function as PropType<() => void>,
    required: true,
  },
  titulo: {
    type: String,
    required: false,
  },
});

const emit = defineEmits<{
  (e: "fecharModal"): void;
}>();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
