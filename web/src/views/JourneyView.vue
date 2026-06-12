<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getJourney } from "@/adapters/journeys.js";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const journey = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");

const durationEstimate = computed(() => {
  if (!journey.value) return null;
  return estimateDuration(journey.value);
});

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Calcule la distance à vol d'oiseau entre deux coordonnées (formule Haversine).
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance en km
 */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Estime la durée de trajet à partir des coordonnées GPS en transports en commun.
 * On applique un facteur de détour de 1.3 (les trajets de transports en commun ne sont pas en ligne droite)
 * et un temps forfaitaire d'attente/correspondance de 8 minutes.
 * Vitesse estimée selon la distance :
 *   < 2 km  → 8 km/h (marche / bus urbain lent)
 *   2–10 km → 18 km/h (tram / métro / bus avec arrêts)
 *   10–50 km → 30 km/h (train de banlieue / RER)
 *   > 50 km → 50 km/h (train régional / intercité)
 * @param {object} j - objet trajet avec departureLat/Lon et arrivalLat/Lon
 * @returns {{ label: string, distKm: number }|null}
 */
function estimateDuration(j) {
  const lat1 = parseFloat(j?.departureLat);
  const lon1 = parseFloat(j?.departureLon);
  const lat2 = parseFloat(j?.arrivalLat);
  const lon2 = parseFloat(j?.arrivalLon);
  if ([lat1, lon1, lat2, lon2].some(isNaN)) return null;

  const distKm = haversineKm(lat1, lon1, lat2, lon2);
  const speedKmh = distKm < 2 ? 8 : distKm < 10 ? 18 : distKm < 50 ? 30 : 50;
  const totalMinutes = 8 + Math.round(((distKm * 1.3) / speedKmh) * 60);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let label;
  if (hours > 0 && minutes > 0) label = `${hours}h${String(minutes).padStart(2, "0")}`;
  else if (hours > 0) label = `${hours}h`;
  else label = `${minutes} min`;

  return { label, distKm: Math.round(distKm * 10) / 10 };
}

onMounted(async () => {
  const journeyId = route.params.journeyId;

  const result = await getJourney({ token: authStore.token, journeyId });
  isLoading.value = false;

  if (result.success) {
    journey.value = result.journey;
  } else {
    errorMessage.value = result.message ?? "Une erreur est survenue.";
  }
});
</script>

<template>
  <div class="journey-view app-page">
    <div class="journey-view__content app-page__content app-page__content--stack">
      <!-- Header -->
      <header class="journey-view__header app-page__header-main">
        <button
          class="journey-view__back"
          type="button"
          @click="router.back()"
        >
          ← Retour
        </button>
        <span class="journey-view__eyebrow app-page__eyebrow">Mes trajets</span>
        <h1 class="journey-view__title app-page__title">
          Détails du trajet
        </h1>
      </header>

      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="journey-view__loading"
        role="status"
        aria-live="polite"
      >
        <span
          class="journey-view__spinner"
          aria-hidden="true"
        />
        <span>Chargement du trajet…</span>
      </div>

      <!-- Error state -->
      <p
        v-else-if="errorMessage"
        class="feedback error feedback--error journey-view__feedback"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </p>

      <!-- Journey details -->
      <template v-else-if="journey">
        <!-- Duration banner -->
        <div
          v-if="durationEstimate"
          class="journey-view__duration-banner"
          aria-label="Durée estimée"
        >
          <div class="journey-view__duration-info">
            <span class="journey-view__duration-label">Durée estimée</span>
            <span class="journey-view__duration-dist">
              {{ durationEstimate.distKm }} km en transports en commun
            </span>
          </div>
          <span class="journey-view__duration-value">
            {{ durationEstimate.label }}
          </span>
        </div>

        <!-- Route card -->
        <div class="journey-view__card">
          <div class="journey-view__route">
            <!-- Departure -->
            <div class="journey-view__stop journey-view__stop--departure">
              <div
                class="journey-view__stop-dot journey-view__stop-dot--departure"
                aria-hidden="true"
              />
              <div class="journey-view__stop-body">
                <span class="journey-view__stop-label">Départ</span>
                <p class="journey-view__stop-address">
                  {{ journey.departureAddress }}
                </p>
                <time
                  class="journey-view__stop-time"
                  :datetime="journey.departureTime"
                >
                  {{ formatDate(journey.departureTime) }}
                </time>
              </div>
            </div>

            <!-- Vertical line -->
            <div
              class="journey-view__route-line"
              aria-hidden="true"
            />

            <!-- Arrival -->
            <div class="journey-view__stop journey-view__stop--arrival">
              <div
                class="journey-view__stop-dot journey-view__stop-dot--arrival"
                aria-hidden="true"
              />
              <div class="journey-view__stop-body">
                <span class="journey-view__stop-label">Arrivée souhaitée</span>
                <p class="journey-view__stop-address">
                  {{ journey.arrivalAddress }}
                </p>
                <time
                  class="journey-view__stop-time"
                  :datetime="journey.arrivalTime"
                >
                  {{ formatDate(journey.arrivalTime) }}
                </time>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.journey-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: transparent;
}

.journey-view__content {
  padding: 1.5rem;
  width: min(100%, 720px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* ── Header ── */
.journey-view__header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.journey-view__back {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  color: var(--c-teal-dark);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  width: fit-content;
  margin-bottom: 0.25rem;
}

.journey-view__back:hover {
  text-decoration: underline;
}

.journey-view__eyebrow {
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

.journey-view__title {
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  font-weight: 700;
  color: var(--c-navy);
  margin: 0;
  letter-spacing: -0.03em;
}

/* ── Loading ── */
.journey-view__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--c-text-medium);
  font-size: 0.95rem;
  padding: 1rem 0;
}

.journey-view__spinner {
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

/* ── Error ── */
.journey-view__feedback {
  margin: 0;
}

/* ── Duration banner ── */
.journey-view__duration-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-radius: 0.875rem;
  background: linear-gradient(135deg, var(--c-teal) 0%, #3093a8 100%);
  color: #fff;
}

.journey-view__duration-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.journey-view__duration-label {
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.85;
}

.journey-view__duration-dist {
  font-size: 0.75rem;
  opacity: 0.7;
}

.journey-view__duration-value {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* ── Card ── */
.journey-view__card {
  background: var(--c-surface);
  border-radius: 1.25rem;
  border: 1px solid var(--c-border);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
}

/* ── Route ── */
.journey-view__route {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.journey-view__stop {
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  gap: 0 1rem;
  align-items: start;
}

.journey-view__stop-dot {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 50%;
  margin-top: 0.3rem;
  flex-shrink: 0;
  justify-self: center;
}

.journey-view__stop-dot--departure {
  background: var(--c-teal);
  box-shadow: 0 0 0 3px rgba(72, 175, 196, 0.2);
}

.journey-view__stop-dot--arrival {
  background: var(--c-navy);
  box-shadow: 0 0 0 3px rgba(24, 48, 77, 0.15);
}

.journey-view__route-line {
  width: 2px;
  height: 2rem;
  background: var(--c-border);
  margin: 0.3rem 0 0.3rem calc(0.75rem - 1px);
}

.journey-view__stop-body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-bottom: 0.25rem;
}

.journey-view__stop-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--c-text-light);
}

.journey-view__stop-address {
  font-size: 0.97rem;
  font-weight: 700;
  color: var(--c-navy);
  margin: 0;
  line-height: 1.35;
}

.journey-view__stop-time {
  font-size: 0.875rem;
  color: var(--c-text-medium);
}
</style>
