<script setup>
import { computed, reactive, ref } from "vue";

import { recordJourney } from "@/adapters/journeys.js";
import AddressAutocomplete from "@/components/AddressAutocomplete.vue";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();

function initialFormState() {
  return {
    departure: null,
    arrival: null,
    departureTime: "",
    arrivalTime: "",
  };
}

const form = reactive(initialFormState());

const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const canSubmit = computed(() => {
  return Boolean(
    form.departure
    && form.arrival
    && form.departureTime
    && form.arrivalTime,
  );
});

function resetFeedback() {
  successMessage.value = "";
  errorMessage.value = "";
}

function resetForm() {
  Object.assign(form, initialFormState());
}

async function handleSubmit() {
  resetFeedback();

  if (!canSubmit.value) {
    errorMessage.value = "Veuillez renseigner le départ, l'arrivée et les horaires.";
    return;
  }

  if (new Date(form.arrivalTime) <= new Date(form.departureTime)) {
    errorMessage.value = "L'heure d'arrivée doit être postérieure à l'heure de départ.";
    return;
  }

  isSubmitting.value = true;

  const result = await recordJourney({
    token: authStore.token,
    departureAddress: form.departure.label,
    arrivalAddress: form.arrival.label,
    departureLat: form.departure.lat,
    departureLon: form.departure.lon,
    arrivalLat: form.arrival.lat,
    arrivalLon: form.arrival.lon,
    departureTime: new Date(form.departureTime).toISOString(),
    arrivalTime: new Date(form.arrivalTime).toISOString(),
  });

  isSubmitting.value = false;

  if (result.success) {
    successMessage.value = "Vos informations de trajet ont bien été enregistrées.";
    resetForm();
  } else {
    errorMessage.value = result.message ?? "Une erreur est survenue. Veuillez réessayer.";
  }
}
</script>

<template>
  <div class="record-journey app-page">
    <div class="record-journey__content app-page__content app-page__content--stack">
      <header class="record-journey__header app-page__header-main">
        <span class="record-journey__eyebrow app-page__eyebrow">Mes trajets</span>
        <h1 class="record-journey__title app-page__title">
          Où allez-vous&nbsp;?
        </h1>
        <p class="record-journey__subtitle app-page__subtitle">
          Enregistrez vos informations de trajet pour trouver un accompagnement adapté.
        </p>
      </header>

      <form
        class="record-journey__form"
        @submit.prevent="handleSubmit"
      >
        <AddressAutocomplete
          id="departure"
          v-model="form.departure"
          label="Adresse de départ"
          placeholder="D'où partez-vous ?"
          required
        />

        <AddressAutocomplete
          id="arrival"
          v-model="form.arrival"
          label="Adresse d'arrivée"
          placeholder="Où allez-vous ?"
          required
        />

        <div class="record-journey__grid">
          <div class="record-journey__field">
            <label
              class="base-label"
              for="departureTime"
            >
              Date et heure de départ
            </label>
            <input
              id="departureTime"
              v-model="form.departureTime"
              class="record-journey__input"
              type="datetime-local"
              name="departureTime"
              required
            >
          </div>

          <div class="record-journey__field">
            <label
              class="base-label"
              for="arrivalTime"
            >
              Date et heure d'arrivée souhaitée
            </label>
            <input
              id="arrivalTime"
              v-model="form.arrivalTime"
              class="record-journey__input"
              type="datetime-local"
              name="arrivalTime"
              required
            >
          </div>
        </div>

        <p
          v-if="errorMessage"
          class="feedback error feedback--error record-journey__feedback"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </p>

        <p
          v-if="successMessage"
          class="feedback success feedback--success record-journey__feedback"
          role="alert"
          aria-live="assertive"
        >
          {{ successMessage }}
        </p>

        <button
          type="submit"
          class="record-journey__submit"
          :disabled="isSubmitting || !canSubmit"
        >
          {{ isSubmitting ? "Enregistrement…" : "Enregistrer mon trajet" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.record-journey {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: transparent;
}

.record-journey__content {
  padding: 1.5rem;
  width: min(100%, 720px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.record-journey__header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.record-journey__eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.12);
  border: 1px solid rgba(72, 175, 196, 0.2);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-teal-dark);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.record-journey__title {
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  font-weight: 700;
  color: var(--c-navy);
  margin: 0;
  letter-spacing: -0.03em;
}

.record-journey__subtitle {
  font-size: 0.95rem;
  color: var(--c-text-medium);
  margin: 0;
  line-height: 1.6;
}

.record-journey__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.record-journey__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.record-journey__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.record-journey__input {
  min-height: 3.2rem;
  padding: 0.35rem 1rem;
  border-radius: 0.875rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  color: var(--c-navy);
  font-size: 0.95rem;
}

.record-journey__input:focus {
  outline: none;
  border-color: rgba(72, 175, 196, 0.4);
  box-shadow: 0 0 0 3px rgba(72, 175, 196, 0.12);
}

.record-journey__feedback {
  margin: 0;
}

.record-journey__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3.5rem;
  padding: 0.95rem 1.2rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--c-teal) 0%, #3093a8 100%);
  color: #ffffff;
  box-shadow: 0 18px 34px rgba(72, 175, 196, 0.24);
  font-size: 0.96rem;
  font-weight: 700;
  cursor: pointer;
}

.record-journey__submit:hover:not(:disabled) {
  transform: translateY(-1px);
}

.record-journey__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .record-journey__grid {
    grid-template-columns: 1fr;
  }
}
</style>
