import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(null);
  const userId = ref(null);

  function setAuth(newToken, newUserId) {
    token.value = newToken;
    userId.value = newUserId;
  }

  function logout() {
    token.value = null;
    userId.value = null;
  }

  return { logout, setAuth, token, userId };
});
