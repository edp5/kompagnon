<script setup>
import {
  CalendarDays,
  Camera,
  CheckCircle,
  Clock3,
  Edit,
  Mail,
  Shield,
  Star,
  User,
} from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { getUserProfile } from "@/adapters/users.js";
import { USER_GENRE, USER_ROLES } from "@/constants.js";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const profile = ref(null);
const errorMessage = ref("");
const isLoading = ref(true);

onMounted(async () => {
  const token = authStore.token;

  if (!token) {
    router.push({ name: "login" });
    return;
  }

  const result = await getUserProfile({ token });
  if (result.success) {
    profile.value = result.profile;
  } else {
    errorMessage.value = result.message ?? "Impossible de charger le profil.";
    if (result.errorCode === "SESSION_EXPIRED") {
      authStore.logout();
      router.push({ name: "login" });
    }
  }

  isLoading.value = false;
});

const displayName = computed(() => {
  const firstname = profile.value?.firstname ?? "Marie";
  const lastname = profile.value?.lastname ?? "Dupont";

  return `${firstname} ${lastname}`.trim();
});

const initials = computed(() => {
  const firstname = profile.value?.firstname?.[0] ?? "M";
  const lastname = profile.value?.lastname?.[0] ?? "D";

  return `${firstname}${lastname}`.toUpperCase();
});

const displayGenre = computed(() => USER_GENRE[profile.value?.genre] ?? "—");
const displayRole = computed(() => USER_ROLES[profile.value?.role] ?? "—");

const stats = computed(() => [
  { value: displayGenre.value, label: "Civilité", accent: "var(--kompagnon-turquoise)" },
  { value: displayRole.value, label: "Rôle", accent: "var(--kompagnon-navy)" },
  { value: profile.value?.birthday ?? "—", label: "Naissance", accent: "#f59e0b" },
  { value: profile.value?.email ? "Actif" : "—", label: "Compte", accent: "var(--kompagnon-turquoise)" },
]);

const detailItems = computed(() => [
  { label: "Civilité", value: displayGenre.value },
  { label: "Prénom", value: profile.value?.firstname ?? "—" },
  { label: "Nom", value: profile.value?.lastname ?? "—" },
  { label: "Email", value: profile.value?.email ?? "—" },
  { label: "Date de naissance", value: profile.value?.birthday ?? "—" },
  { label: "Vous êtes", value: displayRole.value },
]);

const highlights = computed(() => [
  {
    title: "Session sécurisée",
    description: "Vos informations sont récupérées via une route authentifiée et protégée.",
  },
  {
    title: "Profil synchronisé",
    description: profile.value?.email
      ? `Le compte ${profile.value.email} est bien rattaché à votre session actuelle.`
      : "Les informations du compte sont disponibles dans votre espace personnel.",
  },
  {
    title: "Expérience unifiée",
    description: "Cette page reprend le même design system que le reste de l’application web.",
  },
]);

const reviews = [
  {
    author: "par Sylvie M.",
    time: "Il y a 2 jours",
    text: "Très bienveillante et patiente, l’accompagnement a été fluide et rassurant.",
  },
  {
    author: "par Robert D.",
    time: "Il y a 1 semaine",
    text: "Un profil clair, une communication simple et une expérience très agréable.",
  },
];
</script>

<template>
  <div class="profile-view">
    <header class="profile-header">
      <div>
        <p class="profile-header__eyebrow">
          Espace personnel
        </p>
        <h1 class="profile-header__title">
          Mon profil
        </h1>
        <p class="profile-header__subtitle">
          Retrouvez vos informations essentielles dans une vue claire, sécurisée et cohérente avec le reste de l’application.
        </p>
      </div>
    </header>

    <p
      v-if="isLoading"
      class="profile-feedback"
    >
      Chargement du profil...
    </p>

    <p
      v-else-if="errorMessage"
      class="profile-feedback profile-feedback--error"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessage }}
    </p>

    <div
      v-else-if="profile"
      class="profile-content"
    >
      <section class="profile-banner">
        <div
          class="profile-banner__orb"
          aria-hidden="true"
        />

        <button
          class="profile-banner__edit"
          type="button"
          aria-label="Modifier votre profil"
          title="Fonctionnalité bientôt disponible"
        >
          <Edit
            :size="15"
            :stroke-width="1.75"
            aria-hidden="true"
          />
          Modifier
        </button>

        <div class="profile-banner__card">
          <div class="profile-avatar">
            <div class="profile-avatar__circle">
              {{ initials }}
            </div>
            <button
              class="profile-avatar__camera"
              type="button"
              aria-label="Changer votre photo de profil"
              title="Fonctionnalité bientôt disponible"
            >
              <Camera
                :size="12"
                :stroke-width="2"
                aria-hidden="true"
              />
            </button>
          </div>

          <div class="profile-banner__body">
            <div class="profile-banner__name-row">
              <h2 class="profile-banner__name">
                {{ displayName }}
              </h2>
              <span class="profile-banner__verified">
                <CheckCircle
                  :size="13"
                  :stroke-width="2"
                  aria-hidden="true"
                />
                Vérifié
              </span>
            </div>

            <div class="profile-banner__meta">
              <span class="profile-banner__meta-item">
                <Mail
                  :size="14"
                  :stroke-width="1.75"
                  aria-hidden="true"
                />
                {{ profile.email }}
              </span>
              <span class="profile-banner__meta-item">
                <CalendarDays
                  :size="14"
                  :stroke-width="1.75"
                  aria-hidden="true"
                />
                {{ profile.birthday }}
              </span>
            </div>

            <div class="profile-banner__badges">
              <span class="profile-badge">
                <User
                  :size="11"
                  :stroke-width="1.75"
                  aria-hidden="true"
                />
                {{ displayGenre }}
              </span>
              <span class="profile-badge">
                <Shield
                  :size="11"
                  :stroke-width="1.75"
                  aria-hidden="true"
                />
                {{ displayRole }}
              </span>
              <span class="profile-badge">
                <Clock3
                  :size="11"
                  :stroke-width="1.75"
                  aria-hidden="true"
                />
                Session sécurisée
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="profile-stats">
        <article
          v-for="stat in stats"
          :key="stat.label"
          class="profile-stat profile-card"
        >
          <span
            class="profile-stat__value"
            :style="{ color: stat.accent }"
          >{{ stat.value }}</span>
          <span class="profile-stat__label">{{ stat.label }}</span>
        </article>
      </section>

      <div class="profile-grid">
        <section class="profile-card profile-details-card">
          <div class="profile-section__head">
            <div>
              <p class="profile-section__eyebrow">
                Informations personnelles
              </p>
              <h3 class="profile-section__title">
                Détails du compte
              </h3>
            </div>
          </div>

          <dl class="profile-details">
            <div
              v-for="item in detailItems"
              :key="item.label"
              class="profile-detail-row"
            >
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
        </section>

        <section class="profile-card profile-highlights-card">
          <div class="profile-section__head">
            <div>
              <p class="profile-section__eyebrow">
                Vue d’ensemble
              </p>
              <h3 class="profile-section__title">
                Points de repère
              </h3>
            </div>
          </div>

          <div class="profile-highlights">
            <article
              v-for="item in highlights"
              :key="item.title"
              class="profile-highlight"
            >
              <span class="profile-highlight__icon">
                <CheckCircle
                  :size="16"
                  :stroke-width="1.9"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p class="profile-highlight__title">
                  {{ item.title }}
                </p>
                <p class="profile-highlight__description">
                  {{ item.description }}
                </p>
              </div>
            </article>
          </div>
        </section>

        <section class="profile-card profile-card--dark profile-reviews-card">
          <div class="profile-section__head profile-section__head--light">
            <div>
              <p class="profile-section__eyebrow profile-section__eyebrow--light">
                Retours récents
              </p>
              <h3 class="profile-section__title profile-section__title--light">
                Expérience ressentie
              </h3>
            </div>
          </div>

          <div class="profile-reviews">
            <article
              v-for="review in reviews"
              :key="review.author"
              class="profile-review"
            >
              <div class="profile-review__top">
                <div class="profile-review__stars">
                  <Star
                    v-for="star in 5"
                    :key="star"
                    :size="12"
                    :stroke-width="1.75"
                    class="profile-review__star"
                    aria-hidden="true"
                  />
                </div>
                <span class="profile-review__time">{{ review.time }}</span>
              </div>
              <p class="profile-review__author">
                {{ review.author }}
              </p>
              <p class="profile-review__text">
                {{ review.text }}
              </p>
            </article>
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

.profile-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: transparent;
}

.profile-header {
  padding: 1.25rem 1.5rem 0.75rem;
}

.profile-header__eyebrow {
  margin: 0 0 0.3rem;
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.12);
  border: 1px solid rgba(72, 175, 196, 0.2);
  color: #2a5f70;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.profile-header__title {
  margin: 0;
  font-size: clamp(1.7rem, 2.5vw, 2.4rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--kompagnon-navy);
}

.profile-header__subtitle {
  margin: 0.45rem 0 0;
  max-width: 46rem;
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
}

.profile-feedback {
  margin: 0 1.5rem;
  padding: 1rem 1.15rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(15, 23, 42, 0.06);
  color: #475569;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
}

.profile-feedback--error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #b91c1c;
}

.profile-content {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-banner {
  position: relative;
  background: linear-gradient(160deg, #101820 0%, #16212d 55%, #1d3140 100%);
  border-radius: 1.75rem;
  padding: 1.4rem;
  overflow: hidden;
  animation: spring-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.profile-banner__orb {
  position: absolute;
  top: -70px;
  right: -70px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(72, 175, 196, 0.28) 0%, transparent 70%);
  pointer-events: none;
}

.profile-banner__edit {
  margin-left: auto;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.88);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}

.profile-banner__edit:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.32);
  transform: translateY(-1px);
}

.profile-banner__card {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar__circle {
  width: 76px;
  height: 76px;
  border-radius: 1.35rem;
  background: linear-gradient(135deg, rgba(72, 175, 196, 0.16), rgba(30, 44, 56, 0.12));
  color: var(--kompagnon-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
  border: 2px solid rgba(15, 23, 42, 0.06);
}

.profile-avatar__camera {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  background: var(--kompagnon-turquoise);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(72, 175, 196, 0.28);
}

.profile-banner__body {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-width: 0;
}

.profile-banner__name-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.profile-banner__name {
  margin: 0;
  font-size: clamp(1.2rem, 1.7vw, 1.5rem);
  color: var(--kompagnon-navy);
  letter-spacing: -0.03em;
}

.profile-banner__verified {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.26rem 0.65rem;
  border-radius: 999px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  font-size: 0.74rem;
  font-weight: 700;
}

.profile-banner__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.profile-banner__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #64748b;
  font-size: 0.88rem;
}

.profile-banner__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.05);
  color: #334155;
  font-size: 0.75rem;
  font-weight: 600;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.profile-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(15, 23, 42, 0.03);
  backdrop-filter: blur(10px);
  animation: spring-in 0.58s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.profile-card--dark {
  background: linear-gradient(160deg, #101820 0%, #16212d 50%, #1d3140 100%);
  border-color: rgba(255, 255, 255, 0.06);
  color: white;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.12);
}

.profile-stat {
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  text-align: center;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}

.profile-stat:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 32px rgba(72, 175, 196, 0.14);
}

.profile-stat__value {
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.profile-stat__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #7b8794;
}

.profile-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 1rem;
}

.profile-details-card,
.profile-highlights-card,
.profile-reviews-card {
  padding: 1.25rem;
}

.profile-reviews-card {
  grid-column: 1 / -1;
}

.profile-section__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.profile-section__head--light {
  margin-bottom: 0.85rem;
}

.profile-section__eyebrow {
  margin: 0 0 0.3rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #7b8794;
}

.profile-section__eyebrow--light {
  color: rgba(255, 255, 255, 0.56);
}

.profile-section__title {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--kompagnon-navy);
}

.profile-section__title--light {
  color: white;
}

.profile-details {
  display: grid;
  gap: 0.8rem;
}

.profile-detail-row {
  display: grid;
  grid-template-columns: minmax(140px, 180px) 1fr;
  gap: 0.85rem;
  padding: 0.85rem 0.95rem;
  border-radius: 1rem;
  background: rgba(248, 250, 252, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.04);
}

.profile-detail-row dt {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: #64748b;
}

.profile-detail-row dd {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--kompagnon-navy);
  word-break: break-word;
}

.profile-highlights {
  display: grid;
  gap: 0.75rem;
}

.profile-highlight {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.95rem;
  border-radius: 1rem;
  background: rgba(72, 175, 196, 0.06);
  border: 1px solid rgba(72, 175, 196, 0.14);
}

.profile-highlight__icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(72, 175, 196, 0.12);
  color: var(--kompagnon-turquoise);
}

.profile-highlight__title {
  margin: 0 0 0.2rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
}

.profile-highlight__description {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.55;
  color: #64748b;
}

.profile-reviews {
  display: grid;
  gap: 0.85rem;
}

.profile-review {
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
}

.profile-review__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.profile-review__stars {
  display: flex;
  gap: 2px;
}

.profile-review__star {
  color: #fbbf24;
  fill: #fbbf24;
}

.profile-review__time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
}

.profile-review__author {
  margin: 0 0 0.25rem;
  font-size: 0.84rem;
  font-weight: 700;
  color: white;
}

.profile-review__text {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}

@media (max-width: 1024px) {
  .profile-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-header {
    padding: 1rem 1rem 0.5rem;
  }

  .profile-content {
    padding: 0 1rem 1rem;
  }

  .profile-feedback {
    margin: 0 1rem;
  }

  .profile-banner {
    padding: 1rem;
  }

  .profile-banner__card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.2rem;
  }

  .profile-banner__badges,
  .profile-banner__meta,
  .profile-banner__name-row {
    justify-content: center;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }

  .profile-detail-row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}
</style>

