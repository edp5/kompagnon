<script setup>
import { computed, ref } from "vue";

defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: undefined,
  },
  autocomplete: {
    type: String,
    default: "new-password",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
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
  <div class="password-field">
    <label
      class="password-field__label"
      :for="id"
    >
      {{ label }}
    </label>

    <div class="password-field__input-wrapper">
      <input
        :id="id"
        :name="name || id"
        :type="inputType"
        :value="modelValue"
        :autocomplete="autocomplete"
        :required="required"
        class="password-field__input"
        :disabled="disabled"
        @input="onInput"
      >

      <button
        type="button"
        class="password-field__toggle"
        :aria-pressed="isPasswordVisible.toString()"
        @click="toggleVisibility"
      >
        {{ isPasswordVisible ? "Masquer" : "Afficher" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.password-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.password-field__input-wrapper {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
}

.password-field__label {
  font-weight: 600;
}

.password-field__input {
  flex: 1;
}

.password-field__toggle {
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  background-color: transparent;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}
</style>

