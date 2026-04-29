<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { activateAccount } from "@/adapters/authentication.js";
import AuthLayout from "@/components/AuthLayout.vue";
import BaseCard from "@/components/BaseCard.vue";

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
  <AuthLayout
    title="Activation de compte"
    description="Finalisez votre inscription pour accéder à votre espace personnel Kompagnon."
    kicker="Activation"
  >
    <BaseCard class="activate-card">
      <div class="page-stack">
        <div
          v-if="loading"
          class="feedback feedback--neutral loading-feedback"
        >
          <p>Activation en cours...</p>
        </div>

        <div
          v-else
          class="page-stack"
        >
          <p
            class="feedback"
            :class="success ? ['success', 'feedback--success'] : ['error', 'feedback--error']"
          >
            {{ message }}
          </p>

          <router-link
            v-if="success"
            to="/login"
            class="text-link activate-link"
          >
            Aller à la connexion
          </router-link>

          <router-link
            v-else
            to="/register"
            class="text-link activate-link"
          >
            Retour à l'inscription
          </router-link>
        </div>
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.activate-card {
  animation: fadeInUp 0.6s ease-out;
}

.loading-feedback {
  animation: pulse 2s ease-in-out infinite;
}

.activate-link {
  animation: fadeInUp 0.6s ease-out 0.3s backwards;
}
</style>

