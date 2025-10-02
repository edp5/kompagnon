<script setup>
import packageInfo from "../../../package.json";
</script>

<template>
  <footer>
    <p>© {{ new Date().getFullYear() }} {{ packageInfo.author }}</p>
    <p>Version: {{ packageInfo.version }}</p>
  </footer>
</template>

<style scoped>
footer {
  text-align: center;
  padding: 1em;
  background-color: #f8f9fa;
  border-top: 1px solid #e7e7e7;
  font-size: 0.9em;
  color: #6c757d;
}

</style>
