<script setup>
import { RouterView } from "vue-router";

import DesktopSidebar from "@/components/DesktopSidebar.vue";
</script>

<template>
  <div class="app-layout">
    <DesktopSidebar />
    <main class="app-layout__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-bg);
  background-image:
    radial-gradient(ellipse at 80% -10%, rgba(158, 212, 217, 0.25) 0%, transparent 45%),
    linear-gradient(160deg, var(--brand-cream) 0%, var(--brand-cream-warm) 65%, rgba(158, 212, 217, 0.12) 100%);
}

.app-layout__main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
}
</style>

