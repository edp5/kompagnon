<script setup>
import { onBeforeMount, ref } from "vue";
import { RouterView } from "vue-router";

import { apiCheck } from "@/adapters/api-check.js";
import AccessibilityPanel from "@/components/AccessibilityPanel.vue";
import AppLoader from "@/components/AppLoader.vue";
import AppShell from "@/components/AppShell.vue";

const apiState = ref("loading");

function retryLoading() {
  window.location.reload();
}

onBeforeMount(async () => {
  // Affiche le loader pendant au minimum 6 secondes
  const startTime = Date.now();
  const minLoadingDuration = 6000; // 6 secondes

  const apiReady = await apiCheck() ? "ready" : "unavailable";

  // Calcule le temps restant à afficher le loader
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, minLoadingDuration - elapsedTime);

  // Attend le temps restant avant de passer à l'état suivant
  await new Promise(resolve => setTimeout(resolve, remainingTime));

  apiState.value = apiReady;
});
</script>

<template>
  <AppLoader
    v-if="apiState === 'loading'"
    title="Chargement de Kompagnon"
    message="Connexion sécurisée à votre espace et vérification du service en cours..."
  />

  <AppShell v-else-if="apiState === 'ready'">
    <RouterView />
    <AccessibilityPanel />
  </AppShell>

  <section
    v-else
    class="app-unavailable"
    aria-live="polite"
  >
    <div class="app-unavailable__card">
      <img
        src="/kompagnon-logo.png"
        alt="Kompagnon"
        class="app-unavailable__logo"
      >
      <p class="app-unavailable__eyebrow">
        Service temporairement indisponible
      </p>
      <h1 class="app-unavailable__title">
        Impossible de joindre Kompagnon pour le moment
      </h1>
      <p class="app-unavailable__message">
        Vérifiez votre connexion puis rechargez la page. Nous revenons dès que possible.
      </p>
      <button
        type="button"
        class="app-unavailable__button"
        @click="retryLoading"
      >
        Réessayer
      </button>
    </div>
  </section>
</template>

<style scoped>
.app-unavailable {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(158, 212, 217, 0.32), transparent 30%),
    linear-gradient(160deg, var(--c-cream) 0%, #faf6f1 60%, rgba(72, 175, 196, 0.12) 100%);
}

.app-unavailable__card {
  width: min(100%, 32rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  border-radius: 1.75rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(30, 44, 56, 0.08);
  box-shadow: 0 20px 48px rgba(30, 44, 56, 0.12);
}

.app-unavailable__logo {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
}

.app-unavailable__eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-danger);
}

.app-unavailable__title {
  margin: 0;
  color: var(--c-navy);
  font-family: var(--font-display), sans-serif;
  font-size: clamp(1.4rem, 4vw, 2rem);
  line-height: 1.1;
}

.app-unavailable__message {
  margin: 0;
  color: var(--c-text-medium);
}

.app-unavailable__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.8rem 1.4rem;
  border: none;
  border-radius: 999px;
  background: var(--c-navy);
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.app-unavailable__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(30, 44, 56, 0.18);
}
</style>
