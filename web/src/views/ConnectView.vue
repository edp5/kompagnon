<script setup>
import { CheckCircle, MapPin, MessageCircle, Phone, Plus, Shield, Zap } from "lucide-vue-next";

const messages = [
  {
    initials: "MD",
    name: "Marie D.",
    time: "14:32",
    badge: 2,
    text: "Je vous accompagne à la pharmacie dans 5 minutes !",
    status: "En route",
    statusClass: "msg__status--green",
    online: true,
  },
  {
    initials: "TR",
    name: "Thomas R.",
    time: "12:15",
    text: "Parfait ! À bientôt alors",
    status: "Terminé",
    statusClass: "msg__status--gray",
    online: false,
  },
  {
    initials: "SM",
    name: "Sophie M.",
    time: "Hier",
    text: "Merci pour votre aide hier !",
    status: "Terminé",
    statusClass: "msg__status--gray",
    online: false,
  },
];
</script>

<template>
  <div class="connect-view">
    <header class="connect-header">
      <div class="connect-header__left">
        <span class="connect-header__eyebrow">Réseau actif</span>
        <h1 class="connect-header__title">
          Mise en relation
        </h1>
        <p class="connect-header__sub">
          Vos demandes d'accompagnement et messages
        </p>
      </div>
      <button
        class="connect-new-btn"
        aria-label="Créer une nouvelle demande d'accompagnement"
        title="Commencez par remplir vos besoins d'accompagnement"
      >
        <Plus
          :size="16"
          :stroke-width="2.5"
          aria-hidden="true"
        />
        Nouvelle demande
      </button>
    </header>

    <div class="connect-content">
      <div class="connect-dashboard">
        <!-- Active accompagnement -->
        <section class="connect-active-card connect-card connect-card--dark">
          <div
            class="connect-active-card__pulse"
            aria-hidden="true"
          />
          <div class="connect-active-card__top">
            <span class="connect-card__eyebrow">En cours maintenant</span>
            <span class="connect-active-badge">Actif</span>
          </div>
          <h2 class="connect-active-card__title">
            Accompagnement en cours
          </h2>
          <div class="connect-active-card__route">
            <MapPin
              :size="13"
              :stroke-width="1.75"
              aria-hidden="true"
            />
            <span>12 rue de la République → Pharmacie Centrale</span>
          </div>
          <div class="connect-active-card__meta">
            <div class="connect-active-meta-item">
              <span class="connect-active-meta-item__label">Volontaire</span>
              <strong>Marie D.</strong>
            </div>
            <div class="connect-active-meta-item">
              <span class="connect-active-meta-item__label">Statut</span>
              <strong>En route</strong>
            </div>
          </div>
          <CheckCircle
            :size="18"
            color="#22c55e"
            :stroke-width="2"
            aria-hidden="true"
          />
        </section>

        <!-- Messages -->
        <section class="connect-panel connect-card">
          <div class="connect-panel__head">
            <div>
              <p class="connect-panel__eyebrow">
                Conversations
              </p>
              <h3 class="connect-panel__title">
                Messages récents
              </h3>
            </div>
            <a
              href="#"
              class="connect-section__more"
              aria-label="Voir tous les messages"
            >Voir tout</a>
          </div>
          <div class="connect-messages-grid">
            <div
              v-for="msg in messages"
              :key="msg.name"
              class="msg-card"
            >
              <div class="msg-card__top">
                <div class="msg-card__avatar-wrap">
                  <div class="msg-card__avatar">
                    {{ msg.initials }}
                  </div>
                  <span
                    v-if="msg.online"
                    class="msg-card__online"
                  />
                </div>
                <div class="msg-card__header">
                  <strong class="msg-card__name">{{ msg.name }}</strong>
                  <div class="msg-card__time-row">
                    <span class="msg-card__time">{{ msg.time }}</span>
                    <span
                      v-if="msg.badge"
                      class="msg-card__badge"
                    >{{ msg.badge }}</span>
                  </div>
                </div>
              </div>
              <p class="msg-card__text">
                {{ msg.text }}
              </p>
              <div class="msg-card__footer">
                <span
                  class="msg__status"
                  :class="msg.statusClass"
                >{{ msg.status }}</span>
                <div class="msg-card__actions">
                  <button
                    class="msg-card__action-btn"
                    :aria-label="`Envoyer un message à ${msg.name}`"
                    :title="`Ouvrir la conversation avec ${msg.name}`"
                  >
                    <MessageCircle
                      :size="16"
                      :stroke-width="1.75"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    class="msg-card__action-btn"
                    :aria-label="`Appeler ${msg.name}`"
                    :title="`Appel direct avec ${msg.name}`"
                  >
                    <Phone
                      :size="16"
                      :stroke-width="1.75"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Support card -->
        <section class="connect-support connect-card">
          <div class="connect-support__icon">
            <Shield
              :size="22"
              color="white"
              :stroke-width="1.75"
              aria-hidden="true"
            />
          </div>
          <div class="connect-support__body">
            <p class="connect-panel__eyebrow">
              Support
            </p>
            <h3 class="connect-support__title">
              Besoin d'aide ?
            </h3>
            <p class="connect-support__desc">
              Notre équipe est disponible 24h/24 pour vous accompagner
            </p>
          </div>
          <button
            class="connect-support__btn"
            aria-label="Contacter le support Kompagnon"
            title="Ouvrir le centre d'aide et de support"
          >
            <Zap
              :size="15"
              :stroke-width="2"
              aria-hidden="true"
            />
            Contacter le support
          </button>
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

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.45); }
  50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
}

.connect-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: transparent;
}

/* ── Header ── */
.connect-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 0.75rem;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.connect-header__left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.connect-header__eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.4rem;
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

.connect-header__title {
  font-size: clamp(1.6rem, 2.2vw, 2.2rem);
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.connect-header__sub {
  font-size: 0.9rem;
  color: #7b8794;
  margin: 0;
}

.connect-new-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #1e2c38 0%, #2a5f70 100%);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  box-shadow: 0 8px 20px rgba(30, 44, 56, 0.2);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}

.connect-new-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 14px 28px rgba(30, 44, 56, 0.25);
}

/* ── Content ── */
.connect-content {
  padding: 0 1.5rem 1.5rem;
}

.connect-dashboard {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
}

/* ── Base Card ── */
.connect-card {
  border-radius: 1.75rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 14px 40px rgba(15, 23, 42, 0.06),
    0 2px 6px rgba(15, 23, 42, 0.03);
  backdrop-filter: blur(10px);
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.connect-card--dark {
  background: linear-gradient(160deg, #101820 0%, #16212d 50%, #1d3140 100%);
  border-color: rgba(255, 255, 255, 0.06);
  color: white;
  box-shadow:
    0 18px 44px rgba(15, 23, 42, 0.18),
    0 2px 8px rgba(15, 23, 42, 0.12);
}

.connect-card__eyebrow {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.56);
}

/* ── Active card ── */
.connect-active-card {
  grid-column: span 4;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  position: relative;
  overflow: hidden;
  animation-delay: 0.06s;
}

.connect-active-card__pulse {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(72, 175, 196, 0.22) 0%, transparent 70%);
  pointer-events: none;
}

.connect-active-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.connect-active-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.18);
  color: #86efac;
  font-size: 0.75rem;
  font-weight: 700;
}

.connect-active-card__title {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0;
  position: relative;
  z-index: 1;
}

.connect-active-card__route {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.72);
  position: relative;
  z-index: 1;
}

.connect-active-card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  position: relative;
  z-index: 1;
}

.connect-active-meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.75rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
}

.connect-active-meta-item__label {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.56);
}

.connect-active-meta-item strong {
  font-size: 0.9rem;
  color: white;
}

/* ── Panel (messages) ── */
.connect-panel {
  grid-column: span 8;
  padding: 1.4rem;
  animation-delay: 0.1s;
}

.connect-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.connect-panel__eyebrow {
  margin: 0 0 0.2rem;
  font-size: 0.72rem;
  color: #7b8794;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.connect-panel__title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
  letter-spacing: -0.025em;
}

.connect-section__more {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--kompagnon-turquoise);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s;
}

.connect-section__more:hover {
  color: #3a9bb0;
}

/* ── Message cards ── */
.connect-messages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.875rem;
}

.msg-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.95) 100%);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 1.25rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, border-color 0.2s;
}

.msg-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 14px 28px rgba(72, 175, 196, 0.14);
  border-color: rgba(72, 175, 196, 0.3);
}

.msg-card__top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.msg-card__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.msg-card__avatar {
  width: 42px;
  height: 42px;
  border-radius: 0.875rem;
  background: rgba(72, 175, 196, 0.18);
  color: var(--kompagnon-navy);
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.msg-card__online {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid white;
  animation: pulse-dot 2s ease-in-out infinite;
}

.msg-card__header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.msg-card__name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-card__time-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.msg-card__time {
  font-size: 0.72rem;
  color: #9ca3af;
}

.msg-card__badge {
  background: #48AFC4;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.msg-card__text {
  font-size: 0.85rem;
  color: #374151;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.msg-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.msg__status {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
}

.msg__status--green { background: #dcfce7; color: #166534; }
.msg__status--gray { background: #f3f4f6; color: #374151; }

.msg-card__actions {
  display: flex;
  gap: 0.375rem;
}

.msg-card__action-btn {
  width: 32px;
  height: 32px;
  border: 1.5px solid rgba(15, 23, 42, 0.08);
  border-radius: 0.75rem;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  min-width: 32px;
  min-height: 32px;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
}

.msg-card__action-btn:hover {
  background: #e0f5f8;
  border-color: #48AFC4;
  color: #48AFC4;
  transform: scale(1.1);
}

/* ── Support card ── */
.connect-support {
  grid-column: 1 / -1;
  padding: 1.4rem 1.6rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  animation-delay: 0.16s;
}

.connect-support__icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 1.1rem;
  background: linear-gradient(135deg, var(--kompagnon-navy), var(--kompagnon-turquoise));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(72, 175, 196, 0.28);
}

.connect-support__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.connect-support__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
}

.connect-support__desc {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.connect-support__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  border: 1.5px solid rgba(72, 175, 196, 0.3);
  background: rgba(72, 175, 196, 0.06);
  color: var(--kompagnon-turquoise-dark);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.connect-support__btn:hover {
  background: rgba(72, 175, 196, 0.14);
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(72, 175, 196, 0.15);
}

@media (max-width: 1024px) {
  .connect-active-card,
  .connect-panel { grid-column: 1 / -1; }
  .connect-messages-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  .connect-header { padding: 1rem 1rem 0.75rem; flex-direction: column; align-items: flex-start; }
  .connect-content { padding: 0 1rem 1rem; }
  .connect-messages-grid { grid-template-columns: 1fr; }
  .connect-support { flex-direction: column; text-align: center; }
  .connect-support__icon { align-self: center; }
  .connect-support__btn { width: 100%; justify-content: center; }
}
</style>

