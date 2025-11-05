<script setup>
import { computed, ref } from "vue";

defineProps({
  label: {
    type: String,
    default: "mot de passe",
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const showPassword = ref(false);
const inputType = computed(() => (showPassword.value ? "text" : "password"));

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function updateValue(event) {
  emit("update:modelValue", event.target.value);
}
</script>

<template>
  <div class="password-component">
    <label :for="`password-${label}`">{{ label }}</label>
    <div class="password-input-wrapper">
      <input
        :id="`password-${label}`"
        :type="inputType"
        :value="modelValue"
        @input="updateValue"
        class="password-input"
      />
      <button
        type="button"
        @click="togglePasswordVisibility"
        class="toggle-button"
        :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
      >
        {{ showPassword ? "👁️" : "👁️‍🗨️" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.password-component {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  width: 100%;
  padding: 0.5em;
  padding-right: 2.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.toggle-button {
  position: absolute;
  right: 0.5em;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25em;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-button:hover {
  opacity: 0.7;
}

label {
  font-weight: 500;
  color: #333;
}
</style>

