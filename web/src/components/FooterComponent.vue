<script setup>
import packageInfo from "../../../package.json";
</script>

<template>
  <footer class="footer-component">
    <div class="footer-component__inner">
      <p>© {{ new Date().getFullYear() }} {{ packageInfo.author }}</p>
      <p>Version: {{ packageInfo.version }}</p>
    </div>
  </footer>
</template>

<style scoped></style>
