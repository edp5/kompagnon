<script setup>
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Mail,
  ShieldCheck,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";

import { requestPasswordReset } from "@/adapters/authentication.js";
import AuthLayout from "@/components/AuthLayout.vue";
import BaseCard from "@/components/BaseCard.vue";

const email = ref("");
const isSubmitting = ref(false);
const message = ref("");
const errorMessage = ref("");
const isSuccess = ref(false);

const isEmailValid = computed(() => {
  const trimmed = email.value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
});

async function handleSubmit() {
  errorMessage.value = "";
  message.value = "";

  if (!isEmailValid.value) {
    errorMessage.value = "Veuillez renseigner une adresse e-mail valide.";
    return;
  }

  isSubmitting.value = true;
  const result = await requestPasswordReset({ email: email.value.trim() });
  isSubmitting.value = false;

  if (result.success) {
    isSuccess.value = true;
    message.value = result.message;
  } else {
    errorMessage.value = result.message || "Une erreur est survenue. Veuillez réessayer.";
  }
}
</script>

<template>
  <AuthLayout
    title="Mot de passe oublié"
    kicker="Récupération de compte"
    description="Recevez un lien sécurisé par e-mail pour réinitialiser le mot de passe de votre espace Kompagnon."
    hero-title="Retrouvez l'accès à votre espace en toute sécurité."
    hero-description="Un lien de réinitialisation vous sera envoyé par e-mail afin de choisir un nouveau mot de passe."
  >
    <div class="forgot-view">
      <div class="forgot-view__meta">
        <span class="forgot-view__chip">
          <ShieldCheck class="forgot-view__chip-icon" />
          Récupération sécurisée
        </span>
        <p class="forgot-view__intro">
          Saisissez l'adresse e-mail associée à votre compte Kompagnon. Nous vous transmettrons un lien de réinitialisation valable pendant 1 heure.
        </p>
      </div>

      <BaseCard
        v-if="isSuccess"
        class="forgot-view__success-card"
      >
        <div class="forgot-view__success-content">
          <div class="forgot-view__success-icon-wrap">
            <CircleCheck class="forgot-view__success-icon" />
          </div>
          <h2 class="forgot-view__success-title">
            E-mail envoyé !
          </h2>
          <p class="forgot-view__success-text">
            {{ message }}
          </p>
          <p class="forgot-view__success-hint">
            Pensez à vérifier vos courriers indésirables (spams) si vous ne recevez rien dans les prochaines minutes.
          </p>
          <RouterLink
            :to="{ name: 'login' }"
            class="forgot-view__back-button"
          >
            <ArrowLeft class="forgot-view__back-icon" />
            <span>Retour à la connexion</span>
          </RouterLink>
        </div>
      </BaseCard>

      <form
        v-else
        class="forgot-view__form"
        @submit.prevent="handleSubmit"
      >
        <label class="forgot-view__field">
          <span class="forgot-view__label">Adresse e-mail</span>
          <div class="forgot-view__control">
            <Mail class="forgot-view__icon" />
            <input
              id="email"
              v-model="email"
              class="forgot-view__input"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="vous@exemple.fr"
              required
            >
          </div>
        </label>

        <p
          v-if="errorMessage"
          class="feedback error feedback--error forgot-view__feedback"
          role="alert"
          aria-live="assertive"
        >
          <CircleAlert class="forgot-view__feedback-icon" />
          <span>{{ errorMessage }}</span>
        </p>

        <button
          type="submit"
          class="forgot-view__submit"
          :disabled="isSubmitting || !email.trim()"
        >
          <span>{{ isSubmitting ? "Envoi en cours..." : "Envoyer le lien de réinitialisation" }}</span>
          <ArrowRight class="forgot-view__submit-icon" />
        </button>
      </form>

      <div class="forgot-view__footer">
        <RouterLink
          :to="{ name: 'login' }"
          class="forgot-view__login-link"
        >
          <ArrowLeft class="forgot-view__link-icon" />
          <span>Retour à la page de connexion</span>
        </RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>

<style scoped>
.forgot-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.forgot-view__meta {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.forgot-view__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.1);
  border: 1px solid rgba(72, 175, 196, 0.18);
  color: var(--c-teal-dark);
  font-size: 0.78rem;
  font-weight: 700;
}

.forgot-view__chip-icon {
  width: 0.95rem;
  height: 0.95rem;
}

.forgot-view__intro {
  margin: 0;
  color: var(--c-text-medium);
  line-height: 1.65;
}

.forgot-view__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.forgot-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.forgot-view__label {
  color: var(--c-navy);
  font-size: 0.86rem;
  font-weight: 700;
}

.forgot-view__control {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.75rem;
  min-height: 3.7rem;
  padding: 0.35rem 0.4rem 0.35rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(30, 44, 56, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 12px 30px rgba(30, 44, 56, 0.06);
}

.forgot-view__control:focus-within {
  border-color: rgba(72, 175, 196, 0.4);
  box-shadow: 0 0 0 4px rgba(72, 175, 196, 0.12);
}

.forgot-view__icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--c-text-light);
}

.forgot-view__input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--c-navy);
  font-size: 0.97rem;
  line-height: 1.4;
}

.forgot-view__input:focus {
  outline: none;
}

.forgot-view__input::placeholder {
  color: var(--c-text-light);
}

.forgot-view__feedback {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.forgot-view__feedback-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.forgot-view__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  width: 100%;
  min-height: 3.5rem;
  padding: 0.95rem 1.2rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--brand-navy) 0%, #263c4d 100%);
  color: #ffffff;
  box-shadow: 0 18px 34px rgba(30, 44, 56, 0.22);
  font-size: 0.96rem;
  font-weight: 700;
  cursor: pointer;
}

.forgot-view__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 22px 40px rgba(30, 44, 56, 0.24);
}

.forgot-view__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.forgot-view__submit-icon {
  width: 1rem;
  height: 1rem;
}

.forgot-view__success-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.25rem;
  border: 1px solid rgba(72, 175, 196, 0.2);
}

.forgot-view__success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
}

.forgot-view__success-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: rgba(72, 175, 196, 0.12);
  color: var(--c-teal-dark);
}

.forgot-view__success-icon {
  width: 1.8rem;
  height: 1.8rem;
}

.forgot-view__success-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--c-navy);
}

.forgot-view__success-text {
  margin: 0;
  color: var(--c-text-medium);
  font-size: 0.95rem;
  line-height: 1.5;
}

.forgot-view__success-hint {
  margin: 0;
  color: var(--c-text-light);
  font-size: 0.83rem;
  line-height: 1.5;
}

.forgot-view__back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.8rem 1.4rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--c-teal) 0%, #3093a8 100%);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
}

.forgot-view__back-button:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.forgot-view__back-icon {
  width: 1rem;
  height: 1rem;
}

.forgot-view__footer {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.forgot-view__login-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--c-teal-dark);
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
}

.forgot-view__login-link:hover {
  text-decoration: underline;
}

.forgot-view__link-icon {
  width: 0.95rem;
  height: 0.95rem;
}
</style>
