<script setup>
defineProps({
  subtitle: {
    type: String,
    default: "L'accompagnement accessible, pensé pour tous.",
  },
  compact: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="brand-logo"
    :class="{ 'brand-logo--compact': compact }"
  >
    <img
      class="brand-logo__image"
      src="/kompagnon-logo.png"
      alt="Logo Kompagnon"
    >

    <div class="brand-logo__content">
      <span class="brand-kicker">Kompagnon</span>
      <strong class="brand-logo__title">Accompagnement inclusif</strong>
      <p
        v-if="!compact"
        class="brand-logo__subtitle muted-text"
      >
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
}

.brand-logo--compact {
  gap: 0.75rem;
}

.brand-logo__image {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
  flex-shrink: 0;
}

.brand-logo--compact .brand-logo__image {
  width: 2.75rem;
  height: 2.75rem;
}

.brand-logo__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.brand-logo__title {
  font-size: clamp(1rem, 2.4vw, 1.25rem);
}

.brand-logo__subtitle {
  max-width: 28rem;
}
</style>

