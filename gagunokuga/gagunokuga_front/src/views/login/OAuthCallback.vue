<!-- <script setup>
import { onMounted, ref } from 'vue';
import { useLoginStore } from './login';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const loginStore = useLoginStore();
const route = useRoute();
const router = useRouter();
const baseURL = import.meta.env.VITE_API_URL;
const isLoading = ref(true);  // 로딩 상태 추가

onMounted(async () => {
  try {
    // URL에서 코드 파라미터 추출
    const code = new URL(window.location.href).searchParams.get("code");
    console.log("Retrieved code:", code);  // 코드 확인용 로그

    if (code) {
      // 백엔드로 인가 코드 전송
      const response = await axios.get(`${baseURL}/api/oauth/login/kakao/callback?code=${code}`, {
        withCredentials: true  // 쿠키 및 인증 헤더 전송을 위해 필요
      });
      
      console.log("Response headers:", response.headers);  // 응답 헤더 확인용 로그
      
      // 헤더에서 토큰 추출 (toLowerCase()를 사용하여 대소문자 구분 문제 해결)
      const accessToken = response.headers['authorization'] || response.headers['Authorization'];
      const refreshToken = response.headers['refresh-token'] || response.headers['Refresh-Token'];
      
      console.log("Extracted tokens:", { accessToken, refreshToken });  // 토큰 추출 확인용 로그

      if (accessToken && refreshToken) {
        // Bearer 접두사 제거
        const cleanAccessToken = accessToken.replace('Bearer ', '');
        
        // 토큰 저장
        await loginStore.handleLoginSuccess({
          accessToken: cleanAccessToken,
          refreshToken: refreshToken
        });
        
        console.log("Tokens saved, redirecting to home");
        router.push('/');
      } else {
        console.error('No tokens found in response headers');
        router.push('/login');
      }
    } else {
      console.error('No code found in URL');
      router.push('/login');
    }
  } catch (error) {
    console.error("Login process failed:", error);
    router.push('/login');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <p>로그인 처리 중입니다...</p>
  </div>
</template>

<style scoped>

</style> -->

<template>
  <div>

  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>

</style>

<!-- 프론트가 code 받아서 처리하는 방식임-->