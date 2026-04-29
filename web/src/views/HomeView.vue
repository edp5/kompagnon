<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { getUserProfile } from "@/adapters/users.js";
import KIcon from "@/components/KIcon.vue";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();
const profile = ref(null);

const stats = [];

const communityStats = [];

const actions = [
  { icon: "map", label: "Déplacement", desc: "À pied, en transports", accent: "var(--c-teal-light)", color: "var(--c-teal)" },
  { icon: "support", label: "Rendez-vous", desc: "Médical ou administratif", accent: "var(--c-warning-bg)", color: "var(--c-warning)" },
  { icon: "connect", label: "Courses", desc: "Accompagnement shopping", accent: "var(--c-success-bg)", color: "var(--c-success)" },
  { icon: "tracking", label: "Voir la carte", desc: "Volontaires à proximité", accent: "#ede3f8", color: "#7c4dcc" },
];

const recentActivity = [];

const displayGreeting = computed(() => {
  const firstname = profile.value?.firstname;
  if (!firstname) {
    return "Bienvenue sur Kompagnon";
  }
  return `Bienvenue, ${firstname}`;
});

onMounted(async () => {
  const token = authStore.token;
  if (!token) return;

  const result = await getUserProfile({ token });
  if (result.success) {
    profile.value = result.profile;
  }
});
</script>

<template>
  <div class="home-view app-page">
    <!-- ── Contenu principal ── -->
    <div class="home-content">
      <!-- Hero banner -->
      <section class="home-hero glass-panel">
        <svg
          class="home-hero__blob"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <path
            d="M47.8,-61.6C59.8,-52.4,66.2,-36.2,69.8,-19.4C73.4,-2.6,74.2,14.8,67.4,29.2C60.6,43.6,46.2,55,30.4,62.2C14.6,69.4,-2.6,72.4,-19.4,68.2C-36.2,64,-52.6,52.6,-62.6,37.4C-72.6,22.2,-76.2,3.2,-72,-14C-67.8,-31.2,-55.8,-46.6,-41.4,-55.4C-27,-64.2,-10.2,-66.4,4.8,-72.6C19.8,-78.8,35.8,-70.8,47.8,-61.6Z"
            transform="translate(100,100)"
            fill="white"
            opacity="0.07"
          />
        </svg>

        <div class="home-hero__content">
          <p class="home-hero__date">
            {{ new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) }}
          </p>
          <h2 class="home-hero__title">
            {{ displayGreeting }}
          </h2>
          <p class="home-hero__sub">
            Découvrez les accompagnements disponibles près de vous
          </p>
          <span
            class="home-hero__cta"
            role="link"
            tabindex="0"
            aria-label="Créer une nouvelle demande d'accompagnement"
            @click="router.push({ name: 'map' })"
            @keydown.enter="router.push({ name: 'map' })"
          >
            + Nouvelle demande
          </span>
        </div>
      </section>

      <!-- Stat cards -->
      <section
        class="home-stats"
        aria-label="Vos statistiques"
      >
        <article
          v-for="stat in stats"
          :key="stat.label"
          class="home-stat-card"
        >
          <div
            class="home-stat-card__icon"
            :style="{ background: stat.bg, color: stat.color }"
          >
            <KIcon
              :name="stat.icon"
              :size="20"
            />
          </div>
          <span class="home-stat-card__value">{{ stat.value }}</span>
          <span class="home-stat-card__label">{{ stat.label }}</span>
          <span
            v-if="stat.trend"
            class="home-stat-card__trend"
          >↑ {{ stat.trend }}</span>
        </article>
      </section>

      <!-- Community stats -->
      <section
        class="home-community"
        aria-label="Statistiques de la communauté"
      >
        <p class="home-community__label">
          Notre communauté
        </p>
        <div class="home-community__grid">
          <div
            v-for="s in communityStats"
            :key="s.label"
            class="home-community__item"
          >
            <span class="home-community__value">{{ s.value }}</span>
            <span class="home-community__sub">{{ s.label }}</span>
          </div>
        </div>
      </section>

      <!-- Next appointment -->
      <!-- Section removed - no data available -->


      <!-- Quick actions -->
      <section class="home-section home-section--actions">
        <h3 class="home-section__title">
          Actions rapides
        </h3>
        <div class="home-actions-grid">
          <div
            v-for="action in actions"
            :key="action.label"
            class="home-action-card"
            role="button"
            tabindex="0"
            :aria-label="`Démarrer une demande : ${action.label}`"
          >
            <div
              class="home-action-card__icon"
              :style="{ background: action.accent, color: action.color }"
            >
              <KIcon
                :name="action.icon"
                :size="22"
              />
            </div>
            <span class="home-action-card__label">{{ action.label }}</span>
            <span class="home-action-card__desc">{{ action.desc }}</span>
          </div>
        </div>
      </section>

      <!-- Recent activity -->
      <section class="home-section home-section--activity">
        <div class="home-section__head">
          <h3 class="home-section__title">
            Activité récente
          </h3>
        </div>
        <div class="home-activity">
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
                {{ item.desc }}
              </p>
            </div>
            <span class="home-activity-item__time">{{ item.time }}</span>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>

/* ── Layout ── */
.home-view {
  min-height: 100%;
  background: var(--c-bg);
}

.home-content {
  width: min(100%, 1360px);
  margin: 0 auto;
  padding: 1.75rem 1.75rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Hero banner ── */
.home-hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  background: linear-gradient(135deg, var(--c-navy) 0%, oklch(0.38 0.12 210) 100%);
  padding: 2rem;
  min-height: 100%;
  color: #fff;
  animation: fadeInUp 0.4s ease-out both;
}

.home-hero__blob {
  position: absolute;
  width: 300px;
  height: 300px;
  top: -80px;
  right: -60px;
  pointer-events: none;
}

.home-hero__content {
  position: relative;
  z-index: 1;
}

.home-hero__date {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  opacity: 0.7;
  margin: 0 0 0.25rem;
}

.home-hero__title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 900;
  color: white;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.home-hero__sub {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  opacity: 0.85;
  margin: 0 0 1.5rem;
}

.home-hero__cta {
  display: inline-flex;
  align-items: center;
  padding: 0.6875rem 1.5rem;
  border-radius: var(--radius-full);
  background: white;
  color: var(--c-navy);
  border: none;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 700;
  cursor: pointer;
  min-height: 44px;
  min-width: auto;
  transition: opacity 0.15s ease, transform 0.18s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.home-hero__cta:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

/* ── Stat cards ── */
.home-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.home-stat-card {
  background: var(--c-surface);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 11rem;
  box-shadow: var(--shadow-card);
  animation: fadeInUp 0.4s ease-out both;
}

.home-stat-card:nth-child(1) { animation-delay: 0.05s; }
.home-stat-card:nth-child(2) { animation-delay: 0.1s; }
.home-stat-card:nth-child(3) { animation-delay: 0.15s; }

.home-stat-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.home-stat-card__value {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--c-text);
  line-height: 1;
}

.home-stat-card__label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--c-text-medium);
}

.home-stat-card__trend {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--c-success);
}

/* ── Community stats dark card ── */
.home-community {
  background: var(--c-navy);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  min-height: 100%;
  animation: fadeInUp 0.4s ease-out 0.18s both;
}

.home-community__label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 0.875rem;
}

.home-community__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.home-community__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
}

.home-community__value {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 900;
  color: var(--brand-aqua);
  line-height: 1;
}

.home-community__sub {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.55);
}

/* ── Section wrapper ── */
.home-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  animation: fadeInUp 0.5s ease-out both;
}

.home-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.home-section__title {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--c-navy);
  margin: 0;
  letter-spacing: -0.01em;
}

/* ── Appointment card ── */
.home-appt-card {
  background: var(--c-surface);
  border-radius: var(--radius-lg);
  padding: 1.4rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  min-height: 100%;
  box-shadow: var(--shadow-card);
}

.home-appt-card__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--c-teal-light);
  border-radius: 14px;
  padding: 0.75rem 0.875rem;
  flex-shrink: 0;
}

.home-appt-card__day {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 900;
  color: var(--c-teal-dark);
  line-height: 1;
}

.home-appt-card__month {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--c-teal-dark);
  letter-spacing: 0.04em;
}

.home-appt-card__body {
  flex: 1;
  min-width: 0;
}

.home-appt-card__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.375rem;
}

.home-appt-card__name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  color: var(--c-navy);
}

.home-appt-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  background: var(--c-success-bg);
  color: var(--c-success-text, #1a6b3e);
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
}

.home-appt-card__detail {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--c-text-medium);
  line-height: 1.6;
  margin: 0 0 0.875rem;
}

.home-appt-card__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.home-appt-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  min-width: auto;
  border: none;
  transition: all 0.15s ease;
}

.home-appt-btn--primary {
  background: var(--c-beige);
  color: var(--c-teal-dark);
}

.home-appt-btn--primary:hover { background: var(--c-teal-light); }

.home-appt-btn--ghost {
  background: transparent;
  color: var(--c-text-medium);
}

.home-appt-btn--ghost:hover { background: var(--c-beige); }

.home-appt-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--c-teal);
  color: white;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Quick actions ── */
.home-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
}

.home-action-card {
  background: var(--c-surface);
  border-radius: var(--radius-lg);
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  cursor: pointer;
  text-align: left;
  box-shadow: var(--shadow-card);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 10.5rem;
}

.home-action-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hov);
}

.home-action-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.home-action-card__label {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--c-navy);
  line-height: 1.2;
}

.home-action-card__desc {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--c-text-light);
  line-height: 1.4;
}

/* ── Activity ── */
.home-activity {
  background: var(--c-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

@media (min-width: 1180px) {
  .home-content {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    align-items: stretch;
    gap: 1.25rem;
    padding: 1.5rem 1.5rem 2.5rem;
  }

  .home-hero {
    grid-column: 1 / span 7;
    padding: 2.1rem;
  }

  .home-stats {
    grid-column: 8 / -1;
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }

  .home-community {
    grid-column: 1 / span 4;
    padding: 1.35rem 1.4rem;
  }

  .home-section--appointment {
    grid-column: 5 / -1;
  }

  .home-section--actions,
  .home-section--activity {
    grid-column: 1 / -1;
  }

  .home-actions-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (min-width: 1024px) and (max-width: 1179px) {
  .home-content {
    width: min(100%, 1180px);
    max-width: none;
    padding: 1.5rem 1.5rem 2.5rem;
  }

  .home-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .home-actions-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .home-action-card {
    min-height: 9.5rem;
  }
}

.home-activity-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--c-border);
  transition: background 0.15s ease;
}

.home-activity-item:last-child {
  border-bottom: none;
}

.home-activity-item:hover {
  background: var(--c-beige);
}

.home-activity-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 0.35rem;
  background: var(--c-teal);
  box-shadow: 0 0 0 3px var(--c-teal-light);
  flex-shrink: 0;
}

.home-activity-item__body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.home-activity-item__title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--c-text);
  margin: 0;
}

.home-activity-item__desc {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--c-text-medium);
  margin: 0;
  line-height: 1.45;
}

.home-activity-item__time {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--c-text-light);
  white-space: nowrap;
  flex-shrink: 0;
}


/* ── Responsive ── */

/* Breakpoint intermédiaire (769px - 1023px) */
@media (max-width: 1023px) and (min-width: 769px) {
  .home-content {
    max-width: 100%;
    padding: 1.5rem 1.5rem 2.5rem;
    gap: 1.25rem;
  }

  .home-hero {
    padding: 1.5rem;
  }

  .home-hero__title {
    font-size: 1.5rem;
  }

  .home-stats {
    gap: 0.75rem;
  }

  .home-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablette intermédiaire (≤ 768 px) */
@media (max-width: 768px) {
  .home-content {
    padding: 1.25rem 1.25rem 2.5rem;
    gap: 1.25rem;
  }

  .home-hero {
    padding: 1.5rem;
  }

  .home-hero__blob {
    width: 220px;
    height: 220px;
    top: -50px;
    right: -40px;
  }

  .home-stats {
    gap: 0.75rem;
  }

  .home-community__value {
    font-size: 1.15rem;
  }
}

/* Mobile (≤ 640 px) */
@media (max-width: 640px) {
  .home-content {
    padding: 1rem 1rem 2rem;
    gap: 1rem;
  }

  .home-hero {
    padding: 1.25rem;
    border-radius: var(--radius-xl);
  }

  .home-hero__blob {
    width: 160px;
    height: 160px;
    top: -30px;
    right: -30px;
  }

  .home-hero__title {
    font-size: 1.375rem;
  }

  /* 1 colonne pour les stats */
  .home-stats {
    grid-template-columns: 1fr;
  }

  /* Community grid reste à 3 colonnes mais valeurs plus petites */
  .home-community__grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .home-community__value {
    font-size: 1rem;
  }

  /* Actions 1 colonne */
  .home-actions-grid {
    grid-template-columns: 1fr;
  }

  /* Appointment card : wrap + cacher avatar */
  .home-appt-card {
    flex-wrap: wrap;
  }

  .home-appt-card__avatar {
    display: none;
  }

  /* Activity : masquer l'heure sur très petits écrans */
  .home-activity-item {
    grid-template-columns: auto 1fr;
    padding: 0.875rem 1rem;
  }

  .home-activity-item__time {
    display: none;
  }

  .home-section__head {
    flex-direction: column;
    align-items: flex-start;
  }

  .home-logout-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Très petit mobile (≤ 375 px) */
@media (max-width: 375px) {
  .home-content {
    padding: 0.75rem 0.75rem 1.5rem;
  }

  .home-community {
    padding: 1rem;
  }

  .home-community__value {
    font-size: 0.9rem;
  }

  .home-stat-card__value {
    font-size: 1.375rem;
  }
}
</style>
