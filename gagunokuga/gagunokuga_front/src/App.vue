<script setup>
import TheHeader from "@/components/the-header/TheHeader.vue";
import { useRoute } from 'vue-router';
import "@/styles/global.css";
import { useLoginStore } from "@/views/login/login";
import { ref, onMounted } from 'vue';
import axios from "axios";

const loginStore = useLoginStore();
// 조건에 따라 헤더 출현 여부 조정.(index.js)
const route = useRoute();

onMounted(() => {
  // 로컬스토리지에서 토큰을 확인하고 store 상태 복원
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  console.log('Tokens in localStorage:', { accessToken, refreshToken }); // 로그 추가


  if (accessToken) {
    loginStore.state.token = accessToken;
    if (refreshToken) {
      loginStore.state.refreshToken = refreshToken;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
});
</script>

<template>
  <div >
    <!-- 현재 라우터의 meta에 showHeader가 true일 경우에만 TheHeader 표시 -->
    <TheHeader v-if="route.meta.showHeader" />
    <router-view />
  </div>
</template>


<style scoped>
</style>
