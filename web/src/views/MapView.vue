<script setup>
import KIcon from "@/components/KIcon.vue";

const volunteers = [];
</script>

<template>
  <div class="map-view app-page">
    <!-- Carte OSM iframe zoomée sur Île de France -->
    <div class="map-container">
      <iframe
        title="Carte OpenStreetMap - Île de France"
        src="https://www.openstreetmap.org/export/embed.html?bbox=1.5,48.1,3.0,49.0&layer=mapnik&marker=48.8566,2.3522"
        class="map-iframe"
        loading="lazy"
      />
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

.map-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
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


.map-zoom {
  display: none !important;
}

.map-geolocate {
  display: none !important;
}

.map-area__footer {
  display: none !important;
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
