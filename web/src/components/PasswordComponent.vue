<script setup>
import { computed, ref } from "vue";

defineProps({
  id: {
    type: String,
    description: "Unique identifier for the input field",
    required: true,
  },
  label: {
    type: String,
    description: "Label for the password input field",
    required: true,
  },
  modelValue: {
    type: String,
    description: "The current value of the password input",
    default: "",
  },
  name: {
    type: String,
    description: "Name attribute for the input field",
    default: "",
  },
  required: {
    type: Boolean,
    description: "Whether the input field is required",
    default: false,
  },
  disabled: {
    type: Boolean,
    description: "Whether the input field is disabled",
    default: false,
  },
  autocomplete: {
    type: String,
    description: "Autocomplete attribute for the input field",
    default: undefined,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isPasswordVisible = ref(false);
const inputType = computed(() => (isPasswordVisible.value ? "text" : "password"));

function toggleVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value;
}

function onInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>

<template>
  <div class="password-component">
    <label
      class="base-label password-component__label"
      :for="id"
    >
      {{ label }}
    </label>

    <div class="password-component__input-wrapper">
      <input
        :id="id"
        :name="name || id"
        :type="inputType"
        :value="modelValue"
        :required="required"
        :autocomplete="autocomplete"
        class="password-component__input"
        :disabled="disabled"
        @input="onInput"
      >

      <button
        type="button"
        class="password-component__toggle"
        :aria-pressed="isPasswordVisible.toString()"
        @click="toggleVisibility"
      >
        {{ isPasswordVisible ? "Masquer" : "Afficher" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.password-component {
  width: 100%;
}

.password-component__input-wrapper {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
}

.password-component__input {
  flex: 1;
}

.password-component__toggle {
  width: auto;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: 600;
}
</style>

