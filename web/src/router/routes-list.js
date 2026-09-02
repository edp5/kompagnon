import AppLayout from "@/components/AppLayout.vue";
import ActivateAccountView from "@/views/authentication/ActivateAccountView.vue";
import LoginView from "@/views/authentication/LoginView.vue";
import RegisterView from "@/views/authentication/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import JourneysView from "@/views/JourneysView.vue";
import JourneyView from "@/views/JourneyView.vue";
import MapView from "@/views/MapView.vue";
import NotificationsView from "@/views/NotificationsView.vue";
import PrivacyView from "@/views/PrivacyView.vue";
import ProfileView from "@/views/ProfileView.vue";
import RecordJourneyView from "@/views/RecordJourneyView.vue";
import SupportView from "@/views/SupportView.vue";

function _withAppLayout(path, name, component) {
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

const routesList = [
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
    ..._withAppLayout("/home", "home", HomeView),
  },
  {
    ..._withAppLayout("/map", "map", MapView),
  },
  {
    ..._withAppLayout("/journeys", "journeys", JourneysView),
  },
  {
    ..._withAppLayout("/journeys/new", "record-journey", RecordJourneyView),
  },
  {
    ..._withAppLayout("/journeys/:journeyId", "journey", JourneyView),
  },
  {
    ..._withAppLayout("/profile", "profile", ProfileView),
  },
  {
    ..._withAppLayout("/notifications", "notifications", NotificationsView),
  },
  {
    ..._withAppLayout("/support", "support", SupportView),
  },
  {
    ..._withAppLayout("/privacy", "privacy", PrivacyView),
  },
];

export { routesList };
