<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-soft" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>

  <PWABadge />

  <Loading />
</template>

<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue";
import Loading from "@/components/loading/index.vue";
import { useSessao } from "./utils/sessao";

const { estaAutenticado, setBearerAuthorization } = useSessao();

if (estaAutenticado()) {
  setBearerAuthorization();
}
</script>
