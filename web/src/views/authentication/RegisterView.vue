<script setup>
import { reactive, ref } from "vue";

import { registerNewUser } from "@/adapters/authentication.js";
import PasswordComponent from "@/components/PasswordComponent.vue";

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

function resetFeedback() {
  successMessage.value = "";
  errorMessage.value = "";
}

function resetForm() {
  Object.assign(form, initialFormState());
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
</script>

<template>
  <section class="register-view">
    <h1>Créer un compte</h1>

    <form
      v-if="!successMessage"
      class="register-form"
      @submit.prevent="handleSubmit"
    >
      <div class="form-control">
        <label for="firstname">Prénom</label>
        <input
          id="firstname"
          v-model="form.firstname"
          type="text"
          name="firstname"
          autocomplete="given-name"
          required
        >
      </div>

      <div class="form-control">
        <label for="lastname">Nom de famille</label>
        <input
          id="lastname"
          v-model="form.lastname"
          type="text"
          name="lastname"
          autocomplete="family-name"
          required
        >
      </div>

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

      <PasswordComponent
        id="passwordConfirmation"
        v-model="form.passwordConfirmation"
        name="passwordConfirmation"
        label="Confirmer le mot de passe"
        :required="true"
      />

      <div class="form-control">
        <label for="birthday">Date de naissance</label>
        <input
          id="birthday"
          v-model="form.birthday"
          type="date"
          name="birthday"
          required
        >
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Création du compte..." : "Créer un compte" }}
      </button>
    </form>

    <p
      v-if="successMessage"
      class="feedback success"
      role="alert"
      aria-live="polite"
    >
      {{ successMessage }}
    </p>

    <p
      v-if="errorMessage"
      class="feedback error"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessage }}
    </p>

    <p class="login-link">
      Déjà un compte ? <router-link :to="{ name: 'login' }">
        Se connecter
      </router-link>
    </p>
  </section>
</template>

<style scoped>
.register-view {
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.register-form {
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

.feedback.success {
  background-color: #dcfce7;
  color: #166534;
}

.feedback.error {
  background-color: #fee2e2;
  color: #991b1b;
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
}
</style>
