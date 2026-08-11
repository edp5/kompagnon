<script setup>
import { ArrowRight, CircleAlert, Phone } from "lucide-vue-next";
import { computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { activateAccount } from "@/adapters/authentication.js";
import AuthLayout from "@/components/AuthLayout.vue";
import BaseCard from "@/components/BaseCard.vue";

// French phone number, lenient: optional +33/0033/0 prefix then 9 digits,
// separators (spaces, dots, dashes) tolerated. Mirrors the API validation.
const FRENCH_PHONE_PATTERN = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

const route = useRoute();
const token = route.query.token;

const phoneNumber = ref("");
const isSubmitting = ref(false);
const message = ref("");
const success = ref(false);
const submitted = ref(false);

const isPhoneValid = computed(() => FRENCH_PHONE_PATTERN.test(phoneNumber.value.trim()));

async function handleSubmit() {
  submitted.value = true;
  message.value = "";

  if (!isPhoneValid.value) {
    return;
  }

  isSubmitting.value = true;
  const result = await activateAccount({ token, phoneNumber: phoneNumber.value.trim() });
  message.value = result.message;
  success.value = result.success;
  isSubmitting.value = false;
}
</script>

<template>
  <AuthLayout
    title="Activation de compte"
    description="Finalisez votre inscription pour accéder à votre espace personnel Kompagnon."
    kicker="Activation"
  >
    <BaseCard class="activate-card">
      <div class="page-stack">
        <div
          v-if="!token"
          class="page-stack"
        >
          <p
            class="feedback error feedback--error"
            role="alert"
          >
            Token d'activation manquant.
          </p>
          <router-link
            to="/register"
            class="text-link activate-link"
          >
            Retour à l'inscription
          </router-link>
        </div>

        <div
          v-else-if="success"
          class="page-stack"
        >
          <p
            class="feedback success feedback--success"
            role="alert"
            aria-live="polite"
          >
            {{ message }}
          </p>
          <router-link
            to="/login"
            class="text-link activate-link"
          >
            Aller à la connexion
          </router-link>
        </div>

        <form
          v-else
          class="activate-form"
          @submit.prevent="handleSubmit"
        >
          <p class="activate-intro">
            Renseignez votre numéro de téléphone pour terminer l'activation de votre compte.
          </p>

          <label class="activate-field">
            <span class="activate-label">Numéro de téléphone</span>
            <div class="activate-control">
              <Phone class="activate-icon" />
              <input
                id="phoneNumber"
                v-model="phoneNumber"
                class="activate-input"
                type="tel"
                name="phoneNumber"
                autocomplete="tel"
                placeholder="06 12 34 56 78"
                required
              >
            </div>
          </label>

          <p
            v-if="submitted && !isPhoneValid"
            class="feedback error feedback--error activate-feedback"
            role="alert"
            aria-live="assertive"
          >
            <CircleAlert class="activate-feedback-icon" />
            <span>Veuillez saisir un numéro de téléphone français valide.</span>
          </p>

          <p
            v-else-if="message"
            class="feedback error feedback--error activate-feedback"
            role="alert"
            aria-live="assertive"
          >
            <CircleAlert class="activate-feedback-icon" />
            <span>{{ message }}</span>
          </p>

          <button
            type="submit"
            class="activate-submit"
            :disabled="isSubmitting"
          >
            <span>{{ isSubmitting ? "Activation en cours..." : "Activer mon compte" }}</span>
            <ArrowRight class="activate-submit-icon" />
          </button>
        </form>
      </div>
    </BaseCard>
  </AuthLayout>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.activate-card {
  animation: fadeInUp 0.6s ease-out;
}

.activate-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activate-intro {
  margin: 0;
  color: var(--c-text-medium);
  line-height: 1.6;
}

.activate-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.activate-label {
  color: var(--c-navy);
  font-size: 0.86rem;
  font-weight: 700;
}

.activate-control {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.75rem;
  min-height: 3.7rem;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(30, 44, 56, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 12px 30px rgba(30, 44, 56, 0.06);
}

.activate-control:focus-within {
  border-color: rgba(72, 175, 196, 0.4);
  box-shadow: 0 0 0 4px rgba(72, 175, 196, 0.12);
}

.activate-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--c-text-light);
}

.activate-input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--c-navy);
  font-size: 0.97rem;
  line-height: 1.4;
}

.activate-input:focus {
  outline: none;
}

.activate-input::placeholder {
  color: var(--c-text-light);
}

.activate-feedback {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.activate-feedback-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.activate-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
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

.activate-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 22px 40px rgba(72, 175, 196, 0.26);
}

.activate-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.activate-submit-icon {
  width: 1rem;
  height: 1rem;
}

.activate-link {
  animation: fadeInUp 0.6s ease-out 0.3s backwards;
}
</style>
