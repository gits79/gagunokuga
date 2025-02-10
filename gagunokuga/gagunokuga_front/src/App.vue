<script setup>
import TheHeader from "@/components/the-header/TheHeader.vue";
import TheFooter from "@/components/the-footer/TheFooter.vue";
import "@/styles/global.css";
import { useLoginStore } from "@/views/login/login";
import { onMounted } from 'vue';

const loginStore = useLoginStore();

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
    <TheHeader />
    <router-view />
    <TheFooter />
  </div>
</template>


<style scoped>
</style>
