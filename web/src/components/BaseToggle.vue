<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

function onChange(event) {
  emit("update:modelValue", event.target.checked);
}
</script>

<template>
  <label
    class="base-toggle"
    :class="{ 'base-toggle--disabled': disabled }"
    :for="id"
  >
    <input
      :id="id"
      type="checkbox"
      class="base-toggle__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
    >
    <span class="base-toggle__track" />
  </label>
</template>

<style scoped>
.base-toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
  cursor: pointer;
  flex-shrink: 0;
  min-width: 48px;
  min-height: 28px;
}

.base-toggle--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-toggle__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.base-toggle__track {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #d1d5db;
  transition: background 0.2s ease;
}

.base-toggle__track::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s ease;
}

.base-toggle__input:checked + .base-toggle__track {
  background: var(--kompagnon-turquoise);
}

.base-toggle__input:checked + .base-toggle__track::after {
  transform: translateX(20px);
}
</style>


