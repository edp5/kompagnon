import { createRouter, createWebHistory } from "vue-router";

import RegisterView from "@/views/authentication/RegisterView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      // TODO: update redirect to login route once it exists.
      redirect: { name: "register" },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
  ],
});

export default router;
