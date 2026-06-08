const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Search for addresses matching a free-text query using the OpenStreetMap
 * Nominatim service. Returns a normalized list of suggestions, each holding the
 * display label and the GPS coordinates expected by the journeys API.
 * @param {string} query - The free-text address to look up.
 * @returns {Promise<{success: boolean, results?: Array<{label: string, lat: number, lon: number}>, message?: string}>}
 */
async function searchAddress(query) {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) {
    return { success: true, results: [] };
  }

  try {
    const params = new URLSearchParams({
      q: trimmedQuery,
      format: "json",
      addressdetails: "0",
      limit: "5",
    });

    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Impossible de rechercher l'adresse. Veuillez réessayer.",
      };
    }

    const data = await response.json();
    const results = (Array.isArray(data) ? data : []).map((place) => ({
      label: place.display_name,
      lat: Number(place.lat),
      lon: Number(place.lon),
    }));

    return { success: true, results };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le service d'adresses. Veuillez réessayer plus tard.",
    };
  }
}

export { searchAddress };
