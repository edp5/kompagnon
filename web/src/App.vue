<script setup>
import { onBeforeMount, ref } from "vue";
import { RouterView } from "vue-router";

import { apiCheck } from "@/adapters/api-check.js";
import AccessibilityPanel from "@/components/AccessibilityPanel.vue";
import AppShell from "@/components/AppShell.vue";

const apiIsOk = ref(false);

onBeforeMount(async () => {
  apiIsOk.value = await apiCheck();
});
</script>

<template>
  <AppShell v-if="apiIsOk">
    <RouterView />
    <AccessibilityPanel />
  </AppShell>
</template>

<style scoped></style>
