import { createRouter, createWebHashHistory } from "vue-router";

import LoginView from "@/views/authentication/LoginView.vue";
import HomeView from "@/views/HomeView.vue";

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
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
});

export default router;
