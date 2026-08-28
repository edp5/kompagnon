<script setup>
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import { getJourneys } from "@/adapters/journeys.js";
import KIcon from "@/components/KIcon.vue";
import { useGeolocation } from "@/composables/useGeolocation.js";
import { useAuthStore } from "@/stores/auth.js";

// Vite does not resolve Leaflet's default marker asset paths, so they must be provided explicitly.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const PARIS_CENTER = [48.8566, 2.3522];
const DEFAULT_ZOOM = 12;

const authStore = useAuthStore();
const { coords, error: geolocationError, isLoading: isLocating, isSupported: isGeolocationSupported, locate } = useGeolocation();

const mapContainer = ref(null);
const journeys = ref([]);
const isLoadingJourneys = ref(true);
const journeysError = ref("");
const volunteers = [];

let map = null;
let userMarker = null;
let journeyLayers = [];

/**
 * Extracts the valid departure/arrival coordinate pairs from the loaded journeys.
 * @returns {Array<{ departure: [number, number], arrival: [number, number], journey: object }>}
 */
const validJourneys = computed(() =>
  journeys.value
    .map((journey) => {
      const departure = [parseFloat(journey.departureLat), parseFloat(journey.departureLon)];
      const arrival = [parseFloat(journey.arrivalLat), parseFloat(journey.arrivalLon)];
      return { departure, arrival, journey };
    })
    .filter(({ departure, arrival }) => [...departure, ...arrival].every((value) => !Number.isNaN(value))),
);

function clearJourneyLayers() {
  for (const layer of journeyLayers) {
    map.removeLayer(layer);
  }
  journeyLayers = [];
}

function renderJourneys() {
  if (!map) return;
  clearJourneyLayers();

  for (const { departure, arrival, journey } of validJourneys.value) {
    const departureMarker = L.marker(departure).bindPopup(`Départ · ${journey.departureAddress ?? "Adresse inconnue"}`);
    const arrivalMarker = L.marker(arrival).bindPopup(`Arrivée · ${journey.arrivalAddress ?? "Adresse inconnue"}`);
    const link = L.polyline([departure, arrival], { color: "#2f8fa8", weight: 3, dashArray: "6 6" });

    departureMarker.addTo(map);
    arrivalMarker.addTo(map);
    link.addTo(map);

    journeyLayers.push(departureMarker, arrivalMarker, link);
  }

  fitMapToContent();
}

function updateUserMarker(position) {
  if (!map || !position) return;
  const point = [position.latitude, position.longitude];

  if (!userMarker) {
    userMarker = L.circleMarker(point, {
      radius: 8,
      weight: 2,
      color: "#fff",
      fillColor: "#2f8fa8",
      fillOpacity: 1,
    })
      .bindPopup("Votre position")
      .addTo(map);
  } else {
    userMarker.setLatLng(point);
  }

  fitMapToContent();
}

function fitMapToContent() {
  if (!map) return;

  const points = validJourneys.value.flatMap(({ departure, arrival }) => [departure, arrival]);
  if (coords.value) {
    points.push([coords.value.latitude, coords.value.longitude]);
  }

  if (points.length > 1) {
    map.fitBounds(points, { padding: [48, 48] });
  } else if (points.length === 1) {
    map.setView(points[0], DEFAULT_ZOOM);
  }
}

async function loadJourneys() {
  isLoadingJourneys.value = true;
  journeysError.value = "";

  const result = await getJourneys({ token: authStore.token });
  isLoadingJourneys.value = false;

  if (result.success) {
    journeys.value = result.journeys;
    renderJourneys();
  } else {
    journeysError.value = result.message ?? "Impossible de récupérer vos trajets.";
  }
}

onMounted(() => {
  map = L.map(mapContainer.value).setView(PARIS_CENTER, DEFAULT_ZOOM);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
    maxZoom: 19,
  }).addTo(map);

  locate();
  loadJourneys();
});

watch(coords, (position) => {
  updateUserMarker(position);
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<template>
  <div class="map-view app-page">
    <!-- Carte interactive Leaflet centrée sur les trajets de l'utilisateur et sa position -->
    <div class="map-container">
      <div
        ref="mapContainer"
        class="map-canvas"
        role="application"
        aria-label="Carte des trajets"
      />

      <div
        v-if="isLoadingJourneys"
        class="map-overlay map-overlay--loading"
        role="status"
        aria-live="polite"
      >
        Chargement des trajets…
      </div>

      <p
        v-if="journeysError"
        class="map-overlay map-overlay--error"
        role="alert"
      >
        {{ journeysError }}
      </p>

      <p
        v-if="!isGeolocationSupported || geolocationError"
        class="map-overlay map-overlay--geolocation"
        role="status"
      >
        {{ geolocationError || "La géolocalisation n'est pas disponible sur cet appareil." }}
      </p>

      <button
        type="button"
        class="map-locate-btn"
        aria-label="Me géolocaliser"
        :disabled="isLocating || !isGeolocationSupported"
        @click="locate"
      >
        <KIcon
          name="tracking"
          :size="18"
          aria-hidden="true"
        />
      </button>
    </div>


    <div class="map-volunteers">
      <header class="map-volunteers__header">
        <div>
          <p class="map-volunteers__eyebrow">
            Réseau actif
          </p>
          <h2 class="map-volunteers__title">
            Volontaires proches
          </h2>
        </div>
        <a
          href="#"
          class="map-section__more"
          aria-label="Voir tous les volontaires"
        >Voir tout</a>
      </header>

      <div class="map-vcards">
        <div
          v-for="v in volunteers"
          :key="v.name"
          class="vcard"
        >
          <div class="vcard__header">
            <div class="vcard__avatar-wrap">
              <div class="vcard__avatar">
                {{ v.initials }}
              </div>
              <span
                class="vcard__online"
                aria-hidden="true"
              />
            </div>
            <div class="vcard__info">
              <div class="vcard__name-row">
                <strong class="vcard__name">{{ v.name }}</strong>
                <span class="vcard__distance">{{ v.distance }}</span>
              </div>
              <div class="vcard__rating-row">
                <KIcon
                  name="star"
                  :size="12"
                  color="#fbbf24"
                  aria-hidden="true"
                />
                <span class="vcard__rating">{{ v.rating }}</span>
                <span class="vcard__reviews">· {{ v.reviews }} avis</span>
                <span
                  class="vcard__tag"
                  :class="v.availabilityClass"
                >{{ v.availability }}</span>
              </div>
              <div class="vcard__tags">
                <span
                  v-for="tag in v.tags"
                  :key="tag"
                  class="vcard__chip"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
          <div class="vcard__actions">
            <button
              class="vcard__contact-btn"
              :aria-label="`Contacter ${v.name}`"
            >
              Contacter
            </button>
            <button
              class="vcard__phone-btn"
              :aria-label="`Appeler ${v.name}`"
            >
              <KIcon
                name="phone"
                :size="15"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="map-emergency">
      <button
        class="map-emergency__btn"
        aria-label="Demande d'urgence"
      >
        <KIcon
          name="bell"
          :size="18"
          aria-hidden="true"
        />
        Demande d'urgence
      </button>
    </div>
  </div>
</template>

<style scoped>
.map-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--c-bg);
  overflow-y: auto;
}

.map-container {
  width: 100%;
  height: 420px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.map-canvas {
  width: 100%;
  height: 100%;
}

.map-overlay {
  position: absolute;
  left: 0.75rem;
  z-index: 1000;
  margin: 0;
  padding: 0.5rem 0.85rem;
  border-radius: 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: var(--shadow-card);
}

.map-overlay--loading {
  top: 0.75rem;
  background: var(--c-surface);
  color: var(--c-text-medium);
}

.map-overlay--error {
  top: 0.75rem;
  background: #fee2e2;
  color: #b91c1c;
}

.map-overlay--geolocation {
  bottom: 0.75rem;
  background: var(--c-surface);
  color: var(--c-text-medium);
}

.map-locate-btn {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  z-index: 1000;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--c-surface);
  color: var(--c-teal-dark);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.map-locate-btn:hover:not(:disabled) {
  transform: scale(1.06);
  box-shadow: var(--shadow-card-hov);
}

.map-locate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.map-volunteers {
  padding: 1.25rem 1.5rem;
  width: min(100%, 1320px);
  margin: 0 auto;
  flex: 1;
  max-height: 30%;
  overflow-y: auto;
  background: var(--c-surface);
  border-top: 1px solid var(--c-border);
}


.map-volunteers__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.map-volunteers__eyebrow {
  margin: 0 0 0.15rem;
  font-size: 0.72rem;
  color: var(--c-text-light);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.map-volunteers__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 1.6vw, 1.5rem);
  font-weight: 800;
  color: var(--c-navy);
  letter-spacing: -0.025em;
}

.map-section__more {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--c-teal);
  text-decoration: none;
  transition: color 0.2s;
}

.map-section__more:hover { color: var(--c-teal-dark); }

.map-vcards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.875rem;
}

.vcard {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  box-shadow: var(--shadow-card);
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: transform 0.25s, box-shadow 0.2s, border-color 0.2s;
}

.vcard:nth-child(1) { animation-delay: 0.06s; }
.vcard:nth-child(2) { animation-delay: 0.1s; }
.vcard:nth-child(3) { animation-delay: 0.14s; }

.vcard:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hov);
  border-color: rgba(72, 175, 196, 0.28);
}

.vcard__header { display: flex; gap: 0.75rem; }

.vcard__avatar-wrap { position: relative; flex-shrink: 0; }

.vcard__avatar {
  width: 46px;
  height: 46px;
  border-radius: 1rem;
  background: var(--c-teal-light);
  color: var(--c-teal-dark);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vcard__online {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid white;
  animation: pulse-online 2.5s ease-in-out infinite;
}

.vcard__info { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }

.vcard__name-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }

.vcard__name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--c-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vcard__distance { font-size: 0.72rem; font-weight: 600; color: var(--c-text-light); flex-shrink: 0; }

.vcard__rating-row { display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap; }

.vcard__rating { font-size: 0.8rem; font-weight: 600; color: var(--c-navy); }

.vcard__reviews { font-size: 0.8rem; color: var(--c-text-light); }

.vcard__tag {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  margin-left: auto;
}

.vcard__tag--green { background: #dcfce7; color: #166534; }
.vcard__tag--orange { background: #fed7aa; color: #9a3412; }
.vcard__tag--yellow { background: #fef9c3; color: #713f12; }

.vcard__tags { display: flex; gap: 0.375rem; flex-wrap: wrap; }

.vcard__chip {
  font-size: 0.68rem;
  background: rgba(72, 175, 196, 0.08);
  color: var(--c-teal-dark);
  border: 1px solid rgba(72, 175, 196, 0.15);
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-weight: 500;
}

.vcard__actions { display: flex; gap: 0.5rem; }

.vcard__contact-btn {
  flex: 1;
  background: linear-gradient(135deg, var(--c-teal), var(--c-teal-dark));
  color: white;
  border: none;
  border-radius: 0.875rem;
  padding: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 38px;
  box-shadow: var(--shadow-teal);
  transition: background 0.2s, transform 0.2s;
}

.vcard__contact-btn:hover { transform: translateY(-1px); }

.vcard__phone-btn {
  width: 38px;
  height: 38px;
  border: 1.5px solid var(--c-border);
  border-radius: 0.875rem;
  background: var(--c-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--c-navy);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}

.vcard__phone-btn:hover {
  background: var(--c-teal-light);
  border-color: var(--c-teal);
  transform: scale(1.08);
}

.map-emergency {
  width: min(100%, 1320px);
  margin: 0 auto;
  padding: 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid var(--c-border);
  margin-top: 0.5rem;
}

.map-emergency__btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: 1rem;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 52px;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.32);
  transition: transform 0.25s, box-shadow 0.2s;
}

.map-emergency__btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(239, 68, 68, 0.38); }

@media (max-width: 1024px) and (min-width: 769px) {
  .map-vcards { grid-template-columns: 1fr 1fr; }
  .map-volunteers { padding: 1.25rem; }
  .map-topbar { padding: 1rem 1.25rem; }
  .map-emergency { padding: 0 1.25rem 1.25rem; }
}

@media (max-width: 768px) and (min-width: 641px) {
  .map-vcards { grid-template-columns: 1fr 1fr; }
  .map-volunteers { padding: 1.125rem; }
  .map-topbar { padding: 0.875rem 1.125rem; }
  .map-emergency { padding: 0 1.125rem 1.125rem; }
}

@media (max-width: 640px) {
  .map-vcards { grid-template-columns: 1fr; }
  .map-volunteers { padding: 1rem; }
  .map-topbar { padding: 0.75rem 1rem; }
  .map-emergency { padding: 0 1rem 1rem; }
}
</style>
