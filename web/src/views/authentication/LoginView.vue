<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { loginUser } from "@/adapters/authentication.js";
import AuthLayout from "@/components/AuthLayout.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
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
  <AuthLayout
    title="Bon retour sur Kompagnon"
    description="Connectez-vous pour accéder à votre espace et retrouver vos volontaires."
  >
    <form
      class="form-grid"
      @submit.prevent="handleSubmit"
    >
      <BaseInput
        id="email"
        v-model="form.email"
        type="email"
        name="email"
        label="Adresse e‑mail"
        autocomplete="email"
        placeholder="vous@exemple.fr"
        :required="true"
      />

      <PasswordComponent
        id="password"
        v-model="form.password"
        name="password"
        label="Mot de passe"
        autocomplete="current-password"
        :required="true"
      />

      <BaseButton
        type="submit"
        :disabled="isSubmitting"
        :full-width="true"
      >
        {{ isSubmitting ? "Connexion en cours..." : "Se connecter" }}
      </BaseButton>
    </form>

    <p
      v-if="errorMessage"
      class="feedback error feedback--error"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessage }}
    </p>

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

.form-grid {
  animation: fadeInUp 0.6s ease-out;
}

.feedback {
  animation: slideInDown 0.4s ease-out;
}

.register-link {
  text-align: center;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}
</style>
