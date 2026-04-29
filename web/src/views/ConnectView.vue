<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import KIcon from "@/components/KIcon.vue";

const router = useRouter();
const tab = ref("messages");

const statusColor = {
  online: "#2ecc71",
  away: "#f0a500",
  offline: "var(--c-border)",
};

const messages = [];

const volunteers = [];

const onlineVolunteers = volunteers.filter((v) => v.status === "online");
</script>

<template>
  <div class="connect-view">
    <header class="connect-header">
      <p class="connect-header__eyebrow">
        Mise en relation
      </p>
      <h1 class="connect-header__title">
        Vos demandes d'accompagnement
      </h1>
    </header>

    <!-- Tab switcher -->
    <div class="connect-tabs">
      <button
        class="connect-tab"
        :class="{ 'connect-tab--active': tab === 'messages' }"
        @click="tab = 'messages'"
      >
        Messages
      </button>
      <button
        class="connect-tab"
        :class="{ 'connect-tab--active': tab === 'volontaires' }"
        @click="tab = 'volontaires'"
      >
        Volontaires actifs
      </button>
    </div>

    <!-- Messages tab -->
    <div
      v-if="tab === 'messages'"
      class="connect-content"
    >
      <div class="connect-list">
        <div
          v-for="m in messages"
          :key="m.name"
          class="msg-row"
        >
          <div class="msg-row__avatar-wrap">
            <div class="msg-row__avatar">
              {{ m.initials }}
            </div>
            <span
              class="msg-row__dot"
              :style="{ background: statusColor[m.status] }"
            />
          </div>
          <div class="msg-row__body">
            <div class="msg-row__top">
              <span class="msg-row__name">{{ m.name }}</span>
              <span class="msg-row__time">{{ m.time }}</span>
            </div>
            <span class="msg-row__status">{{ m.journeyStatus }}</span>
            <p class="msg-row__preview">
              {{ m.preview }}
            </p>
          </div>
          <div
            v-if="m.unread > 0"
            class="msg-row__badge"
          >
            {{ m.unread }}
          </div>
        </div>

        <!-- Branded CTA -->
        <div class="connect-cta">
          <div class="connect-cta__icon">
            <KIcon
              name="connect"
              :size="24"
              color="white"
            />
          </div>
          <h3 class="connect-cta__title">
            Besoin d'aide pour un déplacement ?
          </h3>
          <p class="connect-cta__sub">
            Faites une demande et un volontaire vous répondra en moins de 8 min.
          </p>
          <button
            class="connect-cta__btn connect-new-btn"
            aria-label="Créer une nouvelle demande d'accompagnement"
            @click="router.push({ name: 'map' })"
          >
            Nouvelle demande
          </button>
        </div>
      </div>
    </div>

    <!-- Volontaires tab -->
    <div
      v-else
      class="connect-content"
    >
      <!-- Horizontal scroll strip of online volunteers -->
      <div class="vol-strip">
        <div
          v-for="v in onlineVolunteers"
          :key="v.name"
          class="vol-strip__item"
        >
          <div class="vol-strip__avatar-wrap">
            <div class="vol-strip__avatar">
              {{ v.initials }}
            </div>
            <span class="vol-strip__online" />
            <span
              v-if="v.trust"
              class="vol-strip__trust"
            >
              <KIcon
                name="check"
                :size="8"
                color="white"
              />
            </span>
          </div>
          <span class="vol-strip__name">{{ v.name.split(" ")[0] }}</span>
        </div>
      </div>

      <!-- Volunteer cards grid -->
      <div class="vol-grid">
        <div
          v-for="v in volunteers"
          :key="v.name"
          class="vol-card"
        >
          <div class="vol-card__header">
            <div class="vol-card__avatar-wrap">
              <div class="vol-card__avatar">
                {{ v.initials }}
              </div>
              <span
                class="vol-card__dot"
                :style="{ background: statusColor[v.status] }"
              />
            </div>
            <div class="vol-card__meta">
              <div class="vol-card__name-row">
                <span class="vol-card__name">{{ v.name }}</span>
                <span
                  v-if="v.trust"
                  class="vol-card__trust"
                >
                  <KIcon
                    name="check"
                    :size="8"
                    color="white"
                  />
                </span>
              </div>
              <div class="vol-card__sub">
                <KIcon
                  name="star"
                  :size="10"
                  color="#f4b942"
                />
                {{ v.rating }} · {{ v.dist }}
              </div>
            </div>
          </div>

          <span
            class="vol-card__badge"
            :class="v.status === 'online' ? 'vol-card__badge--green' : 'vol-card__badge--gray'"
          >
            {{ v.status === "online" ? "Disponible" : "Indisponible" }}
          </span>

          <button
            class="vol-card__btn"
            :class="{ 'vol-card__btn--disabled': v.status !== 'online' }"
            :disabled="v.status !== 'online'"
          >
            <KIcon
              name="message"
              :size="13"
              :color="v.status === 'online' ? 'white' : 'var(--c-text-light)'"
            />
            Contacter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connect-view {
  width: min(100%, 1360px);
  margin: 0 auto;
  padding: 1.75rem 1.75rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.connect-header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.connect-header__eyebrow {
  margin: 0;
  color: var(--c-text-light);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.connect-header__title {
  margin: 0;
  color: var(--c-navy);
  font-family: var(--font-display), sans-serif;
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  line-height: 1.05;
}

/* ── Tabs ── */
.connect-tabs {
  display: flex;
  gap: 4px;
  background: var(--c-beige);
  border-radius: 14px;
  padding: 4px;
}

.connect-tab {
  flex: 1;
  padding: 0.625rem;
  border-radius: 11px;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.875rem;
  background: transparent;
  color: var(--c-text-medium);
  transition: all 0.18s;
  min-height: 44px;
}

.connect-tab--active {
  background: var(--c-surface);
  color: var(--c-teal-dark);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* ── Content ── */
.connect-content {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

/* ── Message rows ── */
.connect-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.msg-row {
  background: var(--c-surface);
  border-radius: var(--radius-lg);
  padding: 1.1rem 1.35rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.msg-row:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hov);
}

.msg-row__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.msg-row__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--c-teal);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
}

.msg-row__dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--c-surface);
}

.msg-row__body {
  flex: 1;
  min-width: 0;
}

.msg-row__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
}

.msg-row__name {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--c-navy);
}

.msg-row__time {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--c-text-light);
  flex-shrink: 0;
}

.msg-row__preview {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--c-text-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msg-row__status {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 0.35rem;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.1);
  color: var(--c-teal-dark);
  font-size: 0.72rem;
  font-weight: 700;
}

.msg-row__badge {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--c-teal);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  min-width: 22px;
  min-height: 22px;
}

/* ── Branded CTA ── */
.connect-cta {
  border-radius: var(--radius-xl);
  padding: 1.75rem 1.5rem;
  background: linear-gradient(135deg, var(--c-teal-light) 0%, #d8f0f4 100%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.connect-cta__icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--c-teal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.connect-cta__title {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 900;
  color: var(--c-navy);
  margin: 0;
}

.connect-cta__sub {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--c-text-medium);
  margin: 0;
  max-width: 360px;
}

.connect-cta__btn {
  display: inline-flex;
  align-items: center;
  padding: 0.6875rem 1.5rem;
  border-radius: var(--radius-full);
  border: none;
  background: var(--c-teal);
  color: white;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  box-shadow: var(--shadow-teal);
  transition: background 0.15s, transform 0.2s;
}

.connect-cta__btn:hover {
  background: var(--c-teal-dark);
  transform: translateY(-1px);
}

/* ── Volunteer strip ── */
.vol-strip {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
}

.vol-strip::-webkit-scrollbar {
  display: none;
}

.vol-strip__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  width: 72px;
}

.vol-strip__avatar-wrap {
  position: relative;
  width: 56px;
  height: 56px;
}

.vol-strip__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--c-teal);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
}

.vol-strip__online {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2ecc71;
  border: 2.5px solid var(--c-surface);
}

.vol-strip__trust {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #2ecc71;
  border: 2px solid var(--c-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vol-strip__name {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--c-text-medium);
  font-weight: 600;
  text-align: center;
  max-width: 72px;
  word-break: break-word;
  line-height: 1.2;
}

/* ── Volunteer grid ── */
.vol-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.875rem;
}

@media (min-width: 1180px) {
  .connect-view {
    padding: 1.5rem 1.5rem 2.5rem;
  }

  .connect-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.875rem;
  }

  .connect-cta {
    grid-column: 1 / -1;
    padding: 1.9rem 1.6rem;
  }

  .vol-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.vol-card {
  background: var(--c-surface);
  border-radius: var(--radius-lg);
  padding: 1.125rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  box-shadow: var(--shadow-card);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.vol-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hov);
}

.vol-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vol-card__avatar-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.vol-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--c-teal);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
}

.vol-card__dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid var(--c-surface);
}

.vol-card__meta {
  flex: 1;
  min-width: 0;
}

.vol-card__name-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}

.vol-card__name {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--c-navy);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vol-card__trust {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #2ecc71;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vol-card__sub {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--c-text-medium);
}

.vol-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
}

.vol-card__badge--green {
  background: var(--c-success-bg);
  color: var(--c-success-text, #1a6b3e);
}

.vol-card__badge--gray {
  background: var(--c-sand);
  color: var(--c-text-medium);
}

.vol-card__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 0.5625rem 1rem;
  border-radius: var(--radius-full);
  border: none;
  background: var(--c-teal);
  color: white;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 40px;
  transition: background 0.15s, transform 0.2s;
}

.vol-card__btn:hover:not(.vol-card__btn--disabled) {
  background: var(--c-teal-dark);
  transform: translateY(-1px);
}

.vol-card__btn--disabled {
  background: transparent;
  color: var(--c-text-light);
  border: 1.5px solid var(--c-border);
  cursor: not-allowed;
}

/* ── Responsive ── */
@media (max-width: 1023px) and (min-width: 769px) {
  .connect-view {
    padding: 1.5rem 1.5rem 2.5rem;
  }

  .vol-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .connect-view {
    padding: 1.25rem 1.25rem 2.5rem;
  }

  .vol-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .connect-view {
    padding: 1rem 1rem 2rem;
  }

  .vol-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
