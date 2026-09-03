<script setup>
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { submitPasswordReset } from "@/adapters/authentication.js";
import AuthLayout from "@/components/AuthLayout.vue";
import BaseCard from "@/components/BaseCard.vue";

const route = useRoute();
const token = computed(() => (typeof route.query.token === "string" ? route.query.token : ""));

const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const isSuccess = ref(false);
const submitted = ref(false);

const isPasswordLongEnough = computed(() => password.value.length >= 8);
const doPasswordsMatch = computed(() => password.value === confirmPassword.value);
const canSubmit = computed(() =>
  Boolean(token.value) &&
  isPasswordLongEnough.value &&
  doPasswordsMatch.value,
);

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function toggleConfirmPasswordVisibility() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

async function handleSubmit() {
  submitted.value = true;
  errorMessage.value = "";

  if (!isPasswordLongEnough.value) {
    errorMessage.value = "Le mot de passe doit contenir au moins 8 caractères.";
    return;
  }

  if (!doPasswordsMatch.value) {
    errorMessage.value = "Les deux mots de passe ne correspondent pas.";
    return;
  }

  isSubmitting.value = true;
  const result = await submitPasswordReset({
    token: token.value,
    password: password.value,
  });
  isSubmitting.value = false;

  if (result.success) {
    isSuccess.value = true;
    successMessage.value = result.message;
  } else {
    errorMessage.value = result.message || "Échec de la réinitialisation du mot de passe.";
  }
}
</script>

<template>
  <AuthLayout
    title="Nouveau mot de passe"
    kicker="Sécurité du compte"
    description="Choisissez un nouveau mot de passe sécurisé pour votre compte Kompagnon."
    hero-title="Définissez un nouveau mot de passe en quelques secondes."
    hero-description="Assurez-vous de choisir un mot de passe robuste d'au moins 8 caractères pour protéger votre compte."
  >
    <div class="reset-view">
      <div
        v-if="!token"
        class="reset-view__missing-token"
      >
        <BaseCard class="reset-view__card">
          <div class="reset-view__missing-content">
            <CircleAlert class="reset-view__missing-icon" />
            <h2 class="reset-view__missing-title">
              Lien de réinitialisation invalide
            </h2>
            <p class="reset-view__missing-text">
              Aucun jeton de réinitialisation n'a été détecté dans l'URL. Veuillez demander un nouveau lien de réinitialisation.
            </p>
            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="reset-view__action-button"
            >
              Demander un nouveau lien
            </RouterLink>
          </div>
        </BaseCard>
      </div>

      <div
        v-else-if="isSuccess"
        class="reset-view__success"
      >
        <BaseCard class="reset-view__card">
          <div class="reset-view__success-content">
            <div class="reset-view__success-icon-wrap">
              <CircleCheck class="reset-view__success-icon" />
            </div>
            <h2 class="reset-view__success-title">
              Mot de passe mis à jour !
            </h2>
            <p class="reset-view__success-text">
              {{ successMessage }}
            </p>
            <RouterLink
              :to="{ name: 'login' }"
              class="reset-view__action-button"
            >
              <span>Se connecter</span>
              <ArrowRight class="reset-view__action-icon" />
            </RouterLink>
          </div>
        </BaseCard>
      </div>

      <div
        v-else
        class="reset-view__content"
      >
        <div class="reset-view__meta">
          <span class="reset-view__chip">
            <ShieldCheck class="reset-view__chip-icon" />
            Sécurisation du compte
          </span>
          <p class="reset-view__intro">
            Saisissez votre nouveau mot de passe et confirmez-le pour sécuriser à nouveau l'accès à votre compte.
          </p>
        </div>

        <form
          class="reset-view__form"
          @submit.prevent="handleSubmit"
        >
          <label class="reset-view__field">
            <span class="reset-view__label">Nouveau mot de passe</span>
            <div class="reset-view__control reset-view__control--password">
              <Lock class="reset-view__icon" />
              <input
                id="password"
                v-model="password"
                class="reset-view__input"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="new-password"
                placeholder="Au moins 8 caractères"
                required
              >
              <button
                type="button"
                class="reset-view__toggle"
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                :aria-pressed="showPassword.toString()"
                @click="togglePasswordVisibility"
              >
                <EyeOff
                  v-if="showPassword"
                  class="reset-view__toggle-icon"
                />
                <Eye
                  v-else
                  class="reset-view__toggle-icon"
                />
              </button>
            </div>
          </label>

          <label class="reset-view__field">
            <span class="reset-view__label">Confirmer le nouveau mot de passe</span>
            <div class="reset-view__control reset-view__control--password">
              <Lock class="reset-view__icon" />
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                class="reset-view__input"
                :type="showConfirmPassword ? 'text' : 'password'"
                name="confirmPassword"
                autocomplete="new-password"
                placeholder="Répétez votre mot de passe"
                required
              >
              <button
                type="button"
                class="reset-view__toggle"
                :aria-label="showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                :aria-pressed="showConfirmPassword.toString()"
                @click="toggleConfirmPasswordVisibility"
              >
                <EyeOff
                  v-if="showConfirmPassword"
                  class="reset-view__toggle-icon"
                />
                <Eye
                  v-else
                  class="reset-view__toggle-icon"
                />
              </button>
            </div>
          </label>

          <p
            v-if="errorMessage"
            class="feedback error feedback--error reset-view__feedback"
            role="alert"
            aria-live="assertive"
          >
            <CircleAlert class="reset-view__feedback-icon" />
            <span>{{ errorMessage }}</span>
          </p>

          <button
            type="submit"
            class="reset-view__submit"
            :disabled="isSubmitting || !canSubmit"
          >
            <span>{{ isSubmitting ? "Mise à jour en cours..." : "Changer le mot de passe" }}</span>
            <ArrowRight class="reset-view__submit-icon" />
          </button>
        </form>

        <div class="reset-view__footer">
          <RouterLink
            :to="{ name: 'login' }"
            class="reset-view__login-link"
          >
            <ArrowLeft class="reset-view__link-icon" />
            <span>Retour à la page de connexion</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<style scoped>
.reset-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reset-view__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reset-view__meta {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.reset-view__chip {
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

.reset-view__chip-icon {
  width: 0.95rem;
  height: 0.95rem;
}

.reset-view__intro {
  margin: 0;
  color: var(--c-text-medium);
  line-height: 1.65;
}

.reset-view__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reset-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.reset-view__label {
  color: var(--c-navy);
  font-size: 0.86rem;
  font-weight: 700;
}

.reset-view__control {
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

.reset-view__control:focus-within {
  border-color: rgba(72, 175, 196, 0.4);
  box-shadow: 0 0 0 4px rgba(72, 175, 196, 0.12);
}

.reset-view__control--password {
  grid-template-columns: auto 1fr auto;
}

.reset-view__icon,
.reset-view__toggle-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.reset-view__icon {
  color: var(--c-text-light);
}

.reset-view__input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--c-navy);
  font-size: 0.97rem;
  line-height: 1.4;
}

.reset-view__input:focus {
  outline: none;
}

.reset-view__input::placeholder {
  color: var(--c-text-light);
}

.reset-view__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border: none;
  border-radius: 50%;
  background: rgba(30, 44, 56, 0.06);
  color: var(--c-navy);
  cursor: pointer;
}

.reset-view__toggle:hover {
  background: rgba(72, 175, 196, 0.12);
  color: var(--c-teal-dark);
}

.reset-view__feedback {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.reset-view__feedback-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.reset-view__submit {
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

.reset-view__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 22px 40px rgba(30, 44, 56, 0.24);
}

.reset-view__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.reset-view__submit-icon {
  width: 1rem;
  height: 1rem;
}

.reset-view__card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.25rem;
  border: 1px solid rgba(72, 175, 196, 0.2);
}

.reset-view__missing-content,
.reset-view__success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
}

.reset-view__missing-icon {
  width: 2.2rem;
  height: 2.2rem;
  color: var(--c-navy);
}

.reset-view__missing-title,
.reset-view__success-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--c-navy);
}

.reset-view__missing-text,
.reset-view__success-text {
  margin: 0;
  color: var(--c-text-medium);
  font-size: 0.95rem;
  line-height: 1.5;
}

.reset-view__success-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: rgba(72, 175, 196, 0.12);
  color: var(--c-teal-dark);
}

.reset-view__success-icon {
  width: 1.8rem;
  height: 1.8rem;
}

.reset-view__action-button {
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

.reset-view__action-button:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.reset-view__action-icon {
  width: 1rem;
  height: 1rem;
}

.reset-view__footer {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.reset-view__login-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--c-teal-dark);
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
}

.reset-view__login-link:hover {
  text-decoration: underline;
}

.reset-view__link-icon {
  width: 0.95rem;
  height: 0.95rem;
}
</style>
