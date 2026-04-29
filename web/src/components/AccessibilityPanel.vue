<script setup>
import { X } from "lucide-vue-next";
import { computed, ref } from "vue";

const isOpen = ref(false);

const settings = ref({
  highContrast: localStorage.getItem("a11y-contrast") === "true",
  largeText: localStorage.getItem("a11y-largeText") === "true",
  reducedMotion: localStorage.getItem("a11y-reducedMotion") === "true",
  darkMode: localStorage.getItem("a11y-darkMode") === "true",
  screenReaderMode: localStorage.getItem("a11y-screenReader") === "true",
});

function toggleSetting(key) {
  settings.value[key] = !settings.value[key];
  localStorage.setItem(`a11y-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, settings.value[key]);
  applySettings();
}

function applySettings() {
  const root = document.documentElement;
  root.classList.toggle("a11y-contrast", settings.value.highContrast);
  root.classList.toggle("a11y-large-text", settings.value.largeText);
  root.classList.toggle("a11y-reduced-motion", settings.value.reducedMotion);
  root.classList.toggle("a11y-dark-mode", settings.value.darkMode);
  root.classList.toggle("a11y-screen-reader", settings.value.screenReaderMode);
}

function resetSettings() {
  settings.value = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    darkMode: false,
    screenReaderMode: false,
  };
  localStorage.removeItem("a11y-contrast");
  localStorage.removeItem("a11y-largeText");
  localStorage.removeItem("a11y-reducedMotion");
  localStorage.removeItem("a11y-darkMode");
  localStorage.removeItem("a11y-screenReader");
  applySettings();
}

const a11yLabel = computed(() => {
  const active = Object.values(settings.value).filter(Boolean).length;
  return active > 0 ? `${active} option${active > 1 ? "s" : ""} activée${active > 1 ? "s" : ""}` : "Accessibilité";
});

// Initialize on mount
applySettings();
</script>

<template>
  <div class="a11y-panel">
    <!-- Toggle Button -->
    <button
      v-if="!isOpen"
      class="a11y-toggle"
      :aria-label="`Ouvrir le panneau d'accessibilité - ${a11yLabel}`"
      :title="`Accessibilité options - ${a11yLabel}`"
      @click="isOpen = true"
    >
      <span class="a11y-toggle__icon">♿</span>
      <span class="a11y-toggle__text">Accessibilité</span>
    </button>

    <!-- Panel -->
    <transition name="slide-in">
      <div
        v-if="isOpen"
        class="a11y-drawer"
      >
        <div class="a11y-drawer__header">
          <button
            class="a11y-close"
            aria-label="Fermer le panneau d'accessibilité"
            @click="isOpen = false"
          >
            <X
              :size="20"
              :stroke-width="2"
            />
          </button>
          <h2 class="a11y-drawer__title">
            Options d'accessibilité
          </h2>
        </div>

        <div class="a11y-drawer__content">
          <div class="a11y-group">
            <label class="a11y-option">
              <input
                aria-label="Activer le mode contraste élevé"
                type="checkbox"
                :checked="settings.highContrast"
                @change="toggleSetting('highContrast')"
              >
              <span class="a11y-option__label">
                <strong>Contraste élevé</strong>
                <span class="a11y-option__desc">Améliore la visibilité des textes et des éléments</span>
              </span>
            </label>

            <label class="a11y-option">
              <input
                aria-label="Activer la taille de texte augmentée"
                type="checkbox"
                :checked="settings.largeText"
                @change="toggleSetting('largeText')"
              >
              <span class="a11y-option__label">
                <strong>Texte agrandi</strong>
                <span class="a11y-option__desc">Augmente la taille de police de 125%</span>
              </span>
            </label>

            <label class="a11y-option">
              <input
                aria-label="Activer la réduction des mouvements"
                type="checkbox"
                :checked="settings.reducedMotion"
                @change="toggleSetting('reducedMotion')"
              >
              <span class="a11y-option__label">
                <strong>Réduire les animations</strong>
                <span class="a11y-option__desc">Limite les animations et transitions</span>
              </span>
            </label>

            <label class="a11y-option">
              <input
                aria-label="Activer le mode sombre"
                type="checkbox"
                :checked="settings.darkMode"
                @change="toggleSetting('darkMode')"
              >
              <span class="a11y-option__label">
                <strong>Mode sombre</strong>
                <span class="a11y-option__desc">Interface avec couleurs sombres</span>
              </span>
            </label>

            <label class="a11y-option">
              <input
                aria-label="Activer le mode lecteur d'écran"
                type="checkbox"
                :checked="settings.screenReaderMode"
                @change="toggleSetting('screenReaderMode')"
              >
              <span class="a11y-option__label">
                <strong>Mode lecteur d'écran</strong>
                <span class="a11y-option__desc">Optimise pour les lecteurs d'écran (VoiceOver, NVDA)</span>
              </span>
            </label>
          </div>

          <button
            class="a11y-reset"
            @click="resetSettings"
          >
            Réinitialiser les options
          </button>
        </div>

        <div class="a11y-drawer__footer">
          <p>Les paramètres d'accessibilité sont enregistrés automatiquement sur votre appareil.</p>
        </div>
      </div>
    </transition>

    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="a11y-overlay"
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.a11y-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 44px;
  padding: 0 1.125rem;
  border-radius: 0.875rem;
  border: 1.5px solid rgba(72, 175, 196, 0.4);
  background: white;
  color: #1e2c38;
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  letter-spacing: 0.01em;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 0 0 0 rgba(72, 175, 196, 0);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}

.a11y-toggle:hover {
  background: #f0f9ff;
  border-color: #48AFC4;
  box-shadow:
    0 4px 16px rgba(72, 175, 196, 0.2),
    0 0 0 3px rgba(72, 175, 196, 0.08);
  transform: translateY(-1px);
}

.a11y-toggle:active {
  transform: translateY(1px) scale(0.97);
}

.a11y-toggle__icon {
  font-size: 1rem;
  line-height: 1;
}

.a11y-toggle__text {
  display: none;
}

@media (min-width: 480px) {
  .a11y-toggle__text {
    display: inline;
  }
}

.a11y-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fade 0.2s ease;
}

.a11y-drawer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: min(100%, 360px);
  max-height: 90vh;
  background: white;
  border-radius: 1.5rem 1.5rem 0 0;
  border: 1px solid #e5e7eb;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  animation: slide-in 0.3s ease;
  z-index: 10000;
}

.a11y-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  gap: 1rem;
}

.a11y-drawer__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1E2C38;
  margin: 0;
}

.a11y-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.a11y-close:hover {
  background: #f3f4f6;
  color: #1E2C38;
}

.a11y-drawer__content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.a11y-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.a11y-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 0.875rem;
  transition: background 0.2s ease;
}

.a11y-option:hover {
  background: #f9fafb;
}

.a11y-option input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #48AFC4;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
}

.a11y-option__label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.a11y-option__label strong {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1E2C38;
}

.a11y-option__desc {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.4;
}

.a11y-reset {
  background: white;
  border: 1.5px solid #e5e7eb;
  color: #1E2C38;
  border-radius: 0.875rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.a11y-reset:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.a11y-drawer__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  background: #f9fafb;
  border-radius: 0 0 0 0;
}

.a11y-drawer__footer p {
  margin: 0;
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.5;
}

@keyframes slide-in {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Transition classes for Vue (slide + fade) */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
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
    bottom: 1rem;
    right: 1rem;
  }

  .a11y-drawer {
    width: 100%;
    border-radius: 1.5rem 1.5rem 0 0;
  }
}
</style>


