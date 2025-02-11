<script setup>
import { onMounted, ref } from 'vue';
import { useLoginStore } from './login';
import { useRoute, useRouter } from 'vue-router';

const loginStore = useLoginStore();
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);

onMounted(async () => {
  try {
    console.log("Full query params:", route.query);
    
    // URL에서 직접 토큰 추출
    const accessToken = route.query.accessToken;
    const refreshToken = route.query.refreshToken;
    
    console.log("Extracted tokens:", { 
      accessToken: accessToken, 
      refreshToken: refreshToken 
    });

    if (accessToken && refreshToken) {
      // 토큰 저장
      await loginStore.handleLoginSuccess({
        accessToken,
        refreshToken
      });
      
      console.log("Tokens saved, redirecting to home");
      router.push('/');
    } else {
      console.error('No tokens received');
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