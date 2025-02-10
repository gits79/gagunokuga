<script setup>
  import "@/styles/tailwindcss.css";
  import { useRoute } from 'vue-router';
  import TheHeader from "@/components/the-header/TheHeader.vue";
</script>

<template>
  <!-- 현재 라우터의 meta에 showHeader가 true일 경우에만 TheHeader 표시 -->
  <TheHeader v-if="route.meta.showHeader" />
  <div >
    <router-view />
  </div>
</template>


<style scoped>
</style>
