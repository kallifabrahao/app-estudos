<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
    :class="statusClasses"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

type BadgeStatus = "success" | "info" | "warn" | "error";

const props = defineProps<{
  status: BadgeStatus;
}>();

const STATUS_MAP: Record<BadgeStatus, string> = {
  success: "bg-green-100 text-green-800 border border-green-800",
  info: "bg-blue-100 text-blue-800 border border-blue-800",
  warn: "bg-yellow-100 text-yellow-800 border border-yellow-800",
  error: "bg-red-100 text-red-800 border border-red-800",
};

const statusClasses = computed(() => STATUS_MAP[props.status]);
</script>

<style scoped></style>
