<template></template>

<route lang="json">
{
  "meta": {
    "title": "Redirect",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  router.push("/login");
});
</script>
