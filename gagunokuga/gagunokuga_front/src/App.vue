<script setup>
import TheHeader from "@/components/the-header/TheHeader.vue";
import { useRoute, useRouter  } from 'vue-router';
import "@/styles/global.css";
import { useLoginStore } from "@/views/login/login";
import { ref, onMounted , onUnmounted } from 'vue';
import axios from "axios";

const loginStore = useLoginStore();
// 조건에 따라 헤더 출현 여부 조정.(index.js)
const route = useRoute();
const router = useRouter(); 
const checkInterval = ref(null); 

// 토큰 만료 체크 함수
const checkTokenExpiration = () => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (accessToken) {
    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      
      if (Date.now() >= expirationTime) {
        loginStore.logout();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error checking token:', error);
      loginStore.logout();
      router.push('/login');
    }
  }
};

onMounted(() => {
  // 로컬스토리지에서 토큰을 확인하고 store 상태 복원
  const accessToken = localStorage.getItem('accessToken');
  // const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken) {
    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;

      if (Date.now() >= expirationTime) {
        loginStore.logout();
        router.push('/login');
      } else {
        loginStore.state.token = accessToken;
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        loginStore.setupAxiosInterceptors();
        
        checkInterval.value = setInterval(checkTokenExpiration, 600000);
        
          checkTokenExpiration();
        
           loginStore.fetchUserInfo().catch((error) => {
          console.error('Failed to fetch user info:', error);
          if (error.response?.status === 401) {
            loginStore.logout();
            router.push('/login');
          }
        });
      }
    } catch (error) {
      console.error('Error parsing token:', error);
      loginStore.logout();
      router.push('/login');
    }
  }
});

// 컴포넌트 언마운트 시 interval 정리
onUnmounted(() => {
  if (checkInterval.value) {
    clearInterval(checkInterval.value);
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
