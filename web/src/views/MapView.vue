<script setup>
import { Filter, MapPin, Phone, RefreshCw, Star, Zap } from "lucide-vue-next";

const volunteers = [
  {
    initials: "ML",
    name: "Marie L.",
    distance: "0.3 km",
    availability: "Disponible maintenant",
    availabilityClass: "vcard__tag--green",
    tags: ["Courses", "Médecin"],
    rating: 4.9,
    reviews: 127,
  },
  {
    initials: "TR",
    name: "Thomas R.",
    distance: "0.7 km",
    availability: "Dans 15 min",
    availabilityClass: "vcard__tag--orange",
    tags: ["Transport", "Urgences"],
    rating: 4.8,
    reviews: 89,
  },
  {
    initials: "SM",
    name: "Sophie M.",
    distance: "1.2 km",
    availability: "Cet après-midi",
    availabilityClass: "vcard__tag--yellow",
    tags: ["Courses", "Promenade"],
    rating: 4.7,
    reviews: 45,
  },
];
</script>

<template>
  <div class="map-view">
    <!-- Topbar search -->
    <div class="map-topbar">
      <div class="map-search">
        <span class="map-search__icon">🔍</span>
        <input
          type="text"
          placeholder="Rechercher un volontaire..."
          class="map-search__input"
          aria-label="Rechercher un volontaire proche de vous"
        >
      </div>
      <div class="map-topbar__actions">
        <button
          class="map-icon-btn"
          aria-label="Filtrer les résultats de recherche"
          title="Ouvrir les options de filtrage"
        >
          <Filter
            :size="17"
            :stroke-width="1.75"
            aria-hidden="true"
          />
        </button>
        <button
          class="map-icon-btn"
          aria-label="Actualiser la liste des volontaires disponibles"
          title="Recharger les données de disponibilité"
        >
          <RefreshCw
            :size="17"
            :stroke-width="1.75"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <!-- MapArea -->
    <div class="map-area">
      <div
        class="map-area__grid"
        aria-hidden="true"
      />
      <div
        class="map-area__glow"
        aria-hidden="true"
      />
      <div class="map-area__pin">
        <MapPin
          :size="24"
          color="var(--kompagnon-turquoise)"
          :stroke-width="2.2"
          aria-hidden="true"
        />
        <div class="map-area__pin-tooltip">
          <strong>Votre position</strong>
          <span>12 rue de la République</span>
        </div>
      </div>
      <div class="map-zoom">
        <button
          class="map-zoom__btn"
          aria-label="Zoomer sur la carte"
          title="Augmenter le niveau de zoom"
        >
          +
        </button>
        <button
          class="map-zoom__btn"
          aria-label="Dézoomer sur la carte"
          title="Diminuer le niveau de zoom"
        >
          −
        </button>
      </div>
      <div class="map-geolocate">
        <button
          class="map-zoom__btn map-zoom__btn--primary"
          aria-label="Centrer la carte sur votre position actuelle"
          title="Retourner à votre localisation"
        >
          ⊙
        </button>
      </div>
      <span class="map-area__footer">Zoom · Paris 15e</span>
    </div>

    <!-- Volunteers section -->
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
          aria-label="Voir tous les volontaires disponibles"
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
              <span class="vcard__online" />
            </div>
            <div class="vcard__info">
              <div class="vcard__name-row">
                <strong class="vcard__name">{{ v.name }}</strong>
                <span class="vcard__distance">{{ v.distance }}</span>
              </div>
              <div class="vcard__rating-row">
                <Star
                  :size="12"
                  :stroke-width="2"
                  class="vcard__star"
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
              :title="`Ouvrir la conversation avec ${v.name}`"
            >
              Contacter
            </button>
            <button
              class="vcard__phone-btn"
              :aria-label="`Appeler ${v.name}`"
              :title="`Appeler directement ${v.name}`"
            >
              <Phone
                :size="15"
                :stroke-width="1.75"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Emergency -->
    <div class="map-emergency">
      <button
        class="map-emergency__btn"
        aria-label="Envoyer une demande d'urgence immédiate"
        title="Déclenche une demande d'accompagnement prioritaire"
      >
        <Zap
          :size="18"
          :stroke-width="2.2"
          aria-hidden="true"
        />
        Demande d'urgence
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes spring-in {
  0% { opacity: 0; transform: translateY(20px) scale(0.97); }
  60% { opacity: 1; transform: translateY(-4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes pulse-online {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
}

.map-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
  overflow-y: auto;
}

/* ── Topbar ── */
.map-topbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
}

.map-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1.5px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  background: rgba(248, 250, 252, 0.95);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.map-search:focus-within {
  border-color: #48AFC4;
  box-shadow: 0 0 0 3px rgba(72, 175, 196, 0.12);
  background: white;
}

.map-search__icon {
  font-size: 0.875rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.map-search__input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: var(--kompagnon-navy);
  outline: none;
}

.map-search__input::placeholder {
  color: #9ca3af;
}

.map-topbar__actions {
  display: flex;
  gap: 0.375rem;
}

.map-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1.5px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--kompagnon-navy);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
  backdrop-filter: blur(8px);
}

.map-icon-btn:hover {
  background: rgba(72, 175, 196, 0.1);
  border-color: rgba(72, 175, 196, 0.35);
  transform: scale(1.08);
}

/* ── Map area ── */
.map-area {
  position: relative;
  height: 260px;
  background: linear-gradient(145deg, rgba(158, 212, 217, 0.45) 0%, rgba(72, 175, 196, 0.28) 100%);
  flex-shrink: 0;
  overflow: hidden;
}

.map-area__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 56px 56px;
}

.map-area__glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(72, 175, 196, 0.3) 0%, transparent 70%);
  pointer-events: none;
}

.map-area__pin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.map-area__pin-tooltip {
  background: white;
  border-radius: 1rem;
  padding: 0.5rem 0.875rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.14);
  text-align: center;
  width: 170px;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.map-area__pin-tooltip strong {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
}

.map-area__pin-tooltip span {
  font-size: 0.72rem;
  color: #6b7280;
}

.map-zoom {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.map-geolocate {
  position: absolute;
  bottom: 2.5rem;
  right: 1rem;
}

.map-zoom__btn {
  width: 36px;
  height: 36px;
  border-radius: 0.75rem;
  border: 1.5px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.92);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--kompagnon-navy);
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(8px);
  transition: background 0.2s, transform 0.2s;
}

.map-zoom__btn:hover {
  background: white;
  transform: scale(1.1);
}

.map-zoom__btn--primary {
  background: var(--kompagnon-turquoise);
  color: white;
  border-color: var(--kompagnon-turquoise);
}

.map-zoom__btn--primary:hover {
  background: var(--kompagnon-turquoise-dark);
}

.map-area__footer {
  position: absolute;
  bottom: 0.625rem;
  left: 1rem;
  font-size: 0.72rem;
  color: rgba(30, 44, 56, 0.65);
  background: rgba(255, 255, 255, 0.75);
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
  backdrop-filter: blur(6px);
}

/* ── Volunteers ── */
.map-volunteers {
  padding: 1.25rem 1.5rem;
  flex: 1;
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
  color: #7b8794;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.map-volunteers__title {
  margin: 0;
  font-size: clamp(1.2rem, 1.6vw, 1.5rem);
  font-weight: 700;
  color: var(--kompagnon-navy);
  letter-spacing: -0.025em;
}

.map-section__more {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--kompagnon-turquoise);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s;
}

.map-section__more:hover {
  color: #3a9bb0;
}

.map-vcards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.875rem;
}

.vcard {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 1.5rem;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(10px);
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, border-color 0.2s;
}

.vcard:nth-child(1) { animation-delay: 0.06s; }
.vcard:nth-child(2) { animation-delay: 0.1s; }
.vcard:nth-child(3) { animation-delay: 0.14s; }

.vcard:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 18px 36px rgba(72, 175, 196, 0.14);
  border-color: rgba(72, 175, 196, 0.28);
}

.vcard__header {
  display: flex;
  gap: 0.75rem;
}

.vcard__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.vcard__avatar {
  width: 46px;
  height: 46px;
  border-radius: 1rem;
  background: rgba(72, 175, 196, 0.15);
  color: var(--kompagnon-navy);
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

.vcard__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.vcard__name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.vcard__name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vcard__distance {
  font-size: 0.72rem;
  font-weight: 600;
  color: #9ca3af;
  flex-shrink: 0;
}

.vcard__rating-row {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.vcard__star {
  color: #fbbf24;
  fill: #fbbf24;
}

.vcard__rating {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--kompagnon-navy);
}

.vcard__reviews {
  font-size: 0.8rem;
  color: #6b7280;
}

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

.vcard__tags {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.vcard__chip {
  font-size: 0.68rem;
  background: rgba(72, 175, 196, 0.08);
  color: #2a5f70;
  border: 1px solid rgba(72, 175, 196, 0.15);
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-weight: 500;
}

.vcard__actions {
  display: flex;
  gap: 0.5rem;
}

.vcard__contact-btn {
  flex: 1;
  background: linear-gradient(135deg, #48AFC4, #3a9bb0);
  color: white;
  border: none;
  border-radius: 0.875rem;
  padding: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 38px;
  box-shadow: 0 4px 12px rgba(72, 175, 196, 0.24);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.vcard__contact-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(72, 175, 196, 0.32);
}

.vcard__phone-btn {
  width: 38px;
  height: 38px;
  border: 1.5px solid rgba(15, 23, 42, 0.08);
  border-radius: 0.875rem;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--kompagnon-navy);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}

.vcard__phone-btn:hover {
  background: rgba(72, 175, 196, 0.1);
  border-color: rgba(72, 175, 196, 0.3);
  transform: scale(1.08);
}

/* ── Emergency ── */
.map-emergency {
  padding: 0 1.5rem 1.5rem;
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
  border-radius: 1.5rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 52px;
  letter-spacing: 0.01em;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.32);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}

.map-emergency__btn:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 14px 30px rgba(239, 68, 68, 0.38);
}

.map-emergency__btn:active {
  transform: translateY(0) scale(0.99);
}

@media (max-width: 1024px) { .map-vcards { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) {
  .map-vcards { grid-template-columns: 1fr; }
  .map-volunteers { padding: 1rem; }
  .map-topbar { padding: 0.75rem 1rem; }
  .map-emergency { padding: 0 1rem 1rem; }
}
</style>

