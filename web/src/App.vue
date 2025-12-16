<script setup>
import { onBeforeMount, ref } from "vue";
import { RouterView } from "vue-router";

import { apiCheck } from "@/adapters/api-check.js";
import FooterComponent from "@/components/FooterComponent.vue";

const apiIsOk = ref(false);

onBeforeMount(async () => {
  apiIsOk.value = await apiCheck();
});
</script>

<template>
  <div v-if="apiIsOk">
    <RouterView />
    <FooterComponent />
  </div>
</template>

<style scoped></style>
