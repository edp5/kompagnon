<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getJourney, getJourneyMatches, postTrackingPoint, updateFoundJourneyStatus, updateJourneyStatus } from "@/adapters/journeys.js";
import { useAuthStore } from "@/stores/auth.js";

const TRACKING_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const journey = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");
const matches = ref([]);
const matchActionId = ref(null);

// ── Tracking state ────────────────────────────────────────────────────────────

/** Current tracking status (mirrors journey.trackingStatus from API) */
const trackingStatus = ref(TRACKING_STATUS.NOT_STARTED);
/** Whether a tracking action (start/stop) is in progress */
const isTrackingLoading = ref(false);
/** Error message specific to tracking */
const trackingError = ref("");
/** True when the browser does not support geolocation or the user denied permission */
const geolocationDenied = ref(false);
/** ID returned by setInterval for the GPS polling loop */
let trackingIntervalId = null;

/**
 * Describes the state of a match for display.
 * @param {object} match - The match with myStatus and otherStatus.
 * @returns {{ actionable: boolean, message: string }}
 */
function matchState(match) {
  if (match.myStatus === STATUS.WAITING) {
    return { actionable: true, message: "" };
  }
  if (match.myStatus === STATUS.ACCEPTED && match.otherStatus === STATUS.ACCEPTED) {
    return { actionable: false, message: "Trajet confirmé, vous êtes bien en binôme." };
  }
  return { actionable: false, message: "Vous avez accepté. En attente de la réponse de l'autre personne." };
}

async function loadMatches(journeyId) {
  const result = await getJourneyMatches({ token: authStore.token, journeyId });
  if (result.success) {
    matches.value = result.matches;
  }
}

async function respondToMatch(foundJourneyId, accept) {
  matchActionId.value = foundJourneyId;
  const result = await updateFoundJourneyStatus({ token: authStore.token, foundJourneyId, accept });
  matchActionId.value = null;
  if (result.success) {
    await loadMatches(route.params.journeyId);
  }
}

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
    trackingStatus.value = result.journey.trackingStatus ?? TRACKING_STATUS.NOT_STARTED;
    await loadMatches(journeyId);
  } else {
    errorMessage.value = result.message ?? "Une erreur est survenue.";
  }
});

onUnmounted(() => {
  stopTrackingLoop();
});

// ── Tracking helpers ──────────────────────────────────────────────────────────

/**
 * Sends the current GPS position to the API.
 * Silently skips if geolocation is unavailable; marks as denied on permission error.
 */
async function sendPosition() {
  if (!navigator.geolocation) {
    geolocationDenied.value = true;
    stopTrackingLoop();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      await postTrackingPoint({
        token: authStore.token,
        journeyId: Number(route.params.journeyId),
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    },
    (err) => {
      // PERMISSION_DENIED (code 1): stop the loop and surface the error
      if (err.code === 1) {
        geolocationDenied.value = true;
        stopTrackingLoop();
      }
      // POSITION_UNAVAILABLE (2) or TIMEOUT (3): silently retry on next tick
    },
    { enableHighAccuracy: true, timeout: 10000 },
  );
}

/**
 * Starts the GPS tracking loop (sends position every 30 seconds).
 */
function startTrackingLoop() {
  sendPosition();
  trackingIntervalId = setInterval(sendPosition, 30_000);
}

/**
 * Stops the GPS tracking loop.
 */
function stopTrackingLoop() {
  if (trackingIntervalId !== null) {
    clearInterval(trackingIntervalId);
    trackingIntervalId = null;
  }
}

/**
 * Starts the journey: checks geolocation availability, updates status to
 * in_progress on the API, then begins the GPS polling loop.
 */
async function startJourney() {
  trackingError.value = "";
  geolocationDenied.value = false;

  // Check geolocation support upfront before touching the API
  if (!navigator.geolocation) {
    geolocationDenied.value = true;
    return;
  }

  // Request a first position to trigger the permission prompt before
  // persisting the status change on the server.
  const permissionGranted = await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      (err) => resolve(err.code !== 1), // only block on PERMISSION_DENIED
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });

  if (!permissionGranted) {
    geolocationDenied.value = true;
    return;
  }

  isTrackingLoading.value = true;
  const result = await updateJourneyStatus({
    token: authStore.token,
    journeyId: Number(route.params.journeyId),
    status: TRACKING_STATUS.IN_PROGRESS,
  });
  isTrackingLoading.value = false;
  if (result.success) {
    trackingStatus.value = TRACKING_STATUS.IN_PROGRESS;
    startTrackingLoop();
  } else {
    trackingError.value = result.message ?? "Impossible de démarrer le trajet.";
  }
}

/**
 * Stops the journey: updates status to completed and halts GPS loop.
 */
async function stopJourney() {
  isTrackingLoading.value = true;
  trackingError.value = "";
  stopTrackingLoop();
  const result = await updateJourneyStatus({
    token: authStore.token,
    journeyId: Number(route.params.journeyId),
    status: TRACKING_STATUS.COMPLETED,
  });
  isTrackingLoading.value = false;
  if (result.success) {
    trackingStatus.value = TRACKING_STATUS.COMPLETED;
  } else {
    trackingError.value = result.message ?? "Impossible de terminer le trajet.";
    // Re-start the loop if the API call failed
    startTrackingLoop();
  }
}

/**
 * Builds an OpenStreetMap embed URL showing the route bbox between departure and arrival.
 * @returns {string|null}
 */
const osmRouteUrl = computed(() => {
  const j = journey.value;
  if (!j) return null;
  const dLat = parseFloat(j.departureLat);
  const dLon = parseFloat(j.departureLon);
  const aLat = parseFloat(j.arrivalLat);
  const aLon = parseFloat(j.arrivalLon);
  if ([dLat, dLon, aLat, aLon].some(isNaN)) return null;

  // Bounding box with a small margin around departure and arrival
  const margin = 0.02;
  const minLon = Math.min(dLon, aLon) - margin;
  const maxLon = Math.max(dLon, aLon) + margin;
  const minLat = Math.min(dLat, aLat) - margin;
  const maxLat = Math.max(dLat, aLat) + margin;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${dLat},${dLon}`;
});

/**
 * OpenStreetMap directions link (opens in a new tab).
 */
const osmDirectionsUrl = computed(() => {
  const j = journey.value;
  if (!j) return null;
  const dLat = parseFloat(j.departureLat);
  const dLon = parseFloat(j.departureLon);
  const aLat = parseFloat(j.arrivalLat);
  const aLon = parseFloat(j.arrivalLon);
  if ([dLat, dLon, aLat, aLon].some(isNaN)) return null;
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${dLat}%2C${dLon}%3B${aLat}%2C${aLon}`;
});

/**
 * Human-readable label for the tracking status badge.
 */
const trackingStatusLabel = computed(() => {
  if (trackingStatus.value === TRACKING_STATUS.IN_PROGRESS) return "En cours";
  if (trackingStatus.value === TRACKING_STATUS.COMPLETED) return "Terminé";
  return "Non démarré";
});

const STATUS = { WAITING: "waiting", ACCEPTED: "accepted" };
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
          <!-- Tracking status badge -->
          <div class="journey-view__tracking-status">
            <span
              class="journey-view__status-badge"
              :class="{
                'journey-view__status-badge--in-progress': trackingStatus === 'in_progress',
                'journey-view__status-badge--completed': trackingStatus === 'completed',
              }"
            >
              <span
                v-if="trackingStatus === 'in_progress'"
                class="journey-view__status-pulse"
                aria-hidden="true"
              />
              {{ trackingStatusLabel }}
            </span>
          </div>
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

        <!-- Map with route itinerary -->
        <div
          v-if="osmRouteUrl"
          class="journey-view__map-block"
        >
          <div class="journey-view__map-header">
            <span class="journey-view__map-label">Itinéraire</span>
            <a
              v-if="osmDirectionsUrl"
              :href="osmDirectionsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="journey-view__map-link"
              aria-label="Ouvrir l'itinéraire dans OpenStreetMap"
            >Voir sur la carte ↗</a>
          </div>
          <iframe
            :src="osmRouteUrl"
            class="journey-view__map-iframe"
            title="Itinéraire du trajet sur OpenStreetMap"
            loading="lazy"
            aria-label="Carte OpenStreetMap affichant le trajet"
          />
        </div>

        <!-- Tracking controls -->
        <div class="journey-view__tracking">
          <p
            v-if="trackingError"
            class="feedback error feedback--error journey-view__feedback"
            role="alert"
            aria-live="assertive"
          >
            {{ trackingError }}
          </p>

          <!-- Geolocation not available or denied -->
          <div
            v-if="geolocationDenied"
            class="journey-view__geo-warning"
            role="alert"
          >
            <span class="journey-view__geo-warning-icon" aria-hidden="true">📍</span>
            <div>
              <strong>Location access required</strong>
              <p>
                Please allow location access in your browser or device settings to start tracking your journey.
              </p>
            </div>
          </div>

          <button
            v-if="trackingStatus === 'not_started'"
            id="start-journey-btn"
            type="button"
            class="journey-view__track-btn journey-view__track-btn--start"
            :disabled="isTrackingLoading || geolocationDenied"
            @click="startJourney"
          >
            {{ isTrackingLoading ? "Démarrage…" : "▶ Démarrer le trajet" }}
          </button>

          <button
            v-else-if="trackingStatus === 'in_progress'"
            id="stop-journey-btn"
            type="button"
            class="journey-view__track-btn journey-view__track-btn--stop"
            :disabled="isTrackingLoading"
            @click="stopJourney"
          >
            {{ isTrackingLoading ? "Arrêt en cours…" : "⏹ Terminer le trajet" }}
          </button>

          <p
            v-else-if="trackingStatus === 'completed'"
            class="journey-view__tracking-done"
          >
            ✓ Trajet terminé
          </p>
        </div>


        <!-- Matches -->
        <section
          v-if="matches.length"
          class="journey-view__matches"
          aria-label="Correspondances de trajet"
        >
          <h2 class="journey-view__matches-title">
            {{ matches.length > 1 ? "Correspondances trouvées" : "Correspondance trouvée" }}
          </h2>

          <article
            v-for="match in matches"
            :key="match.foundJourneyId"
            class="journey-view__match-card"
          >
            <div class="journey-view__match-head">
              <span
                class="journey-view__match-avatar"
                aria-hidden="true"
              >{{ (match.user.firstname?.[0] || "") + (match.user.lastname?.[0] || "") }}</span>
              <div class="journey-view__match-identity">
                <strong class="journey-view__match-name">
                  {{ match.user.firstname }} {{ match.user.lastname }}
                </strong>
                <span class="journey-view__match-sub">a enregistré un trajet similaire</span>
              </div>
            </div>

            <dl class="journey-view__match-journey">
              <div class="journey-view__match-row">
                <dt>Départ</dt>
                <dd>{{ match.journey.departureAddress }} · {{ formatDate(match.journey.departureTime) }}</dd>
              </div>
              <div class="journey-view__match-row">
                <dt>Arrivée</dt>
                <dd>{{ match.journey.arrivalAddress }} · {{ formatDate(match.journey.arrivalTime) }}</dd>
              </div>
            </dl>

            <div
              v-if="matchState(match).actionable"
              class="journey-view__match-actions"
            >
              <button
                type="button"
                class="journey-view__match-btn journey-view__match-btn--accept"
                :disabled="matchActionId === match.foundJourneyId"
                @click="respondToMatch(match.foundJourneyId, true)"
              >
                Accepter
              </button>
              <button
                type="button"
                class="journey-view__match-btn journey-view__match-btn--decline"
                :disabled="matchActionId === match.foundJourneyId"
                @click="respondToMatch(match.foundJourneyId, false)"
              >
                Refuser
              </button>
            </div>
            <p
              v-else
              class="journey-view__match-status"
              role="status"
            >
              {{ matchState(match).message }}
            </p>
          </article>
        </section>
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

/* Matches */
.journey-view__matches {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.journey-view__matches-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--c-navy);
}

.journey-view__match-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1.25rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.05);
}

.journey-view__match-head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.journey-view__match-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-teal), #9ed4d9);
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
}

.journey-view__match-identity {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.journey-view__match-name {
  color: var(--c-navy);
  font-size: 1rem;
}

.journey-view__match-sub {
  color: var(--c-text-medium);
  font-size: 0.82rem;
}

.journey-view__match-journey {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0.85rem 1rem;
  border-radius: 0.875rem;
  background: rgba(72, 175, 196, 0.06);
}

.journey-view__match-row {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.journey-view__match-row dt {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--c-text-light);
}

.journey-view__match-row dd {
  margin: 0;
  color: var(--c-text-medium);
  font-size: 0.9rem;
}

.journey-view__match-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.journey-view__match-btn {
  min-height: 3rem;
  border: none;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
}

.journey-view__match-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.journey-view__match-btn--accept {
  background: linear-gradient(135deg, var(--c-teal) 0%, #3093a8 100%);
  color: #fff;
}

.journey-view__match-btn--decline {
  background: transparent;
  border: 1px solid var(--c-border);
  color: var(--c-text-medium);
}

.journey-view__match-status {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  background: rgba(72, 175, 196, 0.08);
  color: var(--c-teal-dark);
  font-size: 0.9rem;
  font-weight: 600;
}

/* ── Tracking status badge ── */
.journey-view__tracking-status {
  padding: 0.75rem 1.25rem 0;
}

.journey-view__status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.875rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(100, 116, 139, 0.1);
  color: var(--c-text-medium);
  border: 1px solid rgba(100, 116, 139, 0.15);
}

.journey-view__status-badge--in-progress {
  background: rgba(34, 197, 94, 0.12);
  color: #166534;
  border-color: rgba(34, 197, 94, 0.25);
}

.journey-view__status-badge--completed {
  background: rgba(72, 175, 196, 0.12);
  color: var(--c-teal-dark);
  border-color: rgba(72, 175, 196, 0.2);
}

.journey-view__status-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse-online 2.5s ease-in-out infinite;
}

/* ── Map block ── */
.journey-view__map-block {
  border-radius: var(--radius-lg, 1rem);
  overflow: hidden;
  border: 1px solid var(--c-border);
  background: var(--c-surface);
}

.journey-view__map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
}

.journey-view__map-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--c-text-medium);
}

.journey-view__map-link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--c-teal);
  text-decoration: none;
  transition: color 0.2s;
}

.journey-view__map-link:hover {
  color: var(--c-teal-dark);
  text-decoration: underline;
}

.journey-view__map-iframe {
  width: 100%;
  height: 260px;
  border: none;
  display: block;
}

/* ── Tracking controls ── */
.journey-view__tracking {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.journey-view__track-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3.25rem;
  padding: 0.875rem 1.2rem;
  border: none;
  border-radius: 999px;
  font-size: 0.96rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}

.journey-view__track-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.journey-view__track-btn--start {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  box-shadow: 0 12px 28px rgba(34, 197, 94, 0.28);
}

.journey-view__track-btn--start:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(34, 197, 94, 0.36);
}

.journey-view__track-btn--stop {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #fff;
  box-shadow: 0 12px 28px rgba(239, 68, 68, 0.28);
}

.journey-view__track-btn--stop:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(239, 68, 68, 0.36);
}

.journey-view__tracking-done {
  margin: 0;
  padding: 0.875rem 1.25rem;
  border-radius: var(--radius-lg, 1rem);
  background: rgba(34, 197, 94, 0.08);
  color: #166534;
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* ── Geolocation warning ── */
.journey-view__geo-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg, 1rem);
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #92400e;
}

.journey-view__geo-warning-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.journey-view__geo-warning strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.journey-view__geo-warning p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.5;
}
</style>
