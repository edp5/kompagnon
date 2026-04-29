<script setup>
import { reactive, ref } from "vue";
import { RouterLink } from "vue-router";

import { registerNewUser } from "@/adapters/authentication.js";
import AuthLayout from "@/components/AuthLayout.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
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
  <AuthLayout
    title="Créer un compte"
    description="Rejoignez Kompagnon et accédez à l'accompagnement dont vous avez besoin."
  >
    <form
      v-if="!successMessage"
      class="form-grid"
      @submit.prevent="handleSubmit"
    >
      <div class="form-grid form-grid--two-columns">
        <BaseInput
          id="firstname"
          v-model="form.firstname"
          type="text"
          name="firstname"
          label="Prénom"
          autocomplete="given-name"
          placeholder="Théo"
          :required="true"
        />

        <BaseInput
          id="lastname"
          v-model="form.lastname"
          type="text"
          name="lastname"
          label="Nom de famille"
          autocomplete="family-name"
          placeholder="Dupont"
          :required="true"
        />
      </div>

      <BaseInput
        id="email"
        v-model="form.email"
        type="email"
        name="email"
        label="Adresse e‑mail"
        autocomplete="email"
        placeholder="theo.dupont@example.fr"
        :required="true"
      />

      <PasswordComponent
        id="password"
        v-model="form.password"
        name="password"
        label="Mot de passe"
        autocomplete="new-password"
        :required="true"
      />

      <PasswordComponent
        id="passwordConfirmation"
        v-model="form.passwordConfirmation"
        name="passwordConfirmation"
        label="Confirmer le mot de passe"
        autocomplete="new-password"
        :required="true"
      />

      <BaseInput
        id="birthday"
        v-model="form.birthday"
        type="date"
        name="birthday"
        label="Date de naissance"
        :required="true"
      />

      <BaseButton
        type="submit"
        :disabled="isSubmitting"
        :full-width="true"
      >
        {{ isSubmitting ? "Création du compte..." : "Créer un compte" }}
      </BaseButton>
    </form>

    <p
      v-if="successMessage"
      class="feedback success feedback--success"
      role="alert"
      aria-live="polite"
    >
      {{ successMessage }}
    </p>

    <p
      v-if="errorMessage"
      class="feedback error feedback--error"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessage }}
    </p>

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

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.form-grid {
  animation: fadeInUp 0.6s ease-out;
}

.form-grid > * {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.form-grid > :nth-child(1) { animation-delay: 0s; }
.form-grid > :nth-child(2) { animation-delay: 0.05s; }
.form-grid > :nth-child(3) { animation-delay: 0.1s; }
.form-grid > :nth-child(4) { animation-delay: 0.15s; }
.form-grid > :nth-child(5) { animation-delay: 0.2s; }
.form-grid > :nth-child(6) { animation-delay: 0.25s; }
.form-grid > :nth-child(7) { animation-delay: 0.3s; }

.feedback {
  animation: scaleIn 0.4s ease-out;
}

.login-link {
  text-align: center;
  animation: fadeInUp 0.8s ease-out 0.4s backwards;
}
</style>
