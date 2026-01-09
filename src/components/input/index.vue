<template>
  <div>
    <label
      v-if="label"
      :class="{
        'text-slate-900': estilo === 'light',
        'text-slate-300': estilo === 'dark',
      }"
      class="block text-sm mb-1"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @change="onChange"
        :class="{
          'bg-white text-slate-900': estilo === 'light',
          'bg-slate-900 text-slate-100': estilo === 'dark',
        }"
        class="w-full px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
const props = withDefaults(
  defineProps<{
    modelValue?: string;
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

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (props.type === "file") {
    const file = input.files?.[0] ?? null;
    emit("update:modelValue", file);
  } else {
    emit("update:modelValue", input.value);
  }
};
</script>
