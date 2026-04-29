<script setup>
import {
  Bell,
  HelpCircle,
  Home,
  Lock,
  Map,
  Settings,
  User,
  Users,
} from "lucide-vue-next";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const navItems = [
  { name: "home", label: "Accueil", icon: Home },
  { name: "map", label: "Carte", icon: Map },
  { name: "connect", label: "Mise en relation", icon: Users },
  { name: "profile", label: "Profil", icon: User },
];

const settingsItems = [
  { name: "notifications", label: "Notifications", icon: Bell, badge: 3 },
  { name: "settings", label: "Paramètres", icon: Settings },
  { name: "support", label: "Support", icon: HelpCircle },
  { name: "privacy", label: "Confidentialité", icon: Lock },
];

function isActive(routeName) {
  return route.name === routeName;
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <img
        src="/kompagnon-logo.png"
        alt="Kompagnon"
        class="sidebar__brand-logo"
      >
      <div class="sidebar__brand-text">
        <strong class="sidebar__brand-name">Kompagnon</strong>
        <span class="sidebar__brand-tagline">Accompagnement solidaire</span>
      </div>
    </div>

    <nav class="sidebar__nav">
      <span class="sidebar__section-label">Navigation</span>

      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="sidebar__item"
        :class="{ 'sidebar__item--active': isActive(item.name) }"
        :aria-label="`Accéder à ${item.label}`"
        :title="`Naviguer vers: ${item.label}`"
      >
        <component
          :is="item.icon"
          class="sidebar__icon"
          :size="18"
          :stroke-width="1.75"
          aria-hidden="true"
        />
        {{ item.label }}
      </RouterLink>

      <span class="sidebar__section-label sidebar__section-label--spaced">Paramètres</span>

      <RouterLink
        v-for="item in settingsItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="sidebar__item"
        :class="{ 'sidebar__item--active': isActive(item.name) }"
        :aria-label="`Accéder à ${item.label}${item.badge ? ` (${item.badge} ${item.badge > 1 ? 'éléments' : 'élément'} en attente)` : ''}`"
        :title="`Naviguer vers: ${item.label}`"
      >
        <component
          :is="item.icon"
          class="sidebar__icon"
          :size="18"
          :stroke-width="1.75"
          aria-hidden="true"
        />
        {{ item.label }}
        <span
          v-if="item.badge"
          class="sidebar__badge"
          :aria-label="`${item.badge} ${item.badge > 1 ? 'notifications' : 'notification'} en attente`"
        >{{ item.badge }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar__user">
      <div class="sidebar__user-avatar">
        MD
      </div>
      <div class="sidebar__user-info">
        <strong class="sidebar__user-name">Marie Dubois</strong>
        <span class="sidebar__user-status">Utilisateur actif</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 248px;
  min-width: 248px;
  height: 100vh;
  /* Brand navy — not cold Tailwind gray-900 (#111827) */
  background: linear-gradient(175deg, var(--brand-navy) 0%, #1a2d3e 55%, var(--brand-navy-mid) 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  box-shadow: 2px 0 16px rgba(30, 44, 56, 0.18);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.4rem 1.15rem 1.1rem;
}

.sidebar__brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  padding: 0.2rem;
}

.sidebar__brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.sidebar__brand-name {
  font-size: 1rem;
  font-weight: 700;
  color: #f0f6fb;
  line-height: 1.2;
}

.sidebar__brand-tagline {
  font-size: 0.72rem;
  color: rgba(158, 212, 217, 0.65);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__nav {
  flex: 1;
  padding: 0 0.8rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.sidebar__section-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(158, 212, 217, 0.45);
  padding: 0.9rem 0.55rem 0.45rem;
  margin-top: 0.35rem;
}

.sidebar__section-label--spaced {
  margin-top: 0.75rem;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 0.95rem;
  border-radius: var(--radius-lg);
  color: rgba(226, 236, 245, 0.82);
  text-decoration: none;
  font-size: 0.94rem;
  font-weight: 600;
  line-height: 1;
  min-height: 46px;
  position: relative;
  transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease;
}

.sidebar__item:hover:not(.sidebar__item--active) {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
  transform: translateX(2px);
}

.sidebar__item--active {
  background: linear-gradient(135deg, var(--brand-turquoise) 0%, var(--brand-turquoise-dark) 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(72, 175, 196, 0.32);
}

.sidebar__icon {
  flex-shrink: 0;
}

.sidebar__badge {
  margin-left: auto;
  background: #f97316;
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1rem 1.15rem;
  margin: auto 0.8rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
}

.sidebar__user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(72, 175, 196, 0.22);
  color: #c9f5ff;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar__user-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.sidebar__user-name {
  font-size: 0.92rem;
  font-weight: 600;
  color: #f0f6fb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__user-status {
  font-size: 0.76rem;
  color: rgba(158, 212, 217, 0.65);
}
</style>
