<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

import KIcon from "./KIcon.vue";

const route = useRoute();

const items = [
  { name: "home", label: "Accueil", icon: "home" },
  { name: "connect", label: "Messages", icon: "connect" },
  { name: "map", label: "Carte", icon: "map" },
  { name: "notifications", label: "Alertes", icon: "notifications" },
  { name: "profile", label: "Profil", icon: "profile" },
];

const activeRouteName = computed(() => route.name);
</script>

<template>
  <nav
    class="bottom-nav"
    aria-label="Navigation principale mobile"
  >
    <RouterLink
      v-for="item in items"
      :key="item.name"
      :to="{ name: item.name }"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': activeRouteName === item.name }"
      :aria-label="item.label"
    >
      <KIcon
        :name="item.icon"
        :size="20"
        aria-hidden="true"
      />
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: sticky;
  bottom: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 0.5rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(18px);
  border-top: 1px solid var(--c-border);
  box-shadow: 0 -4px 24px rgba(30, 44, 56, 0.07);
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  min-height: 54px;
  padding: 0.4rem 0.25rem;
  border-radius: 0.875rem;
  color: var(--c-text-light);
  text-decoration: none;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: color 0.15s, background 0.15s;
}

.bottom-nav__item--active {
  color: var(--c-teal-dark);
  background: rgba(72, 175, 196, 0.1);
}

@media (min-width: 1024px) {
  .bottom-nav {
    display: none;
  }
}
</style>
