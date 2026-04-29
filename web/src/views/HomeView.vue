<script setup>
import { Clock, MapPin, Send, Shield, Star, Users } from "lucide-vue-next";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push({ name: "login" });
}

const actions = [
  { icon: Send, label: "Transport", description: "Trajets du quotidien et rendez-vous", meta: "3 volontaires proches" },
  { icon: Star, label: "Courses", description: "Aide ponctuelle près de chez vous", meta: "Disponible aujourd'hui" },
  { icon: Shield, label: "Médical", description: "Déplacements sensibles et sécurisés", meta: "Priorité sécurisée" },
  { icon: Users, label: "Social", description: "Sorties accompagnées et entraide locale", meta: "Réseau local actif" },
];

const kpis = [
  { icon: Clock, label: "Temps moyen", value: "8 min", detail: "Validation d'une demande", accent: "var(--kompagnon-turquoise)" },
  { icon: Users, label: "Volontaires proches", value: "12", detail: "Disponibles maintenant", accent: "#1e2c38" },
  { icon: Shield, label: "Trajets sécurisés", value: "98%", detail: "Accompagnements confirmés", accent: "var(--kompagnon-turquoise)" },
  { icon: Star, label: "Satisfaction", value: "4.9/5", detail: "Moyenne des retours", accent: "#f59e0b" },
];

const communityStats = [
  { icon: Users, value: "2 847", label: "Volontaires", note: "Disponibles dans le réseau", color: "var(--kompagnon-turquoise)" },
  { icon: Star, value: "4.9", label: "Note", note: "Satisfaction moyenne", color: "#f59e0b" },
  { icon: Shield, value: "100%", label: "Sécurisé", note: "Profils et échanges vérifiés", color: "var(--kompagnon-turquoise)" },
];

const heroHighlights = [
  { icon: Clock, title: "Prochain créneau", value: "Aujourd'hui · 14:30" },
  { icon: MapPin, title: "Zone couverte", value: "Paris 15e et alentours" },
  { icon: Shield, title: "Accompagnement", value: "Validé en moins de 8 min" },
];

const recentActivity = [
  {
    title: "Accompagnement confirmé",
    description: "Sophie R. vous accompagne à la Pharmacie Centrale.",
    time: "Il y a 12 min",
  },
  {
    title: "Nouveau volontaire disponible",
    description: "3 profils vérifiés sont disponibles dans votre quartier.",
    time: "Il y a 34 min",
  },
  {
    title: "Itinéraire préparé",
    description: "Le trajet domicile → cabinet médical a été optimisé.",
    time: "Aujourd'hui · 09:10",
  },
];

const todayLabel = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());
</script>

<template>
  <div class="home-view">
    <header class="home-header">
      <div class="home-header__left">
        <div>
          <div class="home-header__title-row">
            <h1 class="home-header__title">
              Bonjour, Marie 👋
            </h1>
            <div
              class="home-header__status"
              role="status"
              aria-live="polite"
              aria-label="Votre statut: en ligne"
            >
              <span
                class="home-header__dot"
                aria-hidden="true"
              />
              En ligne
            </div>
          </div>
          <p class="home-header__subtitle">
            Comment vous sentez-vous aujourd'hui ?
          </p>
        </div>
      </div>

      <div class="home-header__right">
        <span class="home-header__date">
          {{ todayLabel }}
        </span>
        <button
          class="home-header__logout-btn"
          aria-label="Se déconnecter de l'application"
          title="Quitter votre session"
          @click="handleLogout"
        >
          Se déconnecter
        </button>
      </div>
    </header>

    <div class="home-content">
      <div class="home-dashboard">
        <section class="home-hero home-card">
          <div class="home-hero__layout">
            <div class="home-hero__content">
              <span class="home-hero__eyebrow">Accompagnement solidaire</span>
              <h2 class="home-hero__title">
                Votre tableau de bord mobilité
              </h2>
              <p class="home-hero__desc">
                Visualisez vos disponibilités, vos accompagnements à venir et les actions prioritaires du jour depuis un espace unique, clair et rassurant.
              </p>

              <div class="home-hero__row">
                <div class="home-hero__avatars">
                  <span class="home-hero__av">M</span>
                  <span class="home-hero__av">T</span>
                  <span class="home-hero__av home-hero__av--more">+10</span>
                </div>
                <span>12 volontaires disponibles dans votre secteur</span>
              </div>

              <div class="home-hero__timing">
                <Clock
                  :size="13"
                  :stroke-width="2"
                />
                <span>Temps moyen&nbsp;: 8 min</span>
                <Star
                  :size="13"
                  :stroke-width="2"
                  class="home-hero__star"
                />
                <span>4.9/5</span>
              </div>

              <div class="home-hero__actions">
                <button
                  class="home-hero__cta"
                  aria-label="Demander un accompagnement immédiatement"
                  title="Commencez une demande d'accompagnement dès maintenant"
                >
                  Demander maintenant →
                </button>

                <span class="home-hero__trust">Service vérifié, humain et sécurisé</span>
              </div>
            </div>

            <aside class="home-hero__summary">
              <p class="home-hero__summary-title">
                Aperçu rapide
              </p>
              <div class="home-hero__summary-grid">
                <div
                  v-for="item in heroHighlights"
                  :key="item.title"
                  class="home-hero__summary-card"
                >
                  <component
                    :is="item.icon"
                    :size="16"
                    :stroke-width="1.85"
                    class="home-hero__summary-icon"
                  />
                  <div>
                    <p class="home-hero__summary-label">
                      {{ item.title }}
                    </p>
                    <p class="home-hero__summary-value">
                      {{ item.value }}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <aside class="home-journey-card home-card home-card--dark">
          <div class="home-card__topline">
            <span class="home-card__eyebrow">Prochain accompagnement</span>
            <span class="home-journey-card__time">14:30</span>
          </div>
          <h3 class="home-journey-card__title">
            Pharmacie Centrale
          </h3>
          <p class="home-journey-card__route">
            12 rue de la République → Pharmacie Centrale
          </p>

          <div class="home-journey-card__meta">
            <div class="home-journey-card__meta-item">
              <span class="home-journey-card__meta-label">Contact</span>
              <strong>Sophie R.</strong>
            </div>
            <div class="home-journey-card__meta-item">
              <span class="home-journey-card__meta-label">Statut</span>
              <strong>Confirmé</strong>
            </div>
          </div>

          <div class="home-journey-card__footer">
            <span class="home-journey-card__badge">Départ dans 25 min</span>
            <span class="home-journey-card__hint">Volontaire vérifiée</span>
          </div>
        </aside>

        <section class="home-kpi-grid">
          <article
            v-for="kpi in kpis"
            :key="kpi.label"
            class="home-kpi-card home-card"
          >
            <div
              class="home-kpi-card__icon"
              :style="{ color: kpi.accent }"
            >
              <component
                :is="kpi.icon"
                :size="18"
                :stroke-width="1.9"
                aria-hidden="true"
              />
            </div>
            <div class="home-kpi-card__body">
              <span class="home-kpi-card__label">{{ kpi.label }}</span>
              <strong class="home-kpi-card__value">{{ kpi.value }}</strong>
              <span class="home-kpi-card__detail">{{ kpi.detail }}</span>
            </div>
          </article>
        </section>

        <section class="home-panel home-card home-panel--actions">
          <div class="home-panel__head">
            <div>
              <p class="home-panel__eyebrow">
                Actions prioritaires
              </p>
              <h3 class="home-panel__title">
                Lancer rapidement une demande
              </h3>
            </div>
            <a
              href="#"
              class="home-section__more"
              aria-label="Voir toutes les actions rapides disponibles"
              title="Affiche la liste complète des actions que vous pouvez effectuer"
            >Voir tout</a>
          </div>
          <div class="home-actions-grid">
            <button
              v-for="action in actions"
              :key="action.label"
              class="home-action-card"
              :aria-label="`Commencer une demande de ${action.label.toLowerCase()}`"
              :title="`Cliquez pour demander un accompagnement pour: ${action.label}`"
            >
              <span class="home-action-card__icon">
                <component
                  :is="action.icon"
                  :size="22"
                  :stroke-width="1.75"
                  color="var(--kompagnon-turquoise)"
                  aria-hidden="true"
                />
              </span>
              <span class="home-action-card__label">{{ action.label }}</span>
              <span class="home-action-card__desc">{{ action.description }}</span>
              <span class="home-action-card__meta">{{ action.meta }}</span>
            </button>
          </div>
        </section>

        <section class="home-panel home-card home-card--dark home-panel--activity">
          <div class="home-panel__head home-panel__head--light">
            <div>
              <p class="home-panel__eyebrow home-panel__eyebrow--light">
                Activité récente
              </p>
              <h3 class="home-panel__title home-panel__title--light">
                Ce qui se passe aujourd'hui
              </h3>
            </div>
          </div>

          <div class="home-activity-list">
            <article
              v-for="item in recentActivity"
              :key="item.title"
              class="home-activity-item"
            >
              <span class="home-activity-item__dot" />
              <div class="home-activity-item__body">
                <p class="home-activity-item__title">
                  {{ item.title }}
                </p>
                <p class="home-activity-item__desc">
                  {{ item.description }}
                </p>
              </div>
              <span class="home-activity-item__time">{{ item.time }}</span>
            </article>
          </div>
        </section>

        <section class="home-panel home-card home-panel--community">
          <div class="home-panel__head">
            <div>
              <p class="home-panel__eyebrow">
                Réseau Kompagnon
              </p>
              <h3 class="home-panel__title">
                Communauté active
              </h3>
            </div>
            <a
              href="#"
              class="home-section__more"
              aria-label="Voir l'activité complète de la communauté"
              title="Affiche les statistiques détaillées de la communauté Kompagnon"
            >Activité</a>
          </div>
          <div class="home-stats-grid">
            <div
              v-for="stat in communityStats"
              :key="stat.label"
              class="home-stat-card"
              :aria-label="`${stat.label}: ${stat.value}`"
              :title="`Statistique communauté - ${stat.label}: ${stat.value}`"
            >
              <component
                :is="stat.icon"
                :size="22"
                :stroke-width="1.75"
                :color="stat.color"
                aria-hidden="true"
              />
              <span
                class="home-stat-card__val"
                :style="{ color: stat.color }"
              >{{ stat.value }}</span>
              <span class="home-stat-card__lbl">{{ stat.label }}</span>
              <span class="home-stat-card__note">{{ stat.note }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spring-in {
  0% { opacity: 0; transform: translateY(20px) scale(0.97); }
  60% { opacity: 1; transform: translateY(-4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.45); }
  50% { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
}

.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: transparent;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 0.75rem;
  background: transparent;
  gap: 1rem;
  flex-shrink: 0;
}

.home-header__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.home-header__title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.home-header__title {
  font-size: clamp(1.6rem, 2.2vw, 2.2rem);
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.home-header__subtitle {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin: 0.35rem 0 0;
  line-height: 1.4;
}

.home-header__right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.home-header__date {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(15, 23, 42, 0.06);
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.home-header__logout-btn {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 1rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.88);
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.home-header__logout-btn:hover {
  background: #111827;
  color: white;
  border-color: #111827;
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.14);
}

.home-header__status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #16a34a;
  padding: 0.38rem 0.8rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
}

.home-header__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}

.home-content {
  padding: 0 1.5rem 1.5rem;
}

.home-dashboard {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
}

.home-card {
  border-radius: 1.75rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 14px 40px rgba(15, 23, 42, 0.06),
    0 2px 6px rgba(15, 23, 42, 0.03);
  backdrop-filter: blur(10px);
}

.home-card--dark {
  background: linear-gradient(160deg, var(--brand-navy-deep) 0%, var(--brand-navy) 55%, #1e3245 100%);
  border-color: rgba(255, 255, 255, 0.06);
  color: white;
  box-shadow: var(--shadow-navy);
}

.home-hero {
  grid-column: span 8;
  position: relative;
  padding: 1.6rem;
  overflow: hidden;
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.home-hero::before {
  content: '';
  position: absolute;
  top: -10%;
  right: -5%;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(72, 175, 196, 0.18) 0%, rgba(72, 175, 196, 0.04) 45%, transparent 70%);
  border-radius: 50%;
  animation: float 10s ease-in-out infinite;
  pointer-events: none;
}

.home-hero::after {
  content: '';
  position: absolute;
  bottom: -18%;
  left: -4%;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(158, 212, 217, 0.22) 0%, transparent 72%);
  border-radius: 50%;
  pointer-events: none;
}

.home-hero__layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.9fr);
  gap: 1rem;
  align-items: stretch;
}

.home-hero__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.25rem;
}

.home-hero__eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.12);
  border: 1px solid rgba(72, 175, 196, 0.2);
  font-size: 0.75rem;
  font-weight: 600;
  color: #2a5f70;
  letter-spacing: 0.02em;
}

.home-hero__title {
  font-size: clamp(1.9rem, 3.2vw, 3.2rem);
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  line-height: 0.98;
  max-width: 12ch;
  letter-spacing: -0.05em;
}

.home-hero__desc {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin: 0;
  max-width: 36rem;
  line-height: 1.6;
}

.home-hero__row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text);
}

.home-hero__avatars {
  display: flex;
}

.home-hero__av {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(72, 175, 196, 0.18);
  color: #1e2c38;
  font-size: 0.6875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  margin-left: -6px;
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.home-hero__av:first-child {
  margin-left: 0;
}

.home-hero__av:hover {
  transform: scale(1.25) translateY(-4px);
  z-index: 10;
}

.home-hero__av--more {
  background: #1e2c38;
  color: white;
  font-size: 0.6rem;
}

.home-hero__timing {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.home-hero__star {
  color: #fbbf24;
  fill: #fbbf24;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.875rem;
}

.home-hero__cta {
  align-self: flex-start;
  background: linear-gradient(135deg, #1e2c38 0%, #2a5f70 100%);
  border: none;
  color: white;
  border-radius: 999px;
  padding: 0.9rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 46px;
  transition: background 0.2s, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 14px 28px rgba(30, 44, 56, 0.18);
}

.home-hero__cta:hover {
  background: linear-gradient(135deg, #16202b 0%, #245466 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 18px 32px rgba(30, 44, 56, 0.2);
}

.home-hero__cta:active {
  transform: translateY(0) scale(0.98);
}

.home-hero__trust {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.home-hero__summary {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  background: var(--brand-navy-deep);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.home-hero__summary-title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.02em;
}

.home-hero__summary-grid {
  display: grid;
  gap: 0.75rem;
}

.home-hero__summary-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
}

.home-hero__summary-icon {
  flex-shrink: 0;
  color: #c9f5ff;
  margin-top: 0.125rem;
}

.home-hero__summary-label {
  margin: 0 0 0.2rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.68);
}

.home-hero__summary-value {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  line-height: 1.35;
}

.home-journey-card {
  grid-column: span 4;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  animation: spring-in 0.58s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: 0.08s;
}

.home-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.home-card__eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #7b8794;
  text-transform: uppercase;
}

.home-journey-card__time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 0.8125rem;
  font-weight: 700;
}

.home-journey-card__title {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.home-journey-card__route {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.55;
  font-size: 0.92rem;
}

.home-journey-card__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.home-journey-card__meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.85rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
}

.home-journey-card__meta-item strong {
  font-size: 0.95rem;
  color: white;
}

.home-journey-card__meta-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.62);
}

.home-journey-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.home-journey-card__badge {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.18);
  color: #bff5ff;
  font-size: 0.8125rem;
  font-weight: 700;
}

.home-journey-card__hint {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.62);
}

.home-kpi-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.home-kpi-card {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 1.15rem;
  animation: spring-in 0.58s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.home-kpi-card:nth-child(1) { animation-delay: 0.08s; }
.home-kpi-card:nth-child(2) { animation-delay: 0.12s; }
.home-kpi-card:nth-child(3) { animation-delay: 0.16s; }
.home-kpi-card:nth-child(4) { animation-delay: 0.20s; }

.home-kpi-card__icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.95rem;
  background: rgba(72, 175, 196, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.home-kpi-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.home-kpi-card__label {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.home-kpi-card__value {
  font-size: 1.5rem;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--kompagnon-navy);
}

.home-kpi-card__detail {
  font-size: 0.78rem;
  color: var(--color-text-subtle);
}

.home-panel {
  padding: 1.25rem;
  animation: spring-in 0.58s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.home-panel--actions {
  grid-column: span 7;
  animation-delay: 0.12s;
}

.home-panel--activity {
  grid-column: span 5;
  animation-delay: 0.18s;
}

.home-panel--community {
  grid-column: 1 / -1;
  animation-delay: 0.22s;
}

.home-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.home-panel__head--light {
  margin-bottom: 0.75rem;
}

.home-panel__eyebrow {
  margin: 0 0 0.3rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.home-panel__eyebrow--light {
  color: rgba(255, 255, 255, 0.56);
}

.home-panel__title {
  margin: 0;
  color: var(--kompagnon-navy);
  font-size: 1.3rem;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.home-panel__title--light {
  color: white;
}

.home-section__more {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--kompagnon-turquoise);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap 0.2s, color 0.2s;
}

.home-section__more:hover {
  color: #3a9bb0;
  gap: 0.5rem;
}

.home-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.875rem;
}

.home-action-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.95) 100%);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 1.25rem;
  padding: 1.1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
  text-align: left;
}

.home-action-card:nth-child(1) { animation-delay: 0.12s; }
.home-action-card:nth-child(2) { animation-delay: 0.18s; }
.home-action-card:nth-child(3) { animation-delay: 0.24s; }
.home-action-card:nth-child(4) { animation-delay: 0.30s; }

.home-action-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 18px 32px rgba(72, 175, 196, 0.16);
  border-color: rgba(72, 175, 196, 0.35);
}

.home-action-card:active {
  transform: translateY(-1px) scale(0.99);
}

.home-action-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 1rem;
  background: rgba(72, 175, 196, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.home-action-card:hover .home-action-card__icon {
  background: #48AFC4;
  transform: rotate(8deg) scale(1.1);
}

.home-action-card:hover .home-action-card__icon svg {
  color: white !important;
}

.home-action-card__label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
  line-height: 1.2;
}

.home-action-card__desc {
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--color-text-subtle);
  max-width: 18rem;
}

.home-action-card__meta {
  margin-top: auto;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2a5f70;
}

.home-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.875rem;
}

.home-stat-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.95) 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 1.125rem;
  padding: 1.375rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: default;
}

.home-stat-card:nth-child(1) { animation-delay: 0.22s; }
.home-stat-card:nth-child(2) { animation-delay: 0.28s; }
.home-stat-card:nth-child(3) { animation-delay: 0.34s; }

.home-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(72, 175, 196, 0.12);
  border-color: rgba(72, 175, 196, 0.25);
}

.home-stat-card__val {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.home-stat-card:hover .home-stat-card__val {
  transform: scale(1.08);
}

.home-stat-card__lbl {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-align: center;
}

.home-stat-card__note {
  font-size: 0.75rem;
  line-height: 1.45;
  color: var(--color-text-subtle);
  text-align: center;
}

.home-activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.home-activity-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.home-activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.home-activity-item__dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  margin-top: 0.35rem;
  background: #48afc4;
  box-shadow: 0 0 0 4px rgba(72, 175, 196, 0.16);
}

.home-activity-item__body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.home-activity-item__title {
  margin: 0;
  color: white;
  font-size: 0.93rem;
  font-weight: 600;
}

.home-activity-item__desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.8rem;
  line-height: 1.45;
}

.home-activity-item__time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .home-hero,
  .home-journey-card,
  .home-panel--actions,
  .home-panel--activity,
  .home-panel--community {
    grid-column: 1 / -1;
  }

  .home-hero__layout {
    grid-template-columns: 1fr;
  }

  .home-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .home-header {
    padding: 1rem 1rem 0.5rem;
    align-items: flex-start;
    flex-direction: column;
  }

  .home-content {
    padding: 0 1rem 1rem;
  }

  .home-header__title-row {
    gap: 0.5rem;
  }

  .home-header__title {
    font-size: 1.9rem;
  }

  .home-header__right {
    width: 100%;
    justify-content: space-between;
  }

  .home-header__date {
    min-height: 36px;
    padding-inline: 0.85rem;
  }

  .home-header__logout-btn {
    height: 36px;
    padding-inline: 0.9rem;
  }

  .home-hero {
    padding: 1.25rem;
  }

  .home-hero__title {
    max-width: 100%;
  }

  .home-hero__actions {
    align-items: flex-start;
  }

  .home-hero__summary {
    padding: 0.875rem;
  }

  .home-kpi-grid {
    grid-template-columns: 1fr;
  }

  .home-actions-grid {
    grid-template-columns: 1fr;
    gap: 0.625rem;
  }

  .home-stats-grid {
    grid-template-columns: 1fr;
    gap: 0.625rem;
  }

  .home-stat-card {
    padding: 1rem 0.75rem;
  }

  .home-stat-card__val {
    font-size: 1.25rem;
  }

  .home-activity-item {
    grid-template-columns: auto 1fr;
  }

  .home-activity-item__time {
    grid-column: 2;
  }
}
</style>
