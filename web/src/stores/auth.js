import { defineStore } from "pinia";
import { ref } from "vue";

const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "auth_user_id";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem(TOKEN_KEY));
  const userId = ref(localStorage.getItem(USER_ID_KEY) ? Number(localStorage.getItem(USER_ID_KEY)) : null);
  const isJustLoggedIn = ref(false); // Flag pour afficher le loader après login/register
  const isLoadingData = ref(false); // Flag pour afficher le loader lors de synchro/chargement données

  function setAuth(newToken, newUserId) {
    token.value = newToken;
    userId.value = newUserId;
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_ID_KEY, String(newUserId));
    isJustLoggedIn.value = true; // Active le loader au login
  }

  function logout() {
    token.value = null;
    userId.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    isJustLoggedIn.value = false;
    isLoadingData.value = false;
  }

  // Méthodes pour gérer le loader lors de synchro/chargement de données
  function startDataLoading() {
    isLoadingData.value = true;
  }

  function stopDataLoading() {
    isLoadingData.value = false;
  }

  return {
    logout,
    setAuth,
    token,
    userId,
    isJustLoggedIn,
    isLoadingData,
    startDataLoading,
    stopDataLoading,
  };
});
