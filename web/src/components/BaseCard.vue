<script setup>
import { computed } from "vue";

const props = defineProps({
  hero: {
    type: Boolean,
    default: false,
  },
  interactive: {
    type: Boolean,
    default: false,
  },
});

const classes = computed(() => [
  "base-card",
  {
    "base-card--hero": props.hero,
    "base-card--interactive": props.interactive,
  },
]);
</script>

<template>
  <article :class="classes">
    <slot />
  </article>
</template>

