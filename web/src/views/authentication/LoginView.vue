<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { loginUser } from "@/adapters/authentication.js";
import PasswordComponent from "@/components/PasswordComponent.vue";
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
</script>

<template>
  <section class="login-view">
    <h1>Se connecter</h1>

    <form
      class="login-form"
      @submit.prevent="handleSubmit"
    >
      <div class="form-control">
        <label for="email">Adresse e‑mail</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          required
        >
      </div>

      <PasswordComponent
        id="password"
        v-model="form.password"
        name="password"
        label="Mot de passe"
        :required="true"
      />

      <button
        type="submit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Connexion en cours..." : "Se connecter" }}
      </button>
    </form>

    <p
      v-if="errorMessage"
      class="feedback error"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessage }}
    </p>

    <p class="register-link">
      Pas encore de compte ? <router-link :to="{ name: 'register' }">
        S'inscrire
      </router-link>
    </p>
  </section>
</template>

<style scoped>
.login-view {
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-control {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-control label {
  display: flex;
  font-weight: 600;
}

:deep(input) {
  padding: 0.5rem;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #1e40af;
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.feedback {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
}

.feedback.error {
  background-color: #fee2e2;
  color: #991b1b;
}

.register-link {
  margin-top: 1.5rem;
  text-align: center;
}
</style>
