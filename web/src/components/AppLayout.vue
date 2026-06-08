<script setup>
import { ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";

import BottomNavigation from "@/components/BottomNavigation.vue";
import DesktopSidebar from "@/components/DesktopSidebar.vue";
import TopBar from "@/components/TopBar.vue";

const route = useRoute();
const isMenuOpen = ref(false);

// Close the mobile drawer whenever the route changes.
watch(() => route.fullPath, () => {
  isMenuOpen.value = false;
});
</script>

<template>
  <div class="app-layout">
    <DesktopSidebar
      :open="isMenuOpen"
      @close="isMenuOpen = false"
    />
    <div class="app-layout__body">
      <TopBar />
      <main
        id="main-content"
        class="app-layout__main"
        tabindex="-1"
      >
        <div class="app-layout__viewport">
          <RouterView />
        </div>
      </main>
      <BottomNavigation @open-menu="isMenuOpen = true" />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: transparent;
}

.app-layout__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  min-width: 0;
  width: 100%;
}

/* Single scroll container: only the main area scrolls, so the top bar and
   the bottom navigation stay pinned on every screen, mobile and desktop. */
.app-layout__main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  width: 100%;
}

.app-layout__viewport {
  min-height: 100%;
  width: 100%;
}

/* The bottom navigation is hidden on desktop via its own component styles. */
</style>
