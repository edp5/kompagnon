<script setup>
import { CheckCircle, Info, Lock, ShieldCheck } from "lucide-vue-next";
import { ref } from "vue";

import BaseToggle from "@/components/BaseToggle.vue";

const visibilityOptions = ["Volontaires vérifiés uniquement", "Tous les membres", "Personne"];
const selectedVisibility = ref("Volontaires vérifiés uniquement");
const showDropdown = ref(false);

const profile = ref({ showName: true, showAge: false });
const location = ref({ share: true });
const history = ref({ share: false, analytics: true });

const score = 75;
</script>

<template>
  <div class="privacy-view">
    <header class="privacy-header">
      <div class="privacy-header__left">
        <span class="privacy-header__eyebrow">Données personnelles</span>
        <h1 class="privacy-header__title">
          Confidentialité
        </h1>
        <p class="privacy-header__sub">
          Contrôlez vos données et votre visibilité dans le réseau
        </p>
      </div>
    </header>

    <div class="privacy-content">
      <!-- Score card -->
      <div class="privacy-score-card privacy-card privacy-card--score">
        <div class="privacy-score-card__icon">
          <ShieldCheck
            :size="22"
            color="white"
            :stroke-width="2"
            aria-hidden="true"
          />
        </div>
        <div class="privacy-score-card__body">
          <p class="privacy-score-card__eyebrow">
            Score de confidentialité
          </p>
          <div class="privacy-score-bar">
            <div
              class="privacy-score-bar__fill"
              :style="{ width: score + '%' }"
            />
          </div>
          <span class="privacy-score-card__desc">Bon niveau de protection</span>
        </div>
        <div class="privacy-score-card__percentage">
          <span>{{ score }}%</span>
          <CheckCircle
            :size="18"
            color="#16a34a"
            :stroke-width="2"
            aria-hidden="true"
          />
        </div>
      </div>

      <!-- Sections -->
      <section class="privacy-section privacy-card">
        <div class="privacy-section__head">
          <Lock
            :size="16"
            color="var(--kompagnon-turquoise)"
            :stroke-width="1.75"
            aria-hidden="true"
          />
          <h3 class="privacy-section__title">
            Visibilité du profil
          </h3>
        </div>
        <p class="privacy-section__sub">
          Contrôlez qui peut voir votre profil et vos informations
        </p>

        <div class="privacy-rows">
          <div class="privacy-row">
            <div class="privacy-row__info">
              <strong>Visibilité du profil</strong>
              <p>Qui peut voir votre profil complet</p>
            </div>
            <div class="privacy-dropdown">
              <button
                class="privacy-dropdown__btn"
                :aria-label="`Visibilité du profil, actuellement: ${selectedVisibility}`"
                @click="showDropdown = !showDropdown"
              >
                {{ selectedVisibility }} ▾
              </button>
              <div
                v-if="showDropdown"
                class="privacy-dropdown__menu"
                role="listbox"
              >
                <button
                  v-for="opt in visibilityOptions"
                  :key="opt"
                  class="privacy-dropdown__item"
                  role="option"
                  :aria-selected="opt === selectedVisibility"
                  @click="selectedVisibility = opt; showDropdown = false"
                >
                  {{ opt }}
                </button>
              </div>
            </div>
          </div>

          <div class="privacy-row">
            <div class="privacy-row__info">
              <strong>Afficher mon nom complet</strong>
              <p>Montrer votre vrai nom aux volontaires</p>
            </div>
            <BaseToggle
              id="priv-name"
              v-model="profile.showName"
            />
          </div>

          <div class="privacy-row">
            <div class="privacy-row__info">
              <strong>Afficher mon âge</strong>
              <p>Montrer votre âge sur votre profil</p>
            </div>
            <BaseToggle
              id="priv-age"
              v-model="profile.showAge"
            />
          </div>
        </div>
      </section>

      <section class="privacy-section privacy-card">
        <div class="privacy-section__head">
          <Lock
            :size="16"
            color="var(--kompagnon-turquoise)"
            :stroke-width="1.75"
            aria-hidden="true"
          />
          <h3 class="privacy-section__title">
            Localisation
          </h3>
        </div>
        <p class="privacy-section__sub">
          Gérez le partage de votre position géographique
        </p>

        <div class="privacy-rows">
          <div
            class="privacy-row"
            :class="{ 'privacy-row--warning': location.share }"
          >
            <div class="privacy-row__info">
              <strong>Partage de localisation ⚠️</strong>
              <p>Permettre aux volontaires de voir votre position approximative</p>
              <div
                v-if="location.share"
                class="privacy-row__info-box"
              >
                <Info
                  :size="13"
                  color="var(--kompagnon-turquoise)"
                  :stroke-width="2"
                  aria-hidden="true"
                />
                <span>Votre position exacte n'est jamais partagée, seulement votre quartier approximatif</span>
              </div>
            </div>
            <BaseToggle
              id="priv-loc"
              v-model="location.share"
            />
          </div>
        </div>
      </section>

      <section class="privacy-section privacy-card">
        <div class="privacy-section__head">
          <Lock
            :size="16"
            color="var(--kompagnon-turquoise)"
            :stroke-width="1.75"
            aria-hidden="true"
          />
          <h3 class="privacy-section__title">
            Historique et données
          </h3>
        </div>
        <p class="privacy-section__sub">
          Contrôlez l'utilisation de vos données
        </p>
        <div class="privacy-rows">
          <div class="privacy-row">
            <div class="privacy-row__info">
              <strong>Partager mon historique</strong>
              <p>Permettre aux volontaires de voir vos trajets passés</p>
            </div>
            <BaseToggle
              id="priv-history"
              v-model="history.share"
            />
          </div>
          <div class="privacy-row">
            <div class="privacy-row__info">
              <strong>Améliorer le service</strong>
              <p>Permettre l'analyse anonyme de votre utilisation</p>
            </div>
            <BaseToggle
              id="priv-analytics"
              v-model="history.analytics"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
@keyframes spring-in {
  0% { opacity: 0; transform: translateY(20px) scale(0.97); }
  60% { opacity: 1; transform: translateY(-4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.privacy-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: transparent;
}

/* ── Header ── */
.privacy-header {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding: 1.25rem 1.5rem 0.75rem;
  flex-shrink: 0;
}

.privacy-header__left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.privacy-header__eyebrow {
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

.privacy-header__title {
  font-size: clamp(1.6rem, 2.2vw, 2.2rem);
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.privacy-header__sub {
  font-size: 0.9rem;
  color: #7b8794;
  margin: 0;
}

/* ── Content ── */
.privacy-content {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 900px;
}

/* ── Base card ── */
.privacy-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(15, 23, 42, 0.03);
  backdrop-filter: blur(10px);
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* ── Score card ── */
.privacy-score-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.4rem;
  background: linear-gradient(135deg, rgba(72, 175, 196, 0.1) 0%, rgba(158, 212, 217, 0.15) 100%);
  border-color: rgba(72, 175, 196, 0.2);
}

.privacy-score-card__icon {
  width: 46px;
  height: 46px;
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--kompagnon-navy), var(--kompagnon-turquoise));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(72, 175, 196, 0.28);
}

.privacy-score-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.privacy-score-card__eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
}

.privacy-score-bar {
  width: min(280px, 100%);
  height: 7px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  overflow: hidden;
}

.privacy-score-bar__fill {
  height: 100%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.privacy-score-card__desc {
  font-size: 0.8rem;
  color: #16a34a;
  font-weight: 600;
}

.privacy-score-card__percentage {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--kompagnon-navy);
  flex-shrink: 0;
  letter-spacing: -0.04em;
}

/* ── Sections ── */
.privacy-section {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}

.privacy-section:nth-child(2) { animation-delay: 0.06s; }
.privacy-section:nth-child(3) { animation-delay: 0.1s; }
.privacy-section:nth-child(4) { animation-delay: 0.14s; }

.privacy-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(72, 175, 196, 0.1);
}

.privacy-section__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.125rem;
}

.privacy-section__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  letter-spacing: -0.02em;
}

.privacy-section__sub {
  font-size: 0.83rem;
  color: #6b7280;
  margin: 0 0 0.375rem;
}

/* ── Rows ── */
.privacy-rows {
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
}

.privacy-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
}

.privacy-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.privacy-row--warning {
  background: rgba(254, 252, 232, 0.7);
  margin: 0 -0.25rem;
  padding: 0.875rem 0.25rem;
  border-radius: 0.875rem;
}

.privacy-row__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.privacy-row__info strong {
  font-size: 0.9rem;
  color: var(--kompagnon-navy);
  font-weight: 600;
}

.privacy-row__info p {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

.privacy-row__info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  background: rgba(72, 175, 196, 0.08);
  border: 1px solid rgba(72, 175, 196, 0.15);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  margin-top: 0.375rem;
  font-size: 0.78rem;
  color: var(--kompagnon-turquoise-dark);
  line-height: 1.45;
}

/* ── Dropdown ── */
.privacy-dropdown {
  position: relative;
  flex-shrink: 0;
}

.privacy-dropdown__btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border: 1.5px solid rgba(15, 23, 42, 0.08);
  border-radius: 0.875rem;
  padding: 0.5rem 0.875rem;
  background: rgba(248, 250, 252, 0.95);
  font-size: 0.875rem;
  color: var(--kompagnon-navy);
  cursor: pointer;
  white-space: nowrap;
  min-height: 38px;
  font-weight: 500;
  transition: border-color 0.2s, background 0.2s;
}

.privacy-dropdown__btn:hover {
  border-color: rgba(72, 175, 196, 0.3);
  background: white;
}

.privacy-dropdown__menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 1rem;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
  z-index: 20;
  min-width: 230px;
  overflow: hidden;
}

.privacy-dropdown__item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border: none;
  background: white;
  font-size: 0.9rem;
  color: var(--kompagnon-navy);
  cursor: pointer;
  min-height: 44px;
  transition: background 0.15s;
}

.privacy-dropdown__item:hover {
  background: rgba(72, 175, 196, 0.06);
}

@media (max-width: 640px) {
  .privacy-header { padding: 1rem 1rem 0.75rem; }
  .privacy-content { padding: 0 1rem 1rem; }
  .privacy-score-card { flex-wrap: wrap; }
}
</style>

