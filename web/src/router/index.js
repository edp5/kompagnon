import { createRouter, createWebHashHistory } from "vue-router";

import AppLayout from "@/components/AppLayout.vue";
import { useAuthStore } from "@/stores/auth.js";
import ActivateAccountView from "@/views/authentication/ActivateAccountView.vue";
import LoginView from "@/views/authentication/LoginView.vue";
import RegisterView from "@/views/authentication/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import MapView from "@/views/MapView.vue";
import NotificationsView from "@/views/NotificationsView.vue";
import PrivacyView from "@/views/PrivacyView.vue";
import ProfileView from "@/views/ProfileView.vue";
import RecordJourneyView from "@/views/RecordJourneyView.vue";
import SupportView from "@/views/SupportView.vue";

function withAppLayout(path, name, component) {
  return {
    path,
    component: AppLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name,
        component,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  };
}

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
    {
      ...withAppLayout("/home", "home", HomeView),
    },
    {
      ...withAppLayout("/map", "map", MapView),
    },
    {
      ...withAppLayout("/journeys/new", "record-journey", RecordJourneyView),
    },
    {
      ...withAppLayout("/profile", "profile", ProfileView),
    },
    {
      ...withAppLayout("/notifications", "notifications", NotificationsView),
    },
    {
      ...withAppLayout("/support", "support", SupportView),
    },
    {
      ...withAppLayout("/privacy", "privacy", PrivacyView),
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
