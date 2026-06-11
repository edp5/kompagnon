<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import { getUserProfile } from "@/adapters/users.js";
import { useAuthStore } from "@/stores/auth.js";

import KIcon from "./KIcon.vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const collapsed = ref(false);
const profile = ref(null);
const isAdmin = ref(false);

function closeDrawer() {
  emit("close");
}

function handleLogout() {
  authStore.logout();
  router.push({ name: "login" });
}

function onKeydown(event) {
  if (event.key === "Escape" && props.open) {
    closeDrawer();
  }
}

watch(() => props.open, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});

const navItems = [
  { name: "home", icon: "home", label: "Tableau de bord" },
  { name: "record-journey", icon: "plus", label: "Nouveau trajet" },
  { name: "journeys", icon: "route", label: "Mes trajets" },
  { name: "map", icon: "map", label: "Carte" },
  { name: "notifications", icon: "notifications", label: "Notifications" },
  { name: "profile", icon: "profile", label: "Mon profil" },
  { name: "support", icon: "support", label: "Support" },
  { name: "privacy", icon: "privacy", label: "Confidentialité" },
];

const initials = computed(() => {
  const firstname = profile.value?.firstname?.[0];
  const lastname = profile.value?.lastname?.[0];

  if (!firstname || !lastname) {
    return "-";
  }

  return `${firstname}${lastname}`.toUpperCase();
});

const displayName = computed(() => {
  const firstname = profile.value?.firstname;
  const lastname = profile.value?.lastname;

  if (!firstname || !lastname) {
    return "-";
  }

  return `${firstname} ${lastname}`.trim();
});

const userRole = computed(() => profile.value?.role ?? "beneficiaire");

onMounted(async () => {
  const token = authStore.token;
  if (!token) return;

  const result = await getUserProfile({ token });
  if (result.success) {
    profile.value = result.profile;
    // Pour ce MVP, on considère que les utilisateurs avec le rôle "admin" peuvent éditer
    // À adapter selon votre système d'roles réel
    isAdmin.value = result.profile?.role === "admin" || false;
  }
});

function isActive(routeName) {
  return route.name === routeName;
}
</script>

<template>
  <div
    v-if="open"
    class="sidebar-backdrop"
    @click="closeDrawer"
  />
  <aside
    class="sidebar"
    :class="{ 'sidebar--collapsed': collapsed, 'sidebar--open': open }"
    aria-label="Menu de navigation"
  >
    <div class="sidebar__brand">
      <img
        src="/kompagnon-logo.png"
        alt="Kompagnon"
        class="sidebar__brand-logo"
      >
      <template v-if="!collapsed">
        <div class="sidebar__brand-text">
          <span class="sidebar__brand-name">Kompagnon</span>
          <span class="sidebar__brand-tagline">Accompagnement solidaire</span>
        </div>
        <button
          class="sidebar__collapse-btn"
          aria-label="Réduire la barre latérale"
          @click="collapsed = true"
        >
          <KIcon
            name="chevronLeft"
            :size="14"
          />
        </button>
      </template>
      <button
        class="sidebar__close"
        type="button"
        aria-label="Fermer le menu"
        @click="closeDrawer"
      >
        <KIcon
          name="close"
          :size="18"
        />
      </button>
    </div>

    <div
      v-if="collapsed"
      class="sidebar__expand"
    >
      <button
        class="sidebar__collapse-btn"
        aria-label="Agrandir la barre latérale"
        @click="collapsed = false"
      >
        <KIcon
          name="chevronRight"
          :size="14"
        />
      </button>
    </div>

    <div
      v-if="!collapsed"
      class="sidebar__role-display"
    >
      <p class="sidebar__role-label">
        {{ userRole === "valid" ? "💚 Volontaire" : "🤝 Bénéficiaire" }}
      </p>
    </div>

    <nav class="sidebar__nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="sidebar__item"
        :class="{ 'sidebar__item--active': isActive(item.name) }"
        :aria-label="`Accéder à ${item.label}${item.badge ? ` (${item.badge} notifications)` : ''}`"
        :title="item.label"
      >
        <KIcon
          :name="item.icon"
          class="sidebar__icon"
          :size="18"
          :color="isActive(item.name) ? 'var(--c-sidebar-active-text)' : 'var(--c-sidebar-text)'"
          aria-hidden="true"
        />
        <span
          v-if="!collapsed"
          class="sidebar__item-label"
        >{{ item.label }}</span>
        <span
          v-if="item.badge && !collapsed"
          class="sidebar__badge"
        >{{ item.badge }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar__user">
      <div class="sidebar__user-avatar">
        {{ initials }}
      </div>
      <template v-if="!collapsed">
        <div class="sidebar__user-info">
          <strong class="sidebar__user-name">{{ displayName }}</strong>
          <span class="sidebar__user-status">Utilisateur actif</span>
        </div>
      </template>
    </div>

    <button
      class="sidebar__logout"
      type="button"
      @click="handleLogout"
    >
      <KIcon
        name="logout"
        :size="18"
        aria-hidden="true"
      />
      <span>Se déconnecter</span>
    </button>
  </aside>
</template>

<style scoped>
/* Mobile: off-canvas drawer opened from the bottom-nav "Menu" button. */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 55;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  animation: sidebar-fade 0.2s ease both;
}

@keyframes sidebar-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  width: min(86vw, 320px);
  height: 100dvh;
  background: var(--c-sidebar-bg);
  border-right: 1px solid var(--c-border);
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  transform: translateX(-100%);
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.3);
}

.sidebar--open {
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .sidebar-backdrop {
    display: none;
  }

  .sidebar {
    position: static;
    transform: none;
    width: 240px;
    min-width: 240px;
    height: 100dvh;
    z-index: 10;
    box-shadow: none;
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@media (min-width: 1024px) and (max-height: 900px) {
  .sidebar {
    width: 220px;
    min-width: 220px;
  }

  .sidebar--collapsed {
    width: 64px;
    min-width: 64px;
  }

  .sidebar__brand {
    min-height: 56px;
    padding: 1rem 0.875rem 0.875rem;
  }

  .sidebar__role-switcher {
    margin: 0.75rem 0.75rem 0.2rem;
  }

  .sidebar__nav {
    padding: 0.5rem;
  }

  .sidebar__item {
    min-height: 40px;
    padding: 0.625rem 0.75rem;
    border-radius: 12px;
  }

  .sidebar__user {
    padding: 0.75rem 0.875rem;
  }
}

.sidebar--collapsed {
  width: 68px;
  min-width: 68px;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1.25rem 1rem 1rem;
  border-bottom: 1px solid var(--c-border);
  min-height: 64px;
}

.sidebar__brand-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 8px;
}

.sidebar__brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}

.sidebar__brand-name {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 1.0625rem;
  color: var(--c-navy);
  letter-spacing: -0.02em;
  white-space: nowrap;
  line-height: 1.2;
}

.sidebar__brand-tagline {
  font-family: var(--font-body);
  font-size: 0.625rem;
  color: var(--c-text-light);
  line-height: 1.35;
  letter-spacing: -0.01em;
  transition: color 0.15s ease;
}

@media (prefers-color-scheme: dark) {
  .sidebar__brand-tagline {
    color: #94a3b8;
  }
}

:root.a11y-dark-mode .sidebar__brand-tagline {
  color: #cbd5e1;
}

.sidebar__collapse-btn {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 8px;
  background: var(--c-beige);
  border: 1px solid var(--c-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-medium);
  transition: background 0.15s;
}

.sidebar__collapse-btn:hover {
  background: var(--c-teal-light);
  color: var(--c-teal-dark);
}

.sidebar__expand {
  display: flex;
  justify-content: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--c-border);
}

.sidebar__role-display {
  margin: 0.875rem 0.875rem 0.25rem;
  padding: 0.75rem 1rem;
  background: var(--c-beige);
  border-radius: 12px;
  border: 1px solid var(--c-border);
}

.sidebar__role-label {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text);
  text-align: center;
}

.sidebar__role-switcher {
  display: none;
}

.sidebar__role-btn {
  display: none;
  border: 1.5px solid transparent;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.78rem;
  background: transparent;
  color: var(--c-text-light);
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.sidebar__role-btn--active {
  background: var(--c-teal);
  color: #ffffff;
  border: 1.5px solid var(--c-teal-dark);
  box-shadow: 0 4px 12px rgba(72, 175, 196, 0.4);
  font-weight: 700;
  font-size: 0.85rem;
  padding: 9px 8px;
  transform: scale(1.05);
  opacity: 1;
}

.sidebar__role-btn--active:hover {
  box-shadow: 0 6px 16px rgba(72, 175, 196, 0.5);
}

.sidebar__role-btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.04);
  color: var(--c-text-light);
  border-color: transparent;
}

/* Rôle actif du user toujours visible même quand buttons sont disabled */
.sidebar__role-btn--active.sidebar__role-btn--disabled {
  opacity: 1;
  background: var(--c-teal);
  color: #ffffff;
  border-color: var(--c-teal-dark);
}

.sidebar__role-btn-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
}

.sidebar__nav {
  flex: 1;
  padding: 0.75rem 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__section-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--c-text-light);
  padding: 0.8rem 0.5rem 0.375rem;
}

.sidebar__section-label--spaced {
  margin-top: 0.5rem;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6875rem 0.875rem;
  border-radius: 14px;
  color: var(--c-sidebar-text);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  min-height: 44px;
  position: relative;
  transition: background 0.15s, color 0.15s;
}

.sidebar--collapsed .sidebar__item {
  justify-content: center;
  padding: 0.75rem 0;
}

.sidebar__item:hover:not(.sidebar__item--active) {
  background: var(--c-beige);
  color: var(--c-navy);
}

.sidebar__item--active {
  background: var(--c-sidebar-active-bg);
  color: var(--c-sidebar-active-text);
  font-weight: 700;
}

.sidebar__icon {
  flex-shrink: 0;
}

.sidebar__item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__badge {
  background: var(--c-teal);
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  flex-shrink: 0;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-top: 1px solid var(--c-border);
  cursor: pointer;
  transition: background 0.15s;
}

.sidebar--collapsed .sidebar__user {
  justify-content: center;
}

.sidebar__user:hover {
  background: var(--c-beige);
}

.sidebar__user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-teal), #9ed4d9);
  color: #fff;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar__user-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.sidebar__user-name {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--c-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__user-status {
  font-size: 0.6875rem;
  color: var(--c-text-light);
}

/* Close button — drawer only (mobile) */
.sidebar__close {
  margin-left: auto;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--c-beige);
  border: 1px solid var(--c-border);
  color: var(--c-text-medium);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.sidebar__close:hover {
  background: var(--c-teal-light);
  color: var(--c-teal-dark);
}

/* Logout — drawer only (desktop has it in the top bar) */
.sidebar__logout {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.25rem 0.75rem calc(0.75rem + env(safe-area-inset-bottom));
  padding: 0.75rem 0.875rem;
  border: 1px solid var(--c-border);
  border-radius: 14px;
  background: transparent;
  color: var(--c-danger, #d43a3a);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.sidebar__logout:hover {
  background: var(--c-danger-bg, rgba(212, 58, 58, 0.08));
}

/* Drawer-only controls are hidden on desktop; desktop-only controls are
   hidden on mobile. */
@media (max-width: 1023px) {
  .sidebar__collapse-btn,
  .sidebar__expand {
    display: none;
  }
}

@media (min-width: 1024px) {
  .sidebar__close,
  .sidebar__logout {
    display: none;
  }
}
</style>
