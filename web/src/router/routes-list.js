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

function _withAppLayout(path, name, component, title) {
  return {
    path,
    component: AppLayout,
    meta: {
      requiresAuth: true,
      title,
    },
    children: [
      {
        path: "",
        name,
        component,
        meta: {
          requiresAuth: true,
          title,
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
    meta: { title: "Connexion" },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: { title: "Inscription" },
  },
  {
    path: "/authentication/activate",
    name: "activate-account",
    component: ActivateAccountView,
    meta: { title: "Activation de compte" },
  },
  {
    ..._withAppLayout("/home", "home", HomeView, "Accueil"),
  },
  {
    ..._withAppLayout("/map", "map", MapView, "Carte"),
  },
  {
    ..._withAppLayout("/journeys", "journeys", JourneysView, "Mes trajets"),
  },
  {
    ..._withAppLayout("/journeys/new", "record-journey", RecordJourneyView, "Nouveau trajet"),
  },
  {
    ..._withAppLayout("/journeys/:journeyId", "journey", JourneyView, "détails du trajet"),
  },
  {
    ..._withAppLayout("/profile", "profile", ProfileView, "Mon profil"),
  },
  {
    ..._withAppLayout("/notifications", "notifications", NotificationsView, "Notifications"),
  },
  {
    ..._withAppLayout("/support", "support", SupportView, "Support"),
  },
  {
    ..._withAppLayout("/privacy", "privacy", PrivacyView, "Vie privée"),
  },
];

export { routesList };
