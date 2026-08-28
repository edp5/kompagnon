import { onUnmounted, ref } from "vue";

/**
 * Reactive wrapper around the browser Geolocation API.
 * @param {object} [options] - Behaviour options.
 * @param {boolean} [options.watch] - Keep tracking position changes instead of reading it once.
 * @param {PositionOptions} [options.positionOptions] - Native geolocation options (enableHighAccuracy, timeout, maximumAge).
 * @returns {{
 *   coords: import("vue").Ref<{latitude: number, longitude: number, accuracy: number}|null>,
 *   error: import("vue").Ref<string>,
 *   isLoading: import("vue").Ref<boolean>,
 *   isSupported: boolean,
 *   locate: () => void,
 * }}
 */
export function useGeolocation({ watch = false, positionOptions } = {}) {
  const isSupported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const coords = ref(null);
  const error = ref("");
  const isLoading = ref(false);
  let watchId = null;

  function handleSuccess(position) {
    coords.value = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
    error.value = "";
    isLoading.value = false;
  }

  function handleError(geolocationError) {
    isLoading.value = false;
    if (geolocationError.code === geolocationError.PERMISSION_DENIED) {
      error.value = "Vous avez refusé l'accès à votre position.";
    } else {
      error.value = "Impossible de récupérer votre position pour le moment.";
    }
  }

  /**
   * Requests (or starts watching) the user's position.
   */
  function locate() {
    if (!isSupported) {
      error.value = "La géolocalisation n'est pas disponible sur cet appareil.";
      return;
    }

    isLoading.value = true;
    if (watch) {
      watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, positionOptions);
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, positionOptions);
    }
  }

  onUnmounted(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
  });

  return { coords, error, isLoading, isSupported, locate };
}
