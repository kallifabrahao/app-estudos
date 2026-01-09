import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router";
import generatedRoutes from "~pages";
import { useSessao } from "@/utils/sessao";
const { tokenExpirado, limparSessao, setBearerAuthorization } = useSessao();

const routes = setupLayouts(generatedRoutes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//@ts-ignore
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.auth !== false;

  if (requiresAuth && tokenExpirado() && to.path !== "/login") {
    limparSessao();
    return next("/login");
  }

  if (!tokenExpirado() && to.path === "/login") {
    setBearerAuthorization();
    return next("/temas");
  }
  return next();
});

export default router;
