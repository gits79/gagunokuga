<script setup>
  import TheHeader from "@/components/the-header/TheHeader.vue";
  import TheFooter from "@/components/the-footer/TheFooter.vue";
  import "@/styles/global.css";
</script>

<template>
  <div >
    <TheHeader />
    <router-view />
    <TheFooter />
  </div>
</template>


<style scoped>
</style>
