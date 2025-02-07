<template>
  <div id="app">
    <TheHeader />
    <router-view />
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from "@/components/the-header/TheHeader.vue";
import TheFooter from "@/components/the-footer/TheFooter.vue";
</script>

<style scoped>
</style>
