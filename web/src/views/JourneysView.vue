<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

import { getJourneys } from "@/adapters/journeys.js";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();

const journeys = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");
const activeTab = ref("planned");

const tabs = [
  { id: "planned", label: "Planifiés" },
  { id: "ongoing", label: "En cours" },
  { id: "past", label: "Passés" },
];

function formatShortDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Categorise journeys into planned / ongoing / past.
 * A journey is "En cours" only if it has been matched AND its time window is active.
 * An unmatched journey that is currently in its time window stays in "Planifiés".
 */
const categorised = computed(() => {
  const now = new Date();
  return {
    planned: journeys.value.filter((j) => {
      const dep = new Date(j.departureTime);
      const arr = new Date(j.arrivalTime);
      if (isNaN(dep.getTime()) || isNaN(arr.getTime())) {
        return true; // Fallback: display in planned if dates are invalid
      }
      const inWindow = dep <= now && arr >= now;
      return dep > now || (inWindow && !j.isMatched);
    }),
    ongoing: journeys.value.filter((j) => {
      const dep = new Date(j.departureTime);
      const arr = new Date(j.arrivalTime);
      if (isNaN(dep.getTime()) || isNaN(arr.getTime())) {
        return false;
      }
      return dep <= now && arr >= now && j.isMatched;
    }),
    past: journeys.value.filter((j) => {
      const arr = new Date(j.arrivalTime);
      if (isNaN(arr.getTime())) {
        return false;
      }
      return arr < now;
    }),
  };
});

const displayed = computed(() => categorised.value[activeTab.value] ?? []);

onMounted(async () => {
  const result = await getJourneys({ token: authStore.token });
  isLoading.value = false;

  if (result.success) {
    journeys.value = result.journeys;
  } else {
    errorMessage.value = result.message ?? "Une erreur est survenue.";
  }
});
</script>

<template>
  <div class="journeys-view app-page">
    <div class="journeys-view__content app-page__content app-page__content--stack">
      <!-- Header -->
      <header class="journeys-view__header app-page__header-main">
        <span class="journeys-view__eyebrow app-page__eyebrow">Mon compte</span>
        <div class="journeys-view__title-row">
          <h1 class="journeys-view__title app-page__title">
            Mes trajets
          </h1>
          <RouterLink
            :to="{ name: 'record-journey' }"
            class="journeys-view__new-btn"
            aria-label="Enregistrer un nouveau trajet"
            title="Nouveau trajet"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau
          </RouterLink>
        </div>
      </header>

      <!-- Loading -->
      <div
        v-if="isLoading"
        class="journeys-view__loading"
        role="status"
        aria-live="polite"
      >
        <span
          class="journeys-view__spinner"
          aria-hidden="true"
        />
        <span>Chargement de vos trajets…</span>
      </div>

      <!-- Error -->
      <p
        v-else-if="errorMessage"
        class="feedback error feedback--error"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </p>

      <!-- Content -->
      <template v-else>
        <!-- Tabs -->
        <div
          class="journeys-view__tabs"
          role="tablist"
          aria-label="Filtrer les trajets"
        >
          <button
            v-for="tab in tabs"
            :id="`tab-${tab.id}`"
            :key="tab.id"
            class="journeys-view__tab"
            :class="{ 'journeys-view__tab--active': activeTab === tab.id }"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`panel-${tab.id}`"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
            <span
              class="journeys-view__tab-count"
              :class="{ 'journeys-view__tab-count--active': activeTab === tab.id }"
            >
              {{ categorised[tab.id].length }}
            </span>
          </button>
        </div>

        <!-- Panel -->
        <div
          :id="`panel-${activeTab}`"
          :aria-labelledby="`tab-${activeTab}`"
          role="tabpanel"
          class="journeys-view__panel"
        >
          <!-- Empty state -->
          <div
            v-if="displayed.length === 0"
            class="journeys-view__empty"
          >
            <div
              class="journeys-view__empty-icon"
              aria-hidden="true"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 11l19-9-9 19-2-8-8-2z" />
              </svg>
            </div>
            <p class="journeys-view__empty-title">
              {{ activeTab === 'planned' ? 'Aucun trajet planifié' : activeTab === 'ongoing' ? 'Aucun trajet en cours' : 'Aucun trajet passé' }}
            </p>
            <p class="journeys-view__empty-sub">
              {{ activeTab === 'planned' ? 'Enregistrez votre prochain déplacement pour qu\'il apparaisse ici.' : 'Vos trajets terminés apparaîtront dans cet onglet.' }}
            </p>
            <RouterLink
              v-if="activeTab === 'planned'"
              :to="{ name: 'record-journey' }"
              class="journeys-view__empty-cta"
            >
              Enregistrer un trajet
            </RouterLink>
          </div>

          <!-- Journey cards -->
          <ul
            v-else
            class="journeys-view__list"
            aria-label="Liste des trajets"
          >
            <li
              v-for="journey in displayed"
              :key="journey.id"
              class="journeys-view__item"
            >
              <RouterLink
                :to="{ name: 'journey', params: { journeyId: journey.id } }"
                class="journeys-view__card"
                :aria-label="`Trajet de ${journey.departureAddress} à ${journey.arrivalAddress}`"
              >
                <div class="journeys-view__card-body">
                  <!-- Status badge -->
                  <span
                    class="journeys-view__status"
                    :class="{
                      'journeys-view__status--planned': activeTab === 'planned',
                      'journeys-view__status--ongoing': activeTab === 'ongoing',
                      'journeys-view__status--past': activeTab === 'past',
                    }"
                  >
                    {{ activeTab === 'planned' ? 'Planifié' : activeTab === 'ongoing' ? 'En cours' : 'Passé' }}
                  </span>

                  <!-- Route -->
                  <div class="journeys-view__route">
                    <!-- Departure -->
                    <div class="journeys-view__stop">
                      <div
                        class="journeys-view__dot journeys-view__dot--dep"
                        aria-hidden="true"
                      />
                      <div class="journeys-view__stop-body">
                        <span class="journeys-view__stop-label">Départ</span>
                        <p class="journeys-view__stop-address">
                          {{ journey.departureAddress }}
                        </p>
                        <time
                          class="journeys-view__stop-time"
                          :datetime="journey.departureTime"
                        >
                          {{ formatShortDate(journey.departureTime) }} · {{ formatTime(journey.departureTime) }}
                        </time>
                      </div>
                    </div>

                    <div
                      class="journeys-view__line"
                      aria-hidden="true"
                    />

                    <!-- Arrival -->
                    <div class="journeys-view__stop">
                      <div
                        class="journeys-view__dot journeys-view__dot--arr"
                        aria-hidden="true"
                      />
                      <div class="journeys-view__stop-body">
                        <span class="journeys-view__stop-label">Arrivée</span>
                        <p class="journeys-view__stop-address">
                          {{ journey.arrivalAddress }}
                        </p>
                        <time
                          class="journeys-view__stop-time"
                          :datetime="journey.arrivalTime"
                        >
                          {{ formatShortDate(journey.arrivalTime) }} · {{ formatTime(journey.arrivalTime) }}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Arrow -->
                <div
                  class="journeys-view__arrow"
                  aria-hidden="true"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </RouterLink>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.journeys-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.journeys-view__content {
  padding: 1.5rem;
  width: min(100%, 720px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Header ── */
.journeys-view__header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.journeys-view__eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.12);
  border: 1px solid rgba(72, 175, 196, 0.2);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-teal-dark);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.journeys-view__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.journeys-view__title {
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  font-weight: 700;
  color: var(--c-navy);
  margin: 0;
  letter-spacing: -0.03em;
}

.journeys-view__new-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: var(--c-teal);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s, transform 0.15s;
  white-space: nowrap;
}

.journeys-view__new-btn:hover {
  background: var(--c-teal-dark);
  transform: translateY(-1px);
}

/* ── Loading ── */
.journeys-view__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--c-text-medium);
  font-size: 0.95rem;
}

.journeys-view__spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--c-border);
  border-top-color: var(--c-teal);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Tabs ── */
.journeys-view__tabs {
  display: flex;
  gap: 0.5rem;
  background: var(--c-beige);
  border: 1px solid var(--c-border);
  border-radius: 1rem;
  padding: 0.35rem;
}

.journeys-view__tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.7rem;
  border: none;
  background: transparent;
  color: var(--c-text-light);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.journeys-view__tab--active {
  background: #fff;
  color: var(--c-navy);
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.1);
}

.journeys-view__tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: var(--c-border);
  color: var(--c-text-light);
  font-size: 0.7rem;
  font-weight: 700;
  transition: background 0.15s, color 0.15s;
}

.journeys-view__tab-count--active {
  background: rgba(72, 175, 196, 0.15);
  color: var(--c-teal-dark);
}

/* ── Panel ── */
.journeys-view__panel {
  display: flex;
  flex-direction: column;
}

/* ── Empty state ── */
.journeys-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  text-align: center;
}

.journeys-view__empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--c-beige);
  border: 1.5px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-light);
}

.journeys-view__empty-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-navy);
  margin: 0;
}

.journeys-view__empty-sub {
  font-size: 0.875rem;
  color: var(--c-text-medium);
  margin: 0;
  max-width: 30ch;
}

.journeys-view__empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  border-radius: 999px;
  background: var(--c-teal);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: background 0.15s, transform 0.15s;
}

.journeys-view__empty-cta:hover {
  background: var(--c-teal-dark);
  transform: translateY(-1px);
}

/* ── List ── */
.journeys-view__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.journeys-view__item {
  display: contents;
}

/* ── Card ── */
.journeys-view__card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.125rem 1.125rem 1.125rem 1.25rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 1.25rem;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-card);
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  overflow: hidden;
}

.journeys-view__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
  border-color: var(--c-teal);
}

/* ── Card body (status + route) — absorbs width ── */
.journeys-view__card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

/* ── Status badge ── */
.journeys-view__status {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.journeys-view__status--planned {
  background: rgba(72, 175, 196, 0.12);
  color: var(--c-teal-dark);
}

.journeys-view__status--ongoing {
  background: rgba(255, 160, 60, 0.12);
  color: #c96a00;
}

.journeys-view__status--past {
  background: var(--c-beige);
  color: var(--c-text-light);
}

/* ── Route within card ── */
.journeys-view__route {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}

.journeys-view__stop {
  display: grid;
  grid-template-columns: 1rem 1fr;
  gap: 0 0.75rem;
  align-items: start;
  min-width: 0;
}

.journeys-view__dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  margin-top: 0.3rem;
  justify-self: center;
  flex-shrink: 0;
}

.journeys-view__dot--dep {
  background: var(--c-teal);
  box-shadow: 0 0 0 3px rgba(72, 175, 196, 0.2);
}

.journeys-view__dot--arr {
  background: var(--c-navy);
  box-shadow: 0 0 0 3px rgba(24, 48, 77, 0.12);
}

.journeys-view__line {
  width: 1.5px;
  height: 1.1rem;
  background: var(--c-border);
  margin: 0.15rem 0 0.15rem calc(0.5rem - 0.75px);
}

.journeys-view__stop-body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
  overflow: hidden;
}

.journeys-view__stop-label {
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-text-light);
}

.journeys-view__stop-address {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-navy);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.journeys-view__stop-time {
  font-size: 0.78rem;
  color: var(--c-text-medium);
  white-space: nowrap;
}

/* ── Arrow ── */
.journeys-view__arrow {
  flex-shrink: 0;
  color: var(--c-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--c-beige);
  border: 1px solid var(--c-border);
  transition: background 0.15s, color 0.15s;
}

.journeys-view__card:hover .journeys-view__arrow {
  background: rgba(72, 175, 196, 0.12);
  color: var(--c-teal-dark);
}
</style>
