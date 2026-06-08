<script setup>
import { ref, watch } from "vue";

import { searchAddress } from "@/adapters/geocoding.js";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object,
    default: null,
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const DEBOUNCE_DELAY = 400;
const MIN_QUERY_LENGTH = 3;

const query = ref(props.modelValue?.label ?? "");
const suggestions = ref([]);
const isOpen = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
let debounceTimer = null;

// Keep the displayed text in sync if the parent resets the selection.
watch(
  () => props.modelValue,
  (place) => {
    if (!place) {
      return;
    }
    query.value = place.label;
  },
);

function closeSuggestions() {
  isOpen.value = false;
  suggestions.value = [];
}

async function runSearch(value) {
  isLoading.value = true;
  errorMessage.value = "";

  const result = await searchAddress(value);

  isLoading.value = false;

  if (!result.success) {
    errorMessage.value = result.message ?? "Impossible de rechercher l'adresse.";
    closeSuggestions();
    return;
  }

  suggestions.value = result.results;
  isOpen.value = result.results.length > 0;
}

function onInput(event) {
  query.value = event.target.value;

  // Editing the field invalidates any previously resolved coordinates.
  if (props.modelValue) {
    emit("update:modelValue", null);
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  const value = query.value.trim();
  if (value.length < MIN_QUERY_LENGTH) {
    closeSuggestions();
    return;
  }

  debounceTimer = setTimeout(() => runSearch(value), DEBOUNCE_DELAY);
}

function selectSuggestion(place) {
  emit("update:modelValue", place);
  query.value = place.label;
  closeSuggestions();
}
</script>

<template>
  <div class="address-autocomplete">
    <label
      class="base-label"
      :for="id"
    >
      {{ label }}
    </label>

    <div
      class="address-autocomplete__control"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-owns="`${id}-listbox`"
      aria-haspopup="listbox"
    >
      <input
        :id="id"
        class="address-autocomplete__input"
        type="text"
        :value="query"
        :placeholder="placeholder"
        :required="required"
        autocomplete="off"
        role="searchbox"
        aria-autocomplete="list"
        :aria-controls="`${id}-listbox`"
        @input="onInput"
      >
      <span
        v-if="isLoading"
        class="address-autocomplete__status"
        aria-live="polite"
      >Recherche…</span>
    </div>

    <ul
      v-if="isOpen"
      :id="`${id}-listbox`"
      class="address-autocomplete__list"
      role="listbox"
      :aria-label="`Suggestions pour ${label}`"
    >
      <li
        v-for="(place, index) in suggestions"
        :key="`${place.lat}-${place.lon}-${index}`"
        class="address-autocomplete__option"
        role="option"
        :aria-selected="false"
        tabindex="0"
        @click="selectSuggestion(place)"
        @keydown.enter.prevent="selectSuggestion(place)"
        @keydown.space.prevent="selectSuggestion(place)"
      >
        {{ place.label }}
      </li>
    </ul>

    <small
      v-if="errorMessage"
      class="address-autocomplete__error"
      role="alert"
    >
      {{ errorMessage }}
    </small>
  </div>
</template>

<style scoped>
.address-autocomplete {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.address-autocomplete__control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 3.2rem;
  padding: 0.35rem 1rem;
  border-radius: 0.875rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(30, 44, 56, 0.1);
}

.address-autocomplete__control:focus-within {
  border-color: rgba(72, 175, 196, 0.4);
  box-shadow: 0 0 0 3px rgba(72, 175, 196, 0.12);
}

.address-autocomplete__input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--c-navy);
  font-size: 0.95rem;
}

.address-autocomplete__input:focus {
  outline: none;
}

.address-autocomplete__status {
  font-size: 0.78rem;
  color: var(--c-text-light);
  white-space: nowrap;
}

.address-autocomplete__list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 30;
  margin: 0.35rem 0 0;
  padding: 0.35rem;
  list-style: none;
  background: #ffffff;
  border: 1px solid rgba(30, 44, 56, 0.1);
  border-radius: 0.875rem;
  box-shadow: 0 18px 40px rgba(30, 44, 56, 0.12);
  max-height: 16rem;
  overflow-y: auto;
}

.address-autocomplete__option {
  padding: 0.6rem 0.75rem;
  border-radius: 0.625rem;
  font-size: 0.88rem;
  color: var(--c-text-medium);
  cursor: pointer;
}

.address-autocomplete__option:hover,
.address-autocomplete__option:focus {
  background: rgba(72, 175, 196, 0.1);
  color: var(--c-teal-dark);
  outline: none;
}

.address-autocomplete__error {
  color: var(--c-danger, #dc2626);
  font-size: 0.8rem;
}
</style>
