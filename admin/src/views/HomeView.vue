<script setup>
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <section class="home-view">
    <h1>Administration</h1>
    <button
      type="button"
      @click="handleLogout"
    >
      Se déconnecter
    </button>
  </section>
</template>

<style scoped>
.home-view {
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 1rem;
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
</style>
