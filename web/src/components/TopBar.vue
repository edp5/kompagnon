<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import { getUserProfile } from "@/adapters/users.js";
import { useAuthStore } from "@/stores/auth.js";

import KIcon from "./KIcon.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profile = ref(null);

const pageTitles = {
  home: "Tableau de bord",
  map: "Carte",
  connect: "Messages",
  profile: "Mon profil",
  notifications: "Notifications",
  settings: "Paramètres",
  support: "Support",
  privacy: "Confidentialité",
};

const title = computed(() => pageTitles[route.name] ?? "Kompagnon");

const initials = computed(() => {
  const firstname = profile.value?.firstname?.[0];
  const lastname = profile.value?.lastname?.[0];

  if (!firstname || !lastname) {
    return "-";
  }

  return `${firstname}${lastname}`.toUpperCase();
});

onMounted(async () => {
  const token = authStore.token;
  if (!token) return;

  const result = await getUserProfile({ token });
  if (result.success) {
    profile.value = result.profile;
  }
});

function handleLogout() {
  authStore.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <header class="topbar">
    <h1 class="topbar__title">
      {{ title }}
    </h1>

    <div class="topbar__right">
      <RouterLink
        :to="{ name: 'notifications' }"
        class="topbar__bell"
        aria-label="Notifications"
      >
        <KIcon
          name="bell"
          :size="18"
        />
        <span
          class="topbar__bell-dot"
          aria-hidden="true"
        />
      </RouterLink>

      <RouterLink
        :to="{ name: 'profile' }"
        class="topbar__avatar"
        aria-label="Mon profil"
      >
        {{ initials }}
      </RouterLink>

      <button
        type="button"
        class="topbar__logout"
        aria-label="Se déconnecter de votre compte"
        title="Se déconnecter de votre compte"
        @click="handleLogout"
      >
        <KIcon
          name="logout"
          :size="18"
          aria-hidden="true"
        />
        <span class="topbar__logout-text">Se déconnecter</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: none;
}

@media (min-width: 1024px) {
  .topbar {
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.75rem;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--c-border);
  }
}

@media (min-width: 1024px) and (max-height: 900px) {
  .topbar {
    height: 56px;
    padding: 0 1.25rem;
  }

  .topbar__title {
    font-size: 1.125rem;
  }
}

.topbar__title {
  margin: 0;
  font-family: var(--font-display), sans-serif;
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--c-navy);
  letter-spacing: -0.02em;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.topbar__bell {
  position: relative;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.875rem;
  background: var(--c-beige);
  color: var(--c-text-medium);
  text-decoration: none;
  transition: background 0.15s;
}

.topbar__bell:hover {
  background: var(--c-teal-light);
  color: var(--c-teal-dark);
}

.topbar__bell-dot {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c-teal);
  border: 2px solid #fff;
}

.topbar__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-teal), #9ed4d9);
  color: #fff;
  font-family: var(--font-display), sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.topbar__logout {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.875rem;
  background: var(--c-teal);
  color: #ffffff;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
  font-size: 0.875rem;
  font-weight: 600;
  min-height: 40px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(72, 175, 196, 0.24);
}

.topbar__logout:hover {
  background: var(--c-teal-dark);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(72, 175, 196, 0.32);
  transform: translateY(-1px);
}

.topbar__logout:focus-visible {
  outline: 3px solid var(--c-teal);
  outline-offset: 2px;
}

.topbar__logout:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(72, 175, 196, 0.16);
}

.topbar__logout-text {
  display: inline;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .topbar__logout {
    background: #5ec5d8;
    color: #0f172a;
    box-shadow: 0 2px 8px rgba(94, 197, 216, 0.28);
  }

  .topbar__logout:hover {
    background: #8ddce8;
    color: #0f172a;
    box-shadow: 0 4px 12px rgba(94, 197, 216, 0.36);
  }
}
</style>
