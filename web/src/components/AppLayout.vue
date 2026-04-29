<script setup>
import { RouterView } from "vue-router";

import BottomNavigation from "@/components/BottomNavigation.vue";
import DesktopSidebar from "@/components/DesktopSidebar.vue";
import TopBar from "@/components/TopBar.vue";
</script>

<template>
  <div class="app-layout">
    <DesktopSidebar />
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
      <BottomNavigation />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  background: transparent;
}

.app-layout__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 100vh;
  min-height: 100dvh;
  min-width: 0;
  width: 100%;
}

.app-layout__main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: calc(5.75rem + env(safe-area-inset-bottom));
  width: 100%;
}

.app-layout__viewport {
  min-height: 100%;
  width: 100%;
}

/* Breakpoint intermédiaire pour tablettes */
@media (max-width: 1024px) and (min-width: 641px) {
  .app-layout__main {
    padding-bottom: calc(5.75rem + env(safe-area-inset-bottom));
  }
}

/* Breakpoint desktop */
@media (min-width: 1024px) {
  .app-layout {
    height: 100vh;
    height: 100dvh;
  }

  .app-layout__main {
    padding-bottom: 0;
  }
}
</style>
