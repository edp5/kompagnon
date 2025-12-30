<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { activateAccount } from "@/adapters/authentication.js";

const route = useRoute();
const loading = ref(true);
const message = ref("");
const success = ref(false);

onMounted(async () => {
  const token = route.query.token;

  if (!token) {
    message.value = "Token d'activation manquant.";
    success.value = false;
    loading.value = false;
    return;
  }

  const result = await activateAccount({ token });
  message.value = result.message;
  success.value = result.success;
  loading.value = false;
});
</script>

<template>
  <div class="activation-container">
    <h1>Activation de compte</h1>

    <div
      v-if="loading"
      class="loading"
    >
      <p>Activation en cours...</p>
    </div>

    <div
      v-else
      class="result"
    >
      <p :class="{ 'success-message': success, 'error-message': !success }">
        {{ message }}
      </p>

      <router-link
        v-if="success"
        to="/login"
        class="action-link"
      >
        Aller à la connexion
      </router-link>

      <router-link
        v-else
        to="/register"
        class="action-link"
      >
        Retour à l'inscription
      </router-link>
    </div>
  </div>
</template>
