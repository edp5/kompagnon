<script setup>
import { computed, onMounted, ref } from "vue";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/adapters/notifications.js";
import KIcon from "@/components/KIcon.vue";
import { useAuthStore } from "@/stores/auth.js";

const NOTIFICATION_PRESENTATION = {
  journey_match_found: {
    icon: "route",
    iconBg: "rgba(72, 175, 196, 0.12)",
    iconColor: "#2f8fa8",
    borderColor: "#48afc4",
  },
};

const DEFAULT_PRESENTATION = {
  icon: "notifications",
  iconBg: "rgba(15, 23, 42, 0.06)",
  iconColor: "#475569",
  borderColor: "#94a3b8",
};

const authStore = useAuthStore();

const activeFilter = ref("all");
const notifications = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");
const actionId = ref(null);

const displayed = computed(() =>
  activeFilter.value === "unread" ? notifications.value.filter((n) => n.unread) : notifications.value,
);

const unreadCount = computed(() => notifications.value.filter((n) => n.unread).length);

/**
 * Formats an ISO date into a short relative French label.
 * @param {string} isoString - The ISO date to format.
 * @returns {string} The relative time label.
 */
function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `il y a ${diffHours} h`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "hier";
  if (diffDays < 7) return `il y a ${diffDays} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

/**
 * Maps a raw API notification to the shape expected by the template.
 * @param {object} notification - The raw notification returned by the API.
 * @returns {object} The notification enriched with its display fields.
 */
function toDisplayNotification(notification) {
  const presentation = NOTIFICATION_PRESENTATION[notification.type] ?? DEFAULT_PRESENTATION;
  return {
    id: notification.id,
    title: notification.title,
    text: notification.message,
    unread: !notification.isRead,
    time: formatRelativeTime(notification.created_at),
    ...presentation,
  };
}

function setFilter(f) {
  activeFilter.value = f;
}

async function loadNotifications() {
  isLoading.value = true;
  errorMessage.value = "";
  const result = await getNotifications({ token: authStore.token });
  isLoading.value = false;
  if (result.success) {
    notifications.value = result.notifications.map(toDisplayNotification);
  } else {
    errorMessage.value = result.message ?? "Impossible de récupérer vos notifications.";
  }
}

async function markAsRead(notification) {
  actionId.value = notification.id;
  const result = await markNotificationAsRead({ token: authStore.token, notificationId: notification.id });
  actionId.value = null;
  if (result.success) {
    notification.unread = false;
  }
}

async function markAllAsRead() {
  const result = await markAllNotificationsAsRead({ token: authStore.token });
  if (result.success) {
    for (const notification of notifications.value) {
      notification.unread = false;
    }
  }
}

async function removeNotification(notification) {
  actionId.value = notification.id;
  const result = await deleteNotification({ token: authStore.token, notificationId: notification.id });
  actionId.value = null;
  if (result.success) {
    notifications.value = notifications.value.filter((n) => n.id !== notification.id);
  }
}

onMounted(loadNotifications);
</script>

<template>
  <div class="notif-view app-page">
    <header class="notif-header app-page__header">
      <div class="notif-header__left app-page__header-main">
        <span class="notif-header__eyebrow app-page__eyebrow">Centre de messages</span>
        <div class="notif-header__title-row">
          <h1 class="notif-header__title app-page__title">
            Notifications
          </h1>
          <span
            v-if="unreadCount > 0"
            class="notif-header__badge"
          >{{ unreadCount }} non lue{{ unreadCount > 1 ? 's' : '' }}</span>
        </div>
        <p class="notif-header__sub app-page__subtitle">
          Restez informé de vos accompagnements et activités
        </p>
      </div>
      <div class="notif-filters">
        <button
          class="notif-filter-btn"
          :class="{ 'notif-filter-btn--active': activeFilter === 'all' }"
          aria-label="Afficher toutes vos notifications"
          :aria-pressed="activeFilter === 'all'"
          @click="setFilter('all')"
        >
          Toutes ({{ notifications.length }})
        </button>
        <button
          class="notif-filter-btn"
          :class="{ 'notif-filter-btn--active': activeFilter === 'unread' }"
          aria-label="Afficher uniquement vos notifications non lues"
          :aria-pressed="activeFilter === 'unread'"
          @click="setFilter('unread')"
        >
          Non lues ({{ unreadCount }})
        </button>
      </div>
    </header>

    <div class="notif-content app-page__content app-page__content--stack">
      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="notif-loading"
        role="status"
        aria-live="polite"
      >
        <span
          class="notif-spinner"
          aria-hidden="true"
        />
        <span>Chargement des notifications…</span>
      </div>

      <!-- Error state -->
      <p
        v-else-if="errorMessage"
        class="feedback error feedback--error"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </p>

      <template v-else>
        <!-- Banner unread -->
        <div
          v-if="unreadCount > 0"
          class="notif-banner notif-card glass-panel"
        >
          <div class="notif-banner__left">
            <div class="notif-banner__dot" />
            <span>{{ unreadCount }} notification{{ unreadCount > 1 ? 's' : '' }} non lue{{ unreadCount > 1 ? 's' : '' }}</span>
          </div>
          <a
            href="#"
            class="notif-banner__link"
            aria-label="Marquer toutes les notifications comme lues"
            title="Cliquez pour marquer l'ensemble des notifications comme lues"
            @click.prevent="markAllAsRead"
          >Tout marquer comme lu →</a>
        </div>

        <!-- Notification list -->
        <div class="notif-list">
          <article
            v-for="n in displayed"
            :key="n.id"
            class="notif-item notif-card glass-panel"
            :class="{ 'notif-item--unread': n.unread }"
            :style="n.unread ? `border-left-color: ${n.borderColor}` : ''"
          >
            <div
              class="notif-item__icon"
              :style="{ background: n.iconBg, color: n.iconColor }"
            >
              <KIcon
                :name="n.icon"
                :size="20"
                aria-hidden="true"
              />
            </div>
            <div class="notif-item__body">
              <div class="notif-item__header">
                <strong class="notif-item__title">{{ n.title }}</strong>
                <div class="notif-item__time-row">
                  <span class="notif-item__time">{{ n.time }}</span>
                  <span
                    v-if="n.unread"
                    class="notif-item__dot"
                  />
                </div>
              </div>
              <p class="notif-item__text">
                {{ n.text }}
              </p>
              <a
                v-if="n.unread"
                href="#"
                class="notif-item__mark"
                aria-label="Marquer cette notification comme lue"
                title="Cliquez pour marquer comme lue"
                @click.prevent="markAsRead(n)"
              >Marquer comme lu</a>
            </div>
            <button
              class="notif-item__del"
              :aria-label="`Supprimer la notification: ${n.title}`"
              :title="`Supprimer cette notification: ${n.title}`"
              :disabled="actionId === n.id"
              @click="removeNotification(n)"
            >
              <KIcon
                name="close"
                :size="15"
                aria-hidden="true"
              />
            </button>
          </article>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@keyframes spring-in {
  0% { opacity: 0; transform: translateY(20px) scale(0.97); }
  60% { opacity: 1; transform: translateY(-4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.notif-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: transparent;
}

/* -- Header -- */
.notif-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 0.75rem;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.notif-header__left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.notif-header__eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.12);
  border: 1px solid rgba(72, 175, 196, 0.2);
  font-size: 0.72rem;
  font-weight: 600;
  color: #2a5f70;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.notif-header__title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.notif-header__title {
  font-size: clamp(1.6rem, 2.2vw, 2.2rem);
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.notif-header__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: var(--kompagnon-turquoise);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
}

.notif-header__sub {
  font-size: 0.9rem;
  color: #7b8794;
  margin: 0;
}

/* -- Filters -- */
.notif-filters {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.notif-filter-btn {
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: 1.5px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.88);
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  min-height: 38px;
  backdrop-filter: blur(8px);
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
}

.notif-filter-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(72, 175, 196, 0.3);
}

.notif-filter-btn--active {
  background: var(--kompagnon-turquoise);
  color: white;
  border-color: var(--kompagnon-turquoise);
  box-shadow: 0 6px 16px rgba(72, 175, 196, 0.28);
}

/* -- Loading -- */
.notif-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #7b8794;
  font-size: 0.95rem;
  padding: 1rem 1.5rem;
}

.notif-spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(15, 23, 42, 0.1);
  border-top-color: var(--kompagnon-turquoise);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* -- Content -- */
.notif-content {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: min(100%, 1260px);
  max-width: none;
  margin: 0 auto;
}

/* -- Base card -- */
.notif-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 10px 32px rgba(15, 23, 42, 0.05),
    0 2px 6px rgba(15, 23, 42, 0.03);
  backdrop-filter: blur(10px);
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* -- Banner -- */
.notif-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.25rem;
  background: linear-gradient(135deg, rgba(72, 175, 196, 0.08) 0%, rgba(158, 212, 217, 0.12) 100%);
  border-color: rgba(72, 175, 196, 0.2);
}

.notif-banner__left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--kompagnon-navy);
}

.notif-banner__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kompagnon-turquoise);
  flex-shrink: 0;
}

.notif-banner__link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--kompagnon-turquoise-dark);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s;
}

.notif-banner__link:hover {
  color: #2a5f70;
}

/* -- Notification list -- */
.notif-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

@media (min-width: 1180px) {
  .notif-content {
    width: min(100%, 1320px);
  }

  .notif-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.875rem;
  }

  .notif-item {
    min-height: 100%;
  }
}

.notif-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  border-left: 3px solid transparent;
  padding: 1.1rem 1.1rem 1.1rem 1rem;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}

.notif-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
}

.notif-item--unread {
  background: rgba(240, 249, 255, 0.96);
}

.notif-item__icon {
  width: 42px;
  height: 42px;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-item__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.notif-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.notif-item__title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
}

.notif-item__time-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.notif-item__time {
  font-size: 0.8rem;
  color: #9ca3af;
  white-space: nowrap;
}

.notif-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kompagnon-turquoise);
  flex-shrink: 0;
}

.notif-item__text {
  font-size: 0.875rem;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

.notif-item__mark {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--kompagnon-turquoise);
  text-decoration: none;
  margin-top: 0.125rem;
  transition: color 0.2s;
}

.notif-item__mark:hover {
  color: #2a5f70;
}

.notif-item__del {
  width: 34px;
  height: 34px;
  border: 1.5px solid rgba(15, 23, 42, 0.07);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  flex-shrink: 0;
  min-width: 34px;
  min-height: 34px;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
}

.notif-item__del:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #ef4444;
  transform: scale(1.1);
}

@media (max-width: 1023px) and (min-width: 769px) {
  .notif-header { padding: 1.25rem 1.25rem 0.875rem; }
  .notif-content { padding: 0 1.25rem 1.25rem; }
}

@media (max-width: 640px) {
  .notif-header { padding: 1rem 1rem 0.75rem; flex-direction: column; align-items: flex-start; }
  .notif-content { padding: 0 1rem 1rem; }
  .notif-item__header { flex-direction: column; align-items: flex-start; gap: 0.25rem; }
}
</style>
