const JOURNEYS_URL = "/api/journeys";

/**
 * Save the trip information for the authenticated user. Depending on the user's
 * role, the API records it as a passenger or a companion journey and uses it for
 * matching. All coordinates are required by the API and are expected to be
 * resolved beforehand (e.g. via geocoding).
 * @param {object} params - The trip information.
 * @param {string} params.token - The authenticated user's bearer token.
 * @param {string} params.departureAddress - Human readable departure address.
 * @param {string} params.arrivalAddress - Human readable arrival address.
 * @param {number} params.departureLat - Latitude of the departure location.
 * @param {number} params.departureLon - Longitude of the departure location.
 * @param {number} params.arrivalLat - Latitude of the arrival location.
 * @param {number} params.arrivalLon - Longitude of the arrival location.
 * @param {string} params.departureTime - ISO departure date-time.
 * @param {string} params.arrivalTime - ISO arrival date-time.
 * @returns {Promise<{success: boolean, journeyId?: string, message?: string}>}
 */
async function recordJourney({
  token,
  departureAddress,
  arrivalAddress,
  departureLat,
  departureLon,
  arrivalLat,
  arrivalLon,
  departureTime,
  arrivalTime,
}) {
  try {
    const response = await fetch(JOURNEYS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        departureAddress,
        arrivalAddress,
        departureLat,
        departureLon,
        arrivalLat,
        arrivalLon,
        departureTime,
        arrivalTime,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Session expirée. Merci de vous reconnecter.",
        };
      }

      return {
        success: false,
        message: "Impossible d'enregistrer le trajet. Veuillez réessayer.",
      };
    }

    const data = await response.json();
    return { success: true, journeyId: data?.data?.journeyId };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

export { recordJourney };
