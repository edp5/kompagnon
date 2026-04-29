<script setup>
import { ChevronRight, Shield, User } from "lucide-vue-next";
import { ref } from "vue";

import BaseToggle from "@/components/BaseToggle.vue";

const settings = ref({
  notifPush: true,
  notifEmail: true,
  notifVolunteer: true,
  notifTrip: true,
  notifUrgency: true,
  privLocation: true,
  privVisible: true,
  privMessages: true,
});
</script>

<template>
  <div class="settings-view">
    <header class="settings-header">
      <div class="settings-header__left">
        <span class="settings-header__eyebrow">Votre espace</span>
        <h1 class="settings-header__title">
          Paramètres
        </h1>
        <p class="settings-header__sub">
          Personnalisez votre expérience Kompagnon
        </p>
      </div>
    </header>

    <div class="settings-content">
      <!-- User card -->
      <div class="settings-user-card settings-card">
        <div class="settings-user-card__avatar">
          <User
            :size="22"
            color="#6b7280"
            :stroke-width="1.75"
            aria-hidden="true"
          />
        </div>
        <div class="settings-user-card__info">
          <strong>Marie Dupont</strong>
          <span>marie.dupont@email.com</span>
          <span class="settings-user-card__badge">
            <Shield
              :size="11"
              :stroke-width="2"
              aria-hidden="true"
            />
            Profil vérifié
          </span>
        </div>
        <button
          class="settings-user-card__arrow"
          aria-label="Voir plus d'options pour votre profil"
          title="Accédez à d'autres paramètres de profil"
        >
          <ChevronRight
            :size="18"
            :stroke-width="1.75"
            aria-hidden="true"
          />
        </button>
      </div>

      <!-- Settings grid -->
      <div class="settings-grid">
        <!-- Notifications -->
        <div class="settings-section settings-card">
          <div class="settings-section__head">
            <span
              class="settings-section__icon"
              aria-hidden="true"
            >🔔</span>
            <h3 class="settings-section__title">
              Notifications
            </h3>
          </div>
          <div class="settings-rows">
            <div class="settings-row">
              <div>
                <strong>Notifications push</strong>
                <p>Recevoir des notifications sur votre appareil</p>
              </div>
              <BaseToggle
                id="notif-push"
                v-model="settings.notifPush"
              />
            </div>
            <div class="settings-row">
              <div>
                <strong>Notifications par email</strong>
                <p>Recevoir des emails de mise à jour</p>
              </div>
              <BaseToggle
                id="notif-email"
                v-model="settings.notifEmail"
              />
            </div>
            <div class="settings-row">
              <div>
                <strong>Demandes de volontaires</strong>
                <p>Être notifié des nouvelles demandes</p>
              </div>
              <BaseToggle
                id="notif-volunteer"
                v-model="settings.notifVolunteer"
              />
            </div>
            <div class="settings-row">
              <div>
                <strong>Mises à jour de trajets</strong>
                <p>Changements d'horaires ou d'itinéraires</p>
              </div>
              <BaseToggle
                id="notif-trip"
                v-model="settings.notifTrip"
              />
            </div>
            <div class="settings-row">
              <div>
                <strong>Alertes d'urgence</strong>
                <p>Notifications critiques de sécurité</p>
              </div>
              <BaseToggle
                id="notif-urgency"
                v-model="settings.notifUrgency"
              />
            </div>
          </div>
        </div>

        <!-- Privacy -->
        <div class="settings-section settings-card">
          <div class="settings-section__head">
            <span
              class="settings-section__icon"
              aria-hidden="true"
            >🔒</span>
            <h3 class="settings-section__title">
              Confidentialité et sécurité
            </h3>
          </div>
          <div class="settings-rows">
            <div class="settings-row">
              <div>
                <strong>Partager ma position</strong>
                <p>Permettre aux volontaires de voir votre localisation</p>
              </div>
              <BaseToggle
                id="priv-location"
                v-model="settings.privLocation"
              />
            </div>
            <div class="settings-row">
              <div>
                <strong>Profil visible</strong>
                <p>Rendre votre profil visible aux volontaires</p>
              </div>
              <BaseToggle
                id="priv-visible"
                v-model="settings.privVisible"
              />
            </div>
            <div class="settings-row">
              <div>
                <strong>Autoriser les messages</strong>
                <p>Recevoir des messages des volontaires</p>
              </div>
              <BaseToggle
                id="priv-messages"
                v-model="settings.privMessages"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Accessibilité -->
      <div class="settings-section settings-card settings-section--a11y">
        <div class="settings-section__head">
          <span
            class="settings-section__icon"
            aria-hidden="true"
          >♿</span>
          <h3 class="settings-section__title">
            Accessibilité
          </h3>
        </div>
        <p class="settings-section__desc">
          Contraste élevé, texte agrandi, réduction des animations, mode sombre, lecteur d'écran — utilisez le bouton <strong>Accessibilité</strong> en bas à droite de l'écran pour configurer ces options.
        </p>
      </div>

      <!-- About -->
      <div class="settings-section settings-card">
        <h3 class="settings-section__title">
          À propos de l'application
        </h3>
        <div class="settings-about">
          <div class="settings-about-row">
            <span>Version</span><span>2.1.0</span>
          </div>
          <div class="settings-about-row">
            <span>Dernière mise à jour</span><span>15 mars 2024</span>
          </div>
          <div class="settings-about-row">
            <span>Taille de l'app</span><span>48.2 MB</span>
          </div>
        </div>
        <div class="settings-links">
          <button
            class="settings-link-row"
            aria-label="Lire les conditions d'utilisation de l'application"
          >
            Conditions d'utilisation
          </button>
          <button
            class="settings-link-row"
            aria-label="Lire la politique de confidentialité"
          >
            Politique de confidentialité
          </button>
          <button
            class="settings-link-row"
            aria-label="Consulter les licences open source"
          >
            Licences open source
          </button>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="settings-danger settings-card">
        <h3 class="settings-danger__title">
          Zone de danger
        </h3>
        <p class="settings-danger__desc">
          Ces actions sont irréversibles. Procédez avec précaution.
        </p>
        <div class="settings-danger__actions">
          <button
            class="settings-danger__btn"
            aria-label="Effacer toutes vos données stockées localement"
            title="Cette action supprimera toutes vos données en cache"
          >
            Effacer les données
          </button>
          <button
            class="settings-danger__btn settings-danger__btn--hard"
            aria-label="Supprimer définitivement votre compte Kompagnon"
            title="Attention: cette action est irréversible"
          >
            Supprimer le compte
          </button>
        </div>
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

.settings-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: transparent;
}

/* ── Header ── */
.settings-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 0.75rem;
  flex-shrink: 0;
}

.settings-header__left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.settings-header__eyebrow {
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

.settings-header__title {
  font-size: clamp(1.6rem, 2.2vw, 2.2rem);
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.settings-header__sub {
  font-size: 0.9rem;
  color: #7b8794;
  margin: 0;
}

/* ── Content ── */
.settings-content {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1100px;
}

/* ── Base Card ── */
.settings-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(15, 23, 42, 0.03);
  backdrop-filter: blur(10px);
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* ── User card ── */
.settings-user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
  cursor: pointer;
  animation-delay: 0s;
}

.settings-user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(72, 175, 196, 0.12);
}

.settings-user-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 1rem;
  background: rgba(72, 175, 196, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.2s;
}

.settings-user-card:hover .settings-user-card__avatar {
  background: rgba(72, 175, 196, 0.18);
  transform: scale(1.08);
}

.settings-user-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.settings-user-card__info strong {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
}

.settings-user-card__info span {
  font-size: 0.8rem;
  color: #6b7280;
}

.settings-user-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--kompagnon-turquoise);
  width: fit-content;
}

.settings-user-card__arrow {
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: transform 0.2s, color 0.2s;
}

.settings-user-card:hover .settings-user-card__arrow {
  transform: translateX(4px);
  color: var(--kompagnon-turquoise);
}

/* ── Settings grid ── */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* ── Section ── */
.settings-section {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}

.settings-grid .settings-section:nth-child(1) { animation-delay: 0.06s; }
.settings-grid .settings-section:nth-child(2) { animation-delay: 0.1s; }

.settings-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(72, 175, 196, 0.1);
}

.settings-section--a11y {
  background: linear-gradient(135deg, rgba(72, 175, 196, 0.06), rgba(72, 175, 196, 0.02));
  border-color: rgba(72, 175, 196, 0.18);
  animation-delay: 0.12s;
}

.settings-section__head {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.settings-section__icon {
  font-size: 1.125rem;
  transition: transform 0.2s;
}

.settings-section:hover .settings-section__icon {
  transform: scale(1.15);
}

.settings-section__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  letter-spacing: -0.02em;
}

.settings-section__desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* ── Rows ── */
.settings-rows {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  transition: background 0.2s;
  border-radius: 0.5rem;
}

.settings-row:hover {
  background: rgba(72, 175, 196, 0.04);
  padding-inline: 0.5rem;
  margin-inline: -0.5rem;
}

.settings-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.settings-row > div {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.settings-row strong {
  font-size: 0.9rem;
  color: var(--kompagnon-navy);
  font-weight: 600;
}

.settings-row p {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

/* ── About ── */
.settings-about {
  display: flex;
  flex-direction: column;
  animation-delay: 0.14s;
}

.settings-about-row {
  display: flex;
  justify-content: space-between;
  padding: 0.625rem 0;
  font-size: 0.9rem;
  color: var(--kompagnon-navy);
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  transition: color 0.2s, padding-left 0.2s;
}

.settings-about-row:hover {
  color: var(--kompagnon-turquoise);
  padding-left: 4px;
}

.settings-about-row:last-child {
  border-bottom: none;
}

.settings-about-row span:last-child {
  color: #6b7280;
}

.settings-links {
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
}

.settings-link-row {
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  padding: 0.75rem 0;
  font-size: 0.9rem;
  color: var(--kompagnon-navy);
  cursor: pointer;
  min-height: 44px;
  transition: color 0.2s, padding-left 0.2s;
}

.settings-link-row:hover {
  color: var(--kompagnon-turquoise);
  padding-left: 4px;
}

.settings-link-row:last-child {
  border-bottom: none;
}

/* ── Danger ── */
.settings-danger {
  background: rgba(254, 242, 242, 0.92);
  border-color: rgba(252, 165, 165, 0.5);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation-delay: 0.18s;
}

.settings-danger__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #dc2626;
  margin: 0;
}

.settings-danger__desc {
  font-size: 0.85rem;
  color: #9ca3af;
  margin: 0;
}

.settings-danger__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.settings-danger__btn {
  flex: 1;
  background: white;
  border: 1.5px solid #fca5a5;
  color: #dc2626;
  border-radius: 0.875rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.settings-danger__btn:hover {
  background: rgba(220, 38, 38, 0.06);
  transform: translateY(-1px);
}

.settings-danger__btn--hard:hover {
  background: #dc2626;
  color: white;
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.22);
}

@media (max-width: 768px) {
  .settings-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .settings-header { padding: 1rem 1rem 0.75rem; }
  .settings-content { padding: 0 1rem 1rem; }
}
</style>
