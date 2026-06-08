<script setup>
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-vue-next";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { loginUser } from "@/adapters/authentication.js";
import AuthLayout from "@/components/AuthLayout.vue";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

function initialFormState() {
  return {
    email: "",
    password: "",
  };
}

const form = reactive(initialFormState());
const isSubmitting = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);

const canSubmit = computed(() => Boolean(form.email.trim()) && Boolean(form.password));

function resetFeedback() {
  errorMessage.value = "";
}

async function handleSubmit() {
  resetFeedback();
  isSubmitting.value = true;

  const result = await loginUser(form);

  if (result.success) {
    authStore.setAuth(result.token, result.userId);
    const redirectTarget = typeof route.query.redirect === "string"
      ? route.query.redirect
      : { name: "home" };

    router.push(redirectTarget);
  } else {
    errorMessage.value =
      result.message ?? "Une erreur est survenue lors de la connexion.";
  }

  isSubmitting.value = false;
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <AuthLayout
    title="Bon retour sur Kompagnon"
    kicker="Connexion sécurisée"
    description="Accédez à votre espace personnel, retrouvez vos volontaires et reprenez votre parcours en toute sérénité."
    hero-title="Revenez dans votre espace Kompagnon avec une connexion plus claire et plus rassurante."
    hero-description="Nous avons repris l’esprit du design de référence pour créer une expérience plus douce, plus visible et plus fidèle à notre univers solidaire."
  >
    <div class="login-view">
      <div class="login-view__meta">
        <span class="login-view__chip">
          <ShieldCheck class="login-view__chip-icon" />
          Vos accès restent protégés
        </span>
        <p class="login-view__intro">
          Utilisez l’adresse e-mail associée à votre compte pour retrouver votre tableau de bord, vos échanges et vos repères d’accessibilité.
        </p>
      </div>

      <form
        class="login-view__form"
        @submit.prevent="handleSubmit"
      >
        <label class="login-view__field">
          <span class="login-view__label">Adresse e-mail</span>
          <div class="login-view__control">
            <Mail class="login-view__icon" />
            <input
              id="email"
              v-model="form.email"
              class="login-view__input"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="vous@exemple.fr"
              required
            >
          </div>
        </label>

        <label class="login-view__field">
          <span class="login-view__label">Mot de passe</span>
          <div class="login-view__control login-view__control--password">
            <Lock class="login-view__icon" />
            <input
              id="password"
              v-model="form.password"
              class="login-view__input"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              autocomplete="current-password"
              placeholder="Votre mot de passe"
              required
            >
            <button
              type="button"
              class="login-view__toggle"
              :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              :aria-pressed="showPassword.toString()"
              @click="togglePasswordVisibility"
            >
              <EyeOff
                v-if="showPassword"
                class="login-view__toggle-icon"
              />
              <Eye
                v-else
                class="login-view__toggle-icon"
              />
            </button>
          </div>
        </label>

        <p class="login-view__hint">
          Besoin d’un accès ? Votre compte doit d’abord être activé via l’e-mail reçu après inscription.
        </p>

        <p
          v-if="errorMessage"
          class="feedback error feedback--error login-view__feedback"
          role="alert"
          aria-live="assertive"
        >
          <CircleAlert class="login-view__feedback-icon" />
          <span>{{ errorMessage }}</span>
        </p>

        <button
          type="submit"
          class="login-view__submit"
          :disabled="isSubmitting || !canSubmit"
        >
          <span>{{ isSubmitting ? "Connexion en cours..." : "Se connecter" }}</span>
          <ArrowRight class="login-view__submit-icon" />
        </button>
      </form>

      <div class="login-view__support-card">
        <div>
          <strong>Nouveau sur Kompagnon ?</strong>
          <p>Créez votre compte pour rejoindre un parcours simple, humain et accessible.</p>
        </div>
        <router-link
          :to="{ name: 'register' }"
          class="login-view__support-link"
        >
          Créer un compte
        </router-link>
      </div>
    </div>

    <template #footer>
      <p class="register-link">
        Pas encore de compte ? <router-link
          :to="{ name: 'register' }"
          class="text-link"
        >
          S'inscrire
        </router-link>
      </p>
    </template>
  </AuthLayout>
</template>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-view__meta {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.login-view__chip {
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

.login-view__chip-icon {
  width: 0.95rem;
  height: 0.95rem;
}

.login-view__intro {
  margin: 0;
  color: var(--c-text-medium);
  line-height: 1.65;
}

.login-view__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.login-view__label {
  color: var(--c-navy);
  font-size: 0.86rem;
  font-weight: 700;
}

.login-view__control {
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

.login-view__control:focus-within {
  border-color: rgba(72, 175, 196, 0.4);
  box-shadow: 0 0 0 4px rgba(72, 175, 196, 0.12);
}

.login-view__control--password {
  grid-template-columns: auto 1fr auto;
}

.login-view__icon,
.login-view__toggle-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.login-view__icon {
  color: var(--c-text-light);
}

.login-view__input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--c-navy);
  font-size: 0.97rem;
  line-height: 1.4;
}

.login-view__input:focus {
  outline: none;
}

.login-view__input::placeholder {
  color: var(--c-text-light);
}

.login-view__toggle {
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

.login-view__toggle:hover {
  background: rgba(72, 175, 196, 0.12);
  color: var(--c-teal-dark);
}

.login-view__hint {
  margin: 0;
  color: var(--c-text-light);
  font-size: 0.83rem;
  line-height: 1.55;
}

.login-view__feedback {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.login-view__feedback-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.login-view__submit {
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

.login-view__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 22px 40px rgba(30, 44, 56, 0.24);
}

.login-view__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-view__submit-icon {
  width: 1rem;
  height: 1rem;
}

.login-view__support-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 1.35rem;
  background: rgba(30, 44, 56, 0.04);
  border: 1px solid rgba(30, 44, 56, 0.08);
}

.login-view__support-card strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--c-navy);
  font-size: 0.95rem;
}

.login-view__support-card p {
  margin: 0;
  color: var(--c-text-medium);
  font-size: 0.84rem;
  line-height: 1.5;
}

.login-view__support-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.12);
  color: var(--c-teal-dark);
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}

.login-view__support-link:hover {
  background: rgba(72, 175, 196, 0.18);
}

.register-link {
  text-align: center;
}

@media (max-width: 768px) {
  .login-view__support-card {
    flex-direction: column;
    align-items: stretch;
  }

  .login-view__support-link {
    width: 100%;
  }
}

@media (min-width: 1024px) and (max-height: 900px) {
  .login-view {
    gap: 1rem;
  }

  .login-view__meta {
    gap: 0.7rem;
  }

  .login-view__intro {
    font-size: 0.92rem;
    line-height: 1.55;
  }

  .login-view__form {
    gap: 0.85rem;
  }

  .login-view__control {
    min-height: 3.35rem;
    padding-left: 0.9rem;
  }

  .login-view__toggle {
    width: 2.5rem;
    height: 2.5rem;
  }

  .login-view__hint {
    font-size: 0.78rem;
  }

  .login-view__submit {
    min-height: 3.2rem;
    padding: 0.8rem 1rem;
  }

  .login-view__support-card {
    padding: 0.85rem 1rem;
  }

  .login-view__support-card p {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .login-view {
    gap: 1.25rem;
  }

  .login-view__control {
    min-height: 3.4rem;
    padding-left: 0.9rem;
  }

  .login-view__toggle {
    width: 2.55rem;
    height: 2.55rem;
  }
}
</style>
