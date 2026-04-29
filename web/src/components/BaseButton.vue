<script setup>
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "primary",
    validator(value) {
      return ["primary", "secondary", "ghost"].includes(value);
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const classes = computed(() => [
  "base-button",
  `base-button--${props.variant}`,
  { "base-button--full-width": props.fullWidth },
]);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
  >
    <slot />
  </button>
</template>

