<script setup>
import {
  ArrowRight,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-vue-next";
import { computed, reactive, ref } from "vue";
import { RouterLink } from "vue-router";

import { registerNewUser } from "@/adapters/authentication.js";
import AuthLayout from "@/components/AuthLayout.vue";

function initialFormState() {
  return {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    birthday: "",
  };
}

const form = reactive(initialFormState());
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const canSubmit = computed(() => {
  return Boolean(
    form.firstname.trim()
    && form.lastname.trim()
    && form.email.trim()
    && form.password
    && form.passwordConfirmation
    && form.birthday,
  );
});

function resetFeedback() {
  successMessage.value = "";
  errorMessage.value = "";
}

function resetForm() {
  Object.assign(form, initialFormState());
  showPassword.value = false;
  showPasswordConfirmation.value = false;
}

async function handleSubmit() {
  resetFeedback();

  if (form.password !== form.passwordConfirmation) {
    errorMessage.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  isSubmitting.value = true;

  // eslint-disable-next-line no-unused-vars
  const { passwordConfirmation, ...registrationData } = form;
  const result = await registerNewUser(registrationData);

  if (result.success) {
    successMessage.value = "Un e‑mail a été envoyé pour activer votre compte.";
    resetForm();
  } else {
    errorMessage.value =
      result.message ?? "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
  }

  isSubmitting.value = false;
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function togglePasswordConfirmationVisibility() {
  showPasswordConfirmation.value = !showPasswordConfirmation.value;
}
</script>

<template>
  <AuthLayout
    title="Créer un compte"
    kicker="Inscription"
    description="Rejoignez Kompagnon avec un parcours plus lisible, plus rassurant et toujours centré sur l’accessibilité."
    hero-title="Créez votre compte Kompagnon dans une interface plus humaine et plus claire."
    hero-description="Le style s’inspire du design partagé, mais reste fidèle à notre identité : plus chaleureux, plus apaisant et plus inclusif."
  >
    <div class="register-view">
      <div class="register-view__meta">
        <span class="register-view__chip">
          <ShieldCheck class="register-view__chip-icon" />
          Inscription simple et sécurisée
        </span>
        <p class="register-view__intro">
          Quelques informations suffisent pour lancer votre compte. Une fois inscrit, vous recevrez un e-mail pour activer votre accès.
        </p>
      </div>

      <form
        v-if="!successMessage"
        class="register-view__form"
        @submit.prevent="handleSubmit"
      >
        <div class="register-view__grid register-view__grid--two-columns">
          <label class="register-view__field">
            <span class="register-view__label">Prénom</span>
            <div class="register-view__control">
              <User class="register-view__icon" />
              <input
                id="firstname"
                v-model="form.firstname"
                class="register-view__input"
                type="text"
                name="firstname"
                autocomplete="given-name"
                placeholder="Théo"
                required
              >
            </div>
          </label>

          <label class="register-view__field">
            <span class="register-view__label">Nom de famille</span>
            <div class="register-view__control">
              <User class="register-view__icon" />
              <input
                id="lastname"
                v-model="form.lastname"
                class="register-view__input"
                type="text"
                name="lastname"
                autocomplete="family-name"
                placeholder="Dupont"
                required
              >
            </div>
          </label>
        </div>

        <label class="register-view__field">
          <span class="register-view__label">Adresse e-mail</span>
          <div class="register-view__control">
            <Mail class="register-view__icon" />
            <input
              id="email"
              v-model="form.email"
              class="register-view__input"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="theo.dupont@example.fr"
              required
            >
          </div>
        </label>

        <label class="register-view__field">
          <span class="register-view__label">Mot de passe</span>
          <div class="register-view__control register-view__control--password">
            <Lock class="register-view__icon" />
            <input
              id="password"
              v-model="form.password"
              class="register-view__input"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              autocomplete="new-password"
              placeholder="Minimum 6 caractères"
              required
            >
            <button
              type="button"
              class="register-view__toggle"
              :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              :aria-pressed="showPassword.toString()"
              @click="togglePasswordVisibility"
            >
              <EyeOff
                v-if="showPassword"
                class="register-view__toggle-icon"
              />
              <Eye
                v-else
                class="register-view__toggle-icon"
              />
            </button>
          </div>
        </label>

        <label class="register-view__field">
          <span class="register-view__label">Confirmer le mot de passe</span>
          <div class="register-view__control register-view__control--password">
            <Lock class="register-view__icon" />
            <input
              id="passwordConfirmation"
              v-model="form.passwordConfirmation"
              class="register-view__input"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              name="passwordConfirmation"
              autocomplete="new-password"
              placeholder="Confirmez votre mot de passe"
              required
            >
            <button
              type="button"
              class="register-view__toggle"
              :aria-label="showPasswordConfirmation ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'"
              :aria-pressed="showPasswordConfirmation.toString()"
              @click="togglePasswordConfirmationVisibility"
            >
              <EyeOff
                v-if="showPasswordConfirmation"
                class="register-view__toggle-icon"
              />
              <Eye
                v-else
                class="register-view__toggle-icon"
              />
            </button>
          </div>
        </label>

        <label class="register-view__field">
          <span class="register-view__label">Date de naissance</span>
          <div class="register-view__control">
            <CalendarDays class="register-view__icon" />
            <input
              id="birthday"
              v-model="form.birthday"
              class="register-view__input"
              type="date"
              name="birthday"
              required
            >
          </div>
        </label>

        <p class="register-view__hint">
          En validant, vous créez un compte Kompagnon qui devra être activé par e-mail avant la première connexion.
        </p>

        <p
          v-if="errorMessage"
          class="feedback error feedback--error register-view__feedback"
          role="alert"
          aria-live="assertive"
        >
          <CircleAlert class="register-view__feedback-icon" />
          <span>{{ errorMessage }}</span>
        </p>

        <button
          type="submit"
          class="register-view__submit"
          :disabled="isSubmitting || !canSubmit"
        >
          <span>{{ isSubmitting ? "Création du compte..." : "Créer un compte" }}</span>
          <ArrowRight class="register-view__submit-icon" />
        </button>
      </form>

      <div
        v-if="successMessage"
        class="register-view__success"
        role="alert"
        aria-live="polite"
      >
        <div class="register-view__success-icon-wrap">
          <CircleCheck class="register-view__success-icon" />
        </div>
        <div class="register-view__success-copy">
          <strong>Inscription enregistrée</strong>
          <p class="feedback success feedback--success">
            {{ successMessage }}
          </p>
          <p>
            Pensez à vérifier vos e-mails, puis revenez ici pour vous connecter dès que votre compte est activé.
          </p>
        </div>
        <RouterLink
          :to="{ name: 'login' }"
          class="register-view__support-link"
        >
          Aller à la connexion
        </RouterLink>
      </div>
    </div>

    <template #footer>
      <p class="login-link">
        Déjà un compte ? <router-link
          :to="{ name: 'login' }"
          class="text-link"
        >
          Se connecter
        </router-link>
      </p>
    </template>
  </AuthLayout>
</template>

<style scoped>
.register-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.register-view__meta {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.register-view__chip {
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

.register-view__chip-icon {
  width: 0.95rem;
  height: 0.95rem;
}

.register-view__intro {
  margin: 0;
  color: var(--c-text-medium);
  line-height: 1.65;
}

.register-view__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-view__grid {
  display: grid;
  gap: 1rem;
}

.register-view__grid--two-columns {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.register-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.register-view__label {
  color: var(--c-navy);
  font-size: 0.86rem;
  font-weight: 700;
}

.register-view__control {
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

.register-view__control:focus-within {
  border-color: rgba(72, 175, 196, 0.4);
  box-shadow: 0 0 0 4px rgba(72, 175, 196, 0.12);
}

.register-view__control--password {
  grid-template-columns: auto 1fr auto;
}

.register-view__icon,
.register-view__toggle-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.register-view__icon {
  color: var(--c-text-light);
}

.register-view__input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--c-navy);
  font-size: 0.97rem;
  line-height: 1.4;
}

.register-view__input:focus {
  outline: none;
}

.register-view__input::placeholder {
  color: var(--c-text-light);
}

.register-view__toggle {
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

.register-view__toggle:hover {
  background: rgba(72, 175, 196, 0.12);
  color: var(--c-teal-dark);
}

.register-view__hint {
  margin: 0;
  color: var(--c-text-light);
  font-size: 0.83rem;
  line-height: 1.55;
}

.register-view__feedback {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.register-view__feedback-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.register-view__submit {
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

.register-view__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 22px 40px rgba(72, 175, 196, 0.26);
}

.register-view__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.register-view__submit-icon {
  width: 1rem;
  height: 1rem;
}

.register-view__success {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.2rem;
  border-radius: 1.5rem;
  background: rgba(46, 158, 109, 0.06);
  border: 1px solid rgba(46, 158, 109, 0.18);
}

.register-view__success-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.1rem;
  height: 3.1rem;
  border-radius: 50%;
  background: rgba(46, 158, 109, 0.14);
}

.register-view__success-icon {
  width: 1.4rem;
  height: 1.4rem;
  color: var(--c-success);
}

.register-view__success-copy {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.register-view__success-copy strong {
  color: var(--c-navy);
  font-size: 1rem;
}

.register-view__success-copy p {
  margin: 0;
  color: var(--c-text-medium);
  line-height: 1.6;
}

.register-view__support-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  background: rgba(30, 44, 56, 0.08);
  color: var(--c-navy);
  font-size: 0.86rem;
  font-weight: 700;
}

.register-view__support-link:hover {
  background: rgba(30, 44, 56, 0.12);
}

.login-link {
  text-align: center;
}

@media (max-width: 768px) {
  .register-view__grid--two-columns {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1024px) and (max-height: 900px) {
  .register-view {
    gap: 1rem;
  }

  .register-view__meta {
    gap: 0.7rem;
  }

  .register-view__intro {
    font-size: 0.9rem;
    line-height: 1.55;
  }

  .register-view__form {
    gap: 0.85rem;
  }

  .register-view__grid {
    gap: 0.85rem;
  }

  .register-view__control {
    min-height: 3.3rem;
    padding-left: 0.9rem;
  }

  .register-view__toggle {
    width: 2.5rem;
    height: 2.5rem;
  }

  .register-view__hint {
    font-size: 0.78rem;
  }

  .register-view__submit {
    min-height: 3.2rem;
    padding: 0.8rem 1rem;
  }

  .register-view__success {
    gap: 0.85rem;
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .register-view {
    gap: 1.25rem;
  }

  .register-view__control {
    min-height: 3.4rem;
    padding-left: 0.9rem;
  }

  .register-view__toggle {
    width: 2.55rem;
    height: 2.55rem;
  }

  .register-view__support-link {
    width: 100%;
  }
}
</style>
