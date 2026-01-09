<template>
  <button :type="type" :disabled="disabled" :class="buttonClasses">
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  label?: string;
  type?: "button" | "submit";
  variant?: "primary" | "outline";
  disabled?: boolean;
}>();

const buttonClasses = computed(() => {
  const base =
    "w-full py-2 rounded-lg font-semibold transition disabled:opacity-60";

  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-slate-900",
    outline:
      "border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900",
  };

  return `${base} ${variants[props.variant || "primary"]}`;
});
</script>
