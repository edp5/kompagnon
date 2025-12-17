<template>
  <div class="activation-container">
    <div class="activation-card">
      <h1>Activation de compte</h1>
      
      <div v-if="loading" class="loading">
        <p>Activation en cours...</p>
      </div>

      <div v-else-if="message" :class="['message', success ? 'success' : 'error']">
        <p>{{ message }}</p>
      </div>

      <div v-if="!loading && success" class="actions">
        <router-link to="/login" class="btn btn-primary">
          Aller à la connexion
        </router-link>
      </div>

      <div v-if="!loading && !success" class="actions">
        <router-link to="/register" class="btn btn-secondary">
          Retour à l'inscription
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { activateAccount } from "@/adapters/authentication.js";

export default {
  name: "ActivationView",
  setup() {
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

    return {
      loading,
      message,
      success,
    };
  },
};
</script>

<style scoped>
.activation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.activation-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 400px;
  text-align: center;
}

h1 {
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.loading {
  padding: 20px 0;
}

.loading p {
  color: #667eea;
  font-size: 16px;
}

.message {
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.actions {
  margin-top: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5568d3;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}
</style>