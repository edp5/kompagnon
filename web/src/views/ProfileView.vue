<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { getUserProfile } from "@/adapters/users.js";
import { USER_GENRE } from "@/constants.js";
import { useAuthStore } from "@/stores/auth.js";

import { USER_ROLE } from "../../../api/src/shared/constants.js";

const router = useRouter();
const authStore = useAuthStore();
const profile = ref(null);
const errorMessage = ref("");
const isLoading = ref(true);

onMounted(async () => {
  const token = authStore.token;

  if (!token) {
    router.push({ name: "login" });
    return;
  }

  const result = await getUserProfile({ token });
  if (result.success) {
    profile.value = result.profile;
  } else {
    errorMessage.value = result.message ?? "Impossible de charger le profil.";
    if (result.errorCode === "SESSION_EXPIRED") {
      authStore.logout();
      router.push({ name: "login" });
    }
  }

  isLoading.value = false;
});
</script>

<template>
  <section class="profile-view">
    <h1>Mon profil</h1>

    <p v-if="isLoading">
      Chargement du profil...
    </p>

    <p
      v-else-if="errorMessage"
      class="feedback error"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessage }}
    </p>

    <dl
      v-else-if="profile"
      class="profile-details"
    >
      <dd>{{ USER_GENRE[profile.genre] }}</dd>
      <dt>Prénom</dt>
      <dd>{{ profile.firstname }}</dd>

      <dt>Nom</dt>
      <dd>{{ profile.lastname }}</dd>

      <dt>Email</dt>
      <dd>{{ profile.email }}</dd>

      <dt>Date de naissance</dt>
      <dd>{{ profile.birthday }}</dd>

      <dt>Vous êtes</dt>
      <dd>{{ USER_ROLE[profile.role] }}</dd>
    </dl>
  </section>
</template>

<style scoped>
.profile-view {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-details {
  display: grid;
  grid-template-columns: 160px 1fr;
  row-gap: 0.75rem;
  column-gap: 1rem;
}

.profile-details dt {
  font-weight: 700;
}

.profile-details dd {
  margin: 0;
}

.feedback.error {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 4px;
}
</style>
