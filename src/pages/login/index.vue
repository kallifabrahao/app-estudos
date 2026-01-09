<template>
  <div
    class="bg-[#0F172A] flex items-center justify-center px-4 w-full h-screen"
  >
    <div
      class="w-full max-w-md bg-[#020617] rounded-2xl shadow-xl p-8 border border-slate-800"
    >
      <div class="flex flex-col items-center mb-8">
        <img src="/memora-logo.png" alt="Memora" class="w-48 mb-4" />
        <p class="text-slate-400 text-sm">
          Aprenda melhor. Lembre por mais tempo.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="login">
        <Input
          v-model="usuario.email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
        />

        <Input
          v-model="usuario.senha"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
        >
          <template #trailing>
            <button
              type="button"
              @click="togglePassword"
              class="text-slate-400 hover:text-cyan-400 transition"
            >
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </template>
        </Input>

        <Button type="submit" :disabled="loading">
          {{ loading ? "Entrando..." : "Entrar" }}
        </Button>

        <div class="flex items-center gap-2">
          <div class="flex-1 h-px bg-slate-700" />
          <span class="text-slate-400 text-xs">ou</span>
          <div class="flex-1 h-px bg-slate-700" />
        </div>

        <Button variant="outline" type="button"> Criar conta </Button>
      </form>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "login",
    "layout": "Auth",
    "auth": false
  }
}
</route>

<script setup lang="ts">
import Input from "@/components//input/index.vue";
import Button from "@/components/botao/index.vue";
import { useLogin } from "./useLogin";
import { useApiLogin } from "./useApiLogin";

const { usuario, showPassword, loading, togglePassword } = useLogin();
const { login } = useApiLogin();
</script>
