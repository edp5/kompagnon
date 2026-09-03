import { createRouter, createWebHashHistory } from "vue-router";

import { routesList } from "@/router/routes-list.js";
import { useAuthStore } from "@/stores/auth.js";


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routesList,
});

router.beforeEach((to) => {
  if (!to.matched.some((route) => route.meta.requiresAuth)) {
    return true;
  }

  const authStore = useAuthStore();
  if (authStore.token) {
    return true;
  }

  return {
    name: "login",
    query: {
      redirect: to.fullPath,
    },
  };
});

router.afterEach((to) => {
  _setTitle(to);
});

function _setTitle(route) {
  if (route.meta && route.meta.title) {
    document.title = `${route.meta.title} | Kompagnon`;
  } else {
    document.title = "Kompagnon";
  }
}

export default router;
