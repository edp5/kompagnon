<script setup>
import { ref, watch } from "vue";

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

const rating = ref(5);
const hoverRating = ref(0);
const comment = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      rating.value = 5;
      hoverRating.value = 0;
      comment.value = "";
      errorMessage.value = "";
    }
  },
);

function setRating(val) {
  rating.value = val;
}

function onHover(val) {
  hoverRating.value = val;
}

function onLeave() {
  hoverRating.value = 0;
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
  >
    <div class="review-modal glass-panel">
      <header class="review-modal__header">
        <h2
          id="review-modal-title"
          class="review-modal__title"
        >
          Évaluer le trajet
        </h2>
        <button
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
              type="button"
              class="review-modal__star-btn"
              :class="{
                'review-modal__star-btn--active': (hoverRating || rating) >= star,
              }"
              :aria-label="`${star} étoile${star > 1 ? 's' : ''}`"
              :aria-checked="rating === star"
              role="radio"
              @click="setRating(star)"
              @mouseenter="onHover(star)"
              @mouseleave="onLeave"
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
  background: #ffffff;
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.2);
  width: min(100%, 480px);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  color: var(--kompagnon-navy);
  letter-spacing: -0.02em;
}

.review-modal__close {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.review-modal__close:hover {
  background: #f1f5f9;
  color: var(--kompagnon-navy);
}

.review-modal__description {
  margin: 0;
  font-size: 0.95rem;
  color: #475569;
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
  background: rgba(72, 175, 196, 0.06);
  border-radius: 1rem;
  border: 1px solid rgba(72, 175, 196, 0.12);
}

.review-modal__label {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #64748b;
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
  color: #cbd5e1;
  transition: transform 0.15s, color 0.15s;
}

.review-modal__star-btn:hover {
  transform: scale(1.15);
}

.review-modal__star-btn--active {
  color: #f59e0b;
}

.review-modal__rating-hint {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
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
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: var(--kompagnon-navy);
  font-family: inherit;
  font-size: 0.92rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.review-modal__textarea:focus {
  border-color: var(--kompagnon-turquoise);
  box-shadow: 0 0 0 3px rgba(72, 175, 196, 0.2);
  background: #ffffff;
}

.review-modal__char-count {
  align-self: flex-end;
  font-size: 0.75rem;
  color: #94a3b8;
}

.review-modal__error {
  margin: 0;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  color: #b91c1c;
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
  border: 1px solid #cbd5e1;
  color: #475569;
}

.review-modal__btn--cancel:hover:not(:disabled) {
  background: #f1f5f9;
}

.review-modal__btn--submit {
  background: linear-gradient(135deg, var(--kompagnon-turquoise) 0%, #3093a8 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(72, 175, 196, 0.35);
}

.review-modal__btn--submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(72, 175, 196, 0.45);
}

.review-modal__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
