<script setup>
import { computed, onMounted, ref } from "vue";

import KIcon from "@/components/KIcon.vue";

const isOpen = ref(false);

const STORAGE_KEYS = {
  highContrast: "a11y-high-contrast",
  largeText: "a11y-large-text",
  reducedMotion: "a11y-reduced-motion",
  darkMode: "a11y-dark-mode",
};

function getStorageValue(key) {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS[key]) === "true";
}

const settings = ref({
  highContrast: getStorageValue("highContrast"),
  largeText: getStorageValue("largeText"),
  reducedMotion: getStorageValue("reducedMotion"),
  darkMode: getStorageValue("darkMode"),
});

function toggleSetting(key) {
  settings.value[key] = !settings.value[key];
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEYS[key], settings.value[key]);
  }
  applySettings();
}

function applySettings() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("a11y-contrast", settings.value.highContrast);
  root.classList.toggle("a11y-large-text", settings.value.largeText);
  root.classList.toggle("a11y-reduced-motion", settings.value.reducedMotion);
  root.classList.toggle("a11y-dark-mode", settings.value.darkMode);
}

function resetSettings() {
  settings.value = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    darkMode: false,
  };
  if (typeof localStorage !== "undefined") {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
  applySettings();
}

const activeCount = computed(() => Object.values(settings.value).filter(Boolean).length);

const options = [
  { key: "highContrast", label: "Contraste élevé", desc: "Améliore la visibilité des textes", icon: "eye" },
  { key: "largeText", label: "Texte agrandi", desc: "Augmente la taille de police de 125%", icon: "accessibility" },
  { key: "reducedMotion", label: "Réduire les animations", desc: "Limite les animations et transitions", icon: "settings" },
  { key: "darkMode", label: "Mode sombre", desc: "Interface avec fond sombre", icon: "moon" },
];

onMounted(() => {
  applySettings();
});
</script>

<template>
  <div class="a11y-panel">
    <!-- Bouton flottant -->
    <button
      v-if="!isOpen"
      class="a11y-toggle"
      :aria-label="`Ouvrir le panneau d'accessibilité${activeCount > 0 ? ` — ${activeCount} option${activeCount > 1 ? 's' : ''} active${activeCount > 1 ? 's' : ''}` : ''}`"
      @click="isOpen = true"
    >
      <KIcon
        name="accessibility"
        :size="18"
        aria-hidden="true"
      />
      <span class="a11y-toggle__text">Accessibilité</span>
      <span
        v-if="activeCount > 0"
        class="a11y-toggle__badge"
        aria-hidden="true"
      >{{ activeCount }}</span>
    </button>

    <!-- Drawer -->
    <transition name="slide-up">
      <dialog
        v-if="isOpen"
        class="a11y-drawer"
        open
        aria-label="Options d'accessibilité"
      >
        <div class="a11y-drawer__header">
          <div class="a11y-drawer__title-wrap">
            <KIcon
              name="accessibility"
              :size="18"
              color="var(--c-teal)"
              aria-hidden="true"
            />
            <h2 class="a11y-drawer__title">
              Accessibilité
            </h2>
          </div>
          <button
            class="a11y-close"
            aria-label="Fermer le panneau d'accessibilité"
            @click="isOpen = false"
          >
            <KIcon
              name="close"
              :size="16"
              aria-hidden="true"
            />
          </button>
        </div>

        <div class="a11y-drawer__content">
          <label
            v-for="opt in options"
            :key="opt.key"
            class="a11y-option"
            :class="{ 'a11y-option--active': settings[opt.key] }"
          >
            <div class="a11y-option__icon">
              <KIcon
                :name="opt.icon"
                :size="16"
                :color="settings[opt.key] ? 'white' : 'var(--c-teal)'"
                aria-hidden="true"
              />
            </div>
            <span class="a11y-option__label">
              <strong>{{ opt.label }}</strong>
              <span class="a11y-option__desc">{{ opt.desc }}</span>
            </span>
            <input
              type="checkbox"
              class="a11y-option__checkbox"
              :aria-label="`Activer ${opt.label}`"
              :checked="settings[opt.key]"
              @change="toggleSetting(opt.key)"
            >
          </label>
        </div>

        <div class="a11y-drawer__footer">
          <button
            class="a11y-reset"
            @click="resetSettings"
          >
            Réinitialiser
          </button>
          <p>Les paramètres sont sauvegardés automatiquement.</p>
        </div>
      </dialog>
    </transition>

    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="a11y-overlay"
        aria-hidden="true"
        @click="isOpen = false"
      />
    </transition>
  </div>
</template>

<style scoped>
.a11y-panel {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  font-family: var(--font-body), system-ui, sans-serif;
}

/* On mobile the bottom navigation occupies the bottom edge, so the launcher
   sits above it instead of overlapping the last nav item. */
@media (max-width: 1023px) {
  .a11y-panel {
    bottom: calc(5.5rem + env(safe-area-inset-bottom));
  }
}

/* ── Toggle button ── */
.a11y-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 44px;
  padding: 0 1.125rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--c-border);
  background: var(--c-surface);
  color: var(--c-text);
  font-family: var(--font-body), system-ui, sans-serif;
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 44px;
}

.a11y-toggle:hover {
  background: var(--c-teal-light);
  border-color: var(--c-teal);
  color: var(--c-teal-dark);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.a11y-toggle:focus-visible {
  outline: 3px solid var(--c-teal);
  outline-offset: 2px;
}

.a11y-toggle__text {
  display: none;
}

@media (min-width: 480px) {
  .a11y-toggle__text {
    display: inline;
  }
}

.a11y-toggle__badge {
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--c-teal);
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ── Overlay ── */
.a11y-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 9998;
}

/* ── Drawer ── */
.a11y-drawer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: min(100%, 380px);
  max-height: 88vh;
  background: var(--c-surface);
  border-radius: 1.5rem 1.5rem 0 0;
  border: 1px solid var(--c-border);
  border-bottom: none;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  padding: 0;
  margin: 0;
  overflow: visible;
}

.a11y-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid var(--c-border);
}

.a11y-drawer__title-wrap {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.a11y-drawer__title {
  font-family: var(--font-display), sans-serif;
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--c-navy);
  margin: 0;
  letter-spacing: -0.02em;
}

.a11y-close {
  width: 36px;
  height: 36px;
  border-radius: 0.75rem;
  border: 1.5px solid var(--c-border);
  background: var(--c-beige);
  color: var(--c-text-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: auto;
}

.a11y-close:hover {
  background: var(--c-teal-light);
  color: var(--c-teal-dark);
  border-color: var(--c-teal);
}

/* ── Options ── */
.a11y-drawer__content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.a11y-option {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--c-border);
  background: var(--c-beige);
  cursor: pointer;
  transition: all 0.18s ease;
}

.a11y-option:hover {
  border-color: var(--c-teal);
  background: var(--c-teal-light);
}

.a11y-option--active {
  background: var(--c-teal);
  border-color: var(--c-teal-dark);
}

.a11y-option__icon {
  width: 34px;
  height: 34px;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.a11y-option:not(.a11y-option--active) .a11y-option__icon {
  background: rgba(72, 175, 196, 0.1);
}

.a11y-option__label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.a11y-option__label strong {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--c-navy);
  line-height: 1.2;
}

.a11y-option--active .a11y-option__label strong {
  color: white;
}

.a11y-option__desc {
  font-size: 0.75rem;
  color: var(--c-text-medium);
  line-height: 1.4;
}

.a11y-option--active .a11y-option__desc {
  color: rgba(255, 255, 255, 0.8);
}

.a11y-option__checkbox {
  width: 18px;
  height: 18px;
  accent-color: white;
  cursor: pointer;
  flex-shrink: 0;
}

/* ── Footer ── */
.a11y-drawer__footer {
  padding: 1rem 1.25rem 1.5rem;
  border-top: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.a11y-reset {
  width: 100%;
  background: var(--c-beige);
  border: 1.5px solid var(--c-border);
  color: var(--c-text-medium);
  border-radius: var(--radius-full);
  padding: 0.625rem 1rem;
  font-family: var(--font-body), sans-serif;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 40px;
}

.a11y-reset:hover {
  background: var(--c-teal-light);
  border-color: var(--c-teal);
  color: var(--c-teal-dark);
}

.a11y-drawer__footer p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--c-text-light);
  line-height: 1.5;
  text-align: center;
}

/* ── Animations ── */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .a11y-panel {
    bottom: calc(5.5rem + env(safe-area-inset-bottom));
    right: 1rem;
  }

  .a11y-drawer {
    width: 100%;
  }
}
</style>
