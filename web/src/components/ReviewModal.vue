<script setup>
import { nextTick, ref, watch } from "vue";

import { submitJourneyReview } from "@/adapters/journeys.js";
import KIcon from "@/components/KIcon.vue";
import { useAuthStore } from "@/stores/auth.js";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  foundJourneyId: {
    type: [Number, String],
    required: true,
  },
  userName: {
    type: String,
    default: "votre binôme",
  },
});

const emit = defineEmits(["close", "submitted"]);

const authStore = useAuthStore();

const modalRef = ref(null);
const closeBtnRef = ref(null);
const starRefs = ref([]);
const rating = ref(5);
const hoverRating = ref(0);
const comment = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");
let previousActiveElement = null;

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      previousActiveElement = document.activeElement;
      rating.value = 5;
      hoverRating.value = 0;
      comment.value = "";
      errorMessage.value = "";
      await nextTick();
      if (closeBtnRef.value) {
        closeBtnRef.value.focus();
      }
    } else {
      if (previousActiveElement && typeof previousActiveElement.focus === "function") {
        previousActiveElement.focus();
      }
    }
  },
);

function setRating(val) {
  rating.value = Math.max(1, Math.min(5, val));
}

function onHover(val) {
  hoverRating.value = val;
}

function onLeave() {
  hoverRating.value = 0;
}

function onKeydownStars(event, currentStar) {
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    event.preventDefault();
    const nextStar = Math.min(5, currentStar + 1);
    setRating(nextStar);
    starRefs.value[nextStar - 1]?.focus();
  } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    event.preventDefault();
    const prevStar = Math.max(1, currentStar - 1);
    setRating(prevStar);
    starRefs.value[prevStar - 1]?.focus();
  }
}

function onKeydownDialog(event) {
  if (!props.isOpen) return;

  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
    return;
  }

  if (event.key === "Tab") {
    if (!modalRef.value) return;
    const focusables = modalRef.value.querySelectorAll(
      "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])",
    );
    if (!focusables || focusables.length === 0) return;

    const firstEl = focusables[0];
    const lastEl = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === firstEl) {
      event.preventDefault();
      lastEl.focus();
    } else if (!event.shiftKey && document.activeElement === lastEl) {
      event.preventDefault();
      firstEl.focus();
    }
  }
}

async function onSubmit() {
  errorMessage.value = "";
  isSubmitting.value = true;

  const result = await submitJourneyReview({
    token: authStore.token,
    foundJourneyId: props.foundJourneyId,
    rating: rating.value,
    comment: comment.value,
  });

  isSubmitting.value = false;

  if (result.success) {
    emit("submitted", result.review);
    emit("close");
  } else {
    errorMessage.value = result.message ?? "Une erreur est survenue lors de l'envoi de votre avis.";
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="review-modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="review-modal-title"
    @click.self="emit('close')"
    @keydown="onKeydownDialog"
  >
    <div
      ref="modalRef"
      class="review-modal"
      tabindex="-1"
    >
      <header class="review-modal__header">
        <h2
          id="review-modal-title"
          class="review-modal__title"
        >
          Évaluer le trajet
        </h2>
        <button
          ref="closeBtnRef"
          type="button"
          class="review-modal__close"
          aria-label="Fermer la boîte de dialogue"
          @click="emit('close')"
        >
          <KIcon
            name="x"
            :size="18"
            aria-hidden="true"
          />
        </button>
      </header>

      <p class="review-modal__description">
        Comment s’est passé votre accompagnement avec <strong>{{ userName }}</strong> ?
      </p>

      <form
        class="review-modal__form"
        @submit.prevent="onSubmit"
      >
        <div class="review-modal__rating-section">
          <label class="review-modal__label">Note globale</label>
          <div
            class="review-modal__stars"
            role="radiogroup"
            aria-label="Note sur 5 étoiles"
          >
            <button
              v-for="star in 5"
              :key="star"
              :ref="(el) => { if (el) starRefs[star - 1] = el; }"
              type="button"
              class="review-modal__star-btn"
              :class="{
                'review-modal__star-btn--active': (hoverRating || rating) >= star,
              }"
              :aria-label="`${star} étoile${star > 1 ? 's' : ''}`"
              :aria-checked="rating === star"
              :tabindex="rating === star ? 0 : -1"
              role="radio"
              @click="setRating(star)"
              @mouseenter="onHover(star)"
              @mouseleave="onLeave"
              @keydown="onKeydownStars($event, star)"
            >
              <KIcon
                name="star"
                :size="28"
                aria-hidden="true"
              />
            </button>
          </div>
          <span class="review-modal__rating-hint">
            {{ rating === 5 ? "Parfait !" : rating === 4 ? "Très bien" : rating === 3 ? "Correct" : rating === 2 ? "Moyen" : "Décevant" }}
          </span>
        </div>

        <div class="review-modal__field">
          <label
            for="review-comment"
            class="review-modal__label"
          >
            Votre commentaire (optionnel)
          </label>
          <textarea
            id="review-comment"
            v-model="comment"
            class="review-modal__textarea"
            maxlength="1000"
            rows="4"
            placeholder="Partagez votre expérience (ponctualité, courtoisie, communication...)"
          />
          <span class="review-modal__char-count">{{ comment.length }}/1000</span>
        </div>

        <p
          v-if="errorMessage"
          class="review-modal__error"
          role="alert"
        >
          {{ errorMessage }}
        </p>

        <div class="review-modal__actions">
          <button
            type="button"
            class="review-modal__btn review-modal__btn--cancel"
            :disabled="isSubmitting"
            @click="emit('close')"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="review-modal__btn review-modal__btn--submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Envoi..." : "Publier mon avis" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.review-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(16, 24, 32, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.review-modal {
  background: var(--c-surface);
  border-radius: 1.5rem;
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-xl);
  width: min(100%, 480px);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  outline: none;
  animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.review-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.review-modal__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--c-navy);
  letter-spacing: -0.02em;
}

.review-modal__close {
  background: transparent;
  border: none;
  color: var(--c-text-medium);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.review-modal__close:hover {
  background: var(--c-teal-light);
  color: var(--c-teal-dark);
}

.review-modal__close:focus-visible {
  outline: 2px solid var(--c-teal);
  outline-offset: 2px;
}

.review-modal__description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--c-text-medium);
  line-height: 1.5;
}

.review-modal__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.review-modal__rating-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--c-teal-light);
  border-radius: 1rem;
  border: 1px solid rgba(72, 175, 196, 0.2);
}

.review-modal__label {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--c-text-medium);
}

.review-modal__stars {
  display: flex;
  gap: 0.35rem;
}

.review-modal__star-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--c-text-light);
  border-radius: 0.5rem;
  transition: transform 0.15s, color 0.15s;
}

.review-modal__star-btn:hover {
  transform: scale(1.15);
}

.review-modal__star-btn:focus-visible {
  outline: 2px solid var(--c-teal);
  outline-offset: 2px;
}

.review-modal__star-btn--active {
  color: #f59e0b;
}

.review-modal__rating-hint {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--c-navy);
}

.review-modal__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.review-modal__textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.875rem;
  border: 1px solid var(--c-border);
  background: var(--c-bg);
  color: var(--c-text);
  font-family: inherit;
  font-size: 0.92rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-sizing: border-box;
}

.review-modal__textarea:focus {
  border-color: var(--c-teal);
  box-shadow: 0 0 0 3px var(--c-teal-shadow);
  background: var(--c-surface);
}

.review-modal__char-count {
  align-self: flex-end;
  font-size: 0.75rem;
  color: var(--c-text-light);
}

.review-modal__error {
  margin: 0;
  padding: 0.75rem 1rem;
  background: var(--c-danger-bg);
  border: 1px solid var(--c-danger-border);
  border-radius: 0.75rem;
  color: var(--c-danger);
  font-size: 0.85rem;
}

.review-modal__actions {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.review-modal__btn {
  min-height: 2.85rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.review-modal__btn--cancel {
  background: transparent;
  border: 1px solid var(--c-border);
  color: var(--c-text-medium);
}

.review-modal__btn--cancel:hover:not(:disabled) {
  background: var(--c-bg);
  color: var(--c-text);
}

.review-modal__btn--cancel:focus-visible {
  outline: 2px solid var(--c-teal);
  outline-offset: 2px;
}

.review-modal__btn--submit {
  background: linear-gradient(135deg, var(--c-teal) 0%, var(--c-teal-dark) 100%);
  color: #ffffff;
  box-shadow: var(--shadow-teal);
}

.review-modal__btn--submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--c-teal-shadow);
}

.review-modal__btn--submit:focus-visible {
  outline: 2px solid var(--c-navy);
  outline-offset: 2px;
}

.review-modal__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
