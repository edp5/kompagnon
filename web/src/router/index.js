import { createRouter, createWebHashHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth.js";
import ActivateAccountView from "@/views/authentication/ActivateAccountView.vue";
import LoginView from "@/views/authentication/LoginView.vue";
import RegisterView from "@/views/authentication/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import ProfileView from "@/views/ProfileView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "login" },
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/authentication/activate",
      name: "activate-account",
      component: ActivateAccountView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
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

export default router;
