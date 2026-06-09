<script setup>
function focusMainContent() {
  document.getElementById("main-content")?.focus();
}
</script>

<template>
  <div class="app-shell">
    <button
      type="button"
      class="app-shell__skip-link"
      @click="focusMainContent"
    >
      Aller au contenu principal
    </button>

    <div
      class="app-shell__ambient app-shell__ambient--top"
      aria-hidden="true"
    />
    <div
      class="app-shell__ambient app-shell__ambient--bottom"
      aria-hidden="true"
    />

    <div class="app-shell__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100%;
  background:
    radial-gradient(circle at top right, rgba(158, 212, 217, 0.22), transparent 28%),
    linear-gradient(160deg, var(--c-cream) 0%, #faf6f1 58%, rgba(72, 175, 196, 0.1) 100%);
}

.app-shell__skip-link {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 40;
  border: none;
  transform: translateY(-200%);
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: var(--brand-navy);
  color: white;
  font-weight: 700;
}

.app-shell__skip-link:focus-visible {
  transform: translateY(0);
}

.app-shell__ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(18px);
  pointer-events: none;
}

.app-shell__ambient--top {
  top: 2rem;
  right: 2rem;
  width: 16rem;
  height: 16rem;
  background: rgba(158, 212, 217, 0.2);
}

.app-shell__ambient--bottom {
  left: 1rem;
  bottom: 1rem;
  width: 12rem;
  height: 12rem;
  background: rgba(72, 175, 196, 0.12);
}

.app-shell__content {
  position: relative;
  z-index: 1;
  min-height: 100%;
}
</style>
