import { createRouter, createWebHashHistory } from "vue-router";

import ActivateAccountView from "@/views/authentication/ActivateAccountView.vue";
import LoginView from "@/views/authentication/LoginView.vue";
import RegisterView from "@/views/authentication/RegisterView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "login" },
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
  ],
});

export default router;
