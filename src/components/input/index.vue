<template>
  <div>
    <label
      v-if="label"
      class="block text-sm mb-1"
      :class="{
        'text-slate-900': estilo === 'light',
        'text-slate-300': estilo === 'dark',
      }"
    >
      {{ label }}
    </label>

    <!-- FILE INPUT CUSTOM -->
    <div v-if="type === 'file'" class="relative">
      <input ref="fileInput" type="file" class="hidden" @change="onChange" />

      <button
        type="button"
        @click="openFileDialog"
        class="w-full flex items-center justify-between px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
        :class="{
          'bg-white text-slate-900 border-slate-300': estilo === 'light',
          'bg-slate-900 text-slate-100 border-slate-700': estilo === 'dark',
        }"
      >
        <span class="truncate">
          {{ fileName || "Nenhum ficheiro selecionado" }}
        </span>

        <span class="ml-4 text-sm font-medium text-cyan-500 whitespace-nowrap">
          Escolher ficheiro
        </span>
      </button>
    </div>

    <!-- INPUT NORMAL -->
    <div v-else class="relative">
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @change="onChange"
        class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
        :class="{
          'bg-white text-slate-900 border-slate-300': estilo === 'light',
          'bg-slate-900 text-slate-100 border-slate-700': estilo === 'dark',
        }"
      />

      <div
        v-if="$slots.trailing"
        class="absolute inset-y-0 right-3 flex items-center"
      >
        <slot name="trailing" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string | File | null;
    label?: string;
    placeholder?: string;
    type?: string;
    estilo?: "light" | "dark";
  }>(),
  {
    type: "text",
    estilo: "dark",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | File | null): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const fileName = computed(() =>
  props.modelValue instanceof File ? props.modelValue.name : ""
);

const openFileDialog = () => {
  fileInput.value?.click();
};

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (props.type === "file") {
    emit("update:modelValue", input.files?.[0] ?? null);
  } else {
    emit("update:modelValue", input.value);
  }
};
</script>
